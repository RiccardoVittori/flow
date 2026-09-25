import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paths = [
  '/flow/',
  '/flow/taccuino/il-cercatore-da-dove-comincia-il-cammino/',
  '/flow/esplora/',
  '/flow/cerca/',
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
    await page.goto('/flow/');
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
  await page.goto('/flow/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Vai al contenuto' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('summary').focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('navigation', { name: 'Navigazione mobile' })
    .getByRole('link', { name: 'Esplora', exact: true })
    .click();
  await expect(page).toHaveURL(/\/flow\/esplora\/$/);
});
test('Ricerca Pagefind e caso senza risultati', async ({ page }) => {
  await page.goto('/flow/cerca/');
  const search = page.getByRole('textbox', { name: 'Cerca nel mondo FLOW' });
  await search.fill('tartufi');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  const links = await page
    .locator('.pagefind-ui__result-link')
    .evaluateAll((elements) => elements.map((a) => a.getAttribute('href')));
  expect(links.every((link) => link?.includes('/flow/'))).toBeTruthy();
  await search.fill('zzznonesistezzz');
  await expect(
    page.getByText('Nessun risultato per zzznonesistezzz'),
  ).toBeVisible();
});
test('Contenuti accessibili senza JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(
    'http://127.0.0.1:4321/flow/taccuino/il-cercatore-da-dove-comincia-il-cammino/',
  );
  await expect(
    page.getByRole('heading', { name: 'Una domanda prima di una risposta' }),
  ).toBeVisible();
  await context.close();
});
test('404, riduzione movimento e metadati', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/flow/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'sentiero',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
  await page.goto('/flow/');
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://riccardovittori.github.io/flow/',
  );
});
