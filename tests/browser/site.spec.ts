import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { base, site } from '../../site.config.mjs';
const route = (path = '') => base + path;

test('Chi sono: navigazione, biografia e dati strutturati essenziali', async ({
  page,
}) => {
  await page.goto(route(''));
  await page
    .getByRole('navigation', { name: 'Informazioni' })
    .getByRole('link', { name: 'Chi sono' })
    .click();
  await expect(page).toHaveURL(new RegExp(base + 'chi-sono/$'));
  await expect(page).toHaveTitle('Riccardo Vittori — Chi sono | FLOW');
  await expect(page.locator('.journey ol > li')).toHaveCount(3);
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const about = schemas
    .map((text) => JSON.parse(text))
    .find((schema) => schema['@type'] === 'AboutPage');
  expect(about.mainEntity).toEqual({
    '@type': 'Person',
    name: 'Riccardo Vittori',
    url: new URL(route('chi-sono/'), site).href,
  });
  await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
});

const paths = [
  route(''),
  route('taccuino/il-cercatore-da-dove-comincia-il-cammino/'),
  route('esplora/'),
  route('cerca/'),
  route('argomenti/ricerca/'),
  route('il-cercatore/'),
  route('manifesto/'),
  route('chi-sono/'),
];
for (const width of [360, 390, 768, 1280, 1440]) {
  test(`Layout e accessibilità a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const path of paths) {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await expect(page.locator('h1')).toHaveCount(1);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations).toEqual([]);
      expect(errors).toEqual([]);
    }
    await page.goto(route(''));
    await page
      .locator('img[loading="lazy"]')
      .evaluateAll((images) =>
        images.forEach((image) => image.setAttribute('loading', 'eager')),
      );
    await page.waitForFunction(() =>
      Array.from(document.images).every((image) => image.complete),
    );
    await page.screenshot({
      path: `artifacts/home-${width}.png`,
      fullPage: true,
    });
  });
}
test('Menu da tastiera, skip link e navigazione mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route(''));
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Vai al contenuto' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('.mobile-nav summary').focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('navigation', { name: 'Navigazione mobile' })
    .getByRole('link', { name: 'Esplora', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(base + 'esplora/$'));
});
test('Ricerca Pagefind e caso senza risultati', async ({ page }) => {
  await page.goto(route('cerca/'));
  const search = page.getByRole('textbox', { name: 'Cerca nel mondo FLOW' });
  await search.fill('tartufi');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  const links = await page
    .locator('.pagefind-ui__result-link')
    .evaluateAll((elements) => elements.map((a) => a.getAttribute('href')));
  expect(links.every((link) => link?.includes(route('')))).toBeTruthy();
  await search.fill('zzznonesistezzz');
  await expect(
    page.getByText('Nessun risultato per zzznonesistezzz'),
  ).toBeVisible();
});
test('Contenuti accessibili senza JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(
    'http://127.0.0.1:4321' +
      route('taccuino/il-cercatore-da-dove-comincia-il-cammino/'),
  );
  await expect(
    page.getByRole('heading', { name: 'Una domanda prima di una risposta' }),
  ).toBeVisible();
  await context.close();
});
test('Percorsi tematici: conteggi, articoli e ritorno al tema', async ({
  page,
}) => {
  await page.goto(route('esplora/'));
  await page
    .locator('#argomenti')
    .getByRole('link', { name: /Ricerca/ })
    .click();
  await expect(page).toHaveURL(/\/argomenti\/ricerca\/$/);
  const cards = page.locator('.story-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator('.dek').first()).toContainText(
    `${count} letture collegate`,
  );
  await cards.first().locator('h3 a').click();
  await page
    .getByRole('navigation', { name: 'Percorsi per argomento' })
    .getByRole('link', { name: /Ricerca/ })
    .click();
  await expect(page).toHaveURL(/\/argomenti\/ricerca\/$/);
});

test('Temi futuri senza collegamenti vuoti', async ({ page }) => {
  await page.goto(route('esplora/'));
  await expect(page.locator('.future-topics')).toHaveCount(0);
  await expect(page.locator('a[href*="/esperienze/"]')).toHaveCount(0);
  const response = await page.goto(route('argomenti/suolo/'));
  expect(response?.status()).toBe(404);
});

test('Percorsi tematici senza JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + route('esplora/'));
    await page
      .locator('#argomenti')
      .getByRole('link', { name: /Habitat/ })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Habitat');
    await expect(page.locator('.story-card').first()).toBeVisible();
  } finally {
    await context.close();
  }
});

test('404, riduzione movimento e metadati', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('404.html'));
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'sentiero',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
  await page.goto(route(''));
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    new URL(base, site).href,
  );
});
test('Percorso ordinato, andata e ritorno tra le tappe', async ({ page }) => {
  await page.goto(route('il-cercatore/'));
  await expect(page.locator('.reading-stops > li')).toHaveCount(3);
  await page.locator('.reading-stops h3 a').first().click();
  const navigation = page.getByRole('navigation', {
    name: 'Lettura guidata: Il Cercatore',
  });
  await expect(navigation).toContainText('Tappa 1 di 3');
  await navigation.locator('[rel=next]').click();
  await expect(navigation).toContainText('Tappa 2 di 3');
  await navigation.locator('[rel=prev]').click();
  await expect(navigation).toContainText('Tappa 1 di 3');
});

test('FLOW LOOP da tastiera e senza JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + route('manifesto/'));
    const summaries = page.locator('.loop-stops summary');
    await expect(summaries).toHaveCount(9);
    await summaries.nth(5).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.loop-stops details').nth(5)).toHaveAttribute(
      'open',
      '',
    );
    await expect(page.locator('.loop-stops details').nth(5)).toContainText(
      'sostenibilità economica',
    );
    await expect(
      page.getByRole('img', { name: 'Il sentiero che ritorna' }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test('Reflow 320px e testo al 200 per cento', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ['', 'il-cercatore/', 'manifesto/', 'chi-sono/']) {
    await page.goto(route(path));
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    const hidden = await page
      .locator('main a')
      .evaluateAll(
        (links) =>
          links.filter((link) => getComputedStyle(link).visibility === 'hidden')
            .length,
      );
    expect(hidden).toBe(0);
  }
});
