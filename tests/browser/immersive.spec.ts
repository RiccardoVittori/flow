import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { base } from '../../site.config.mjs';

test('Motion is deferred, reversible and can be switched off', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(base);
  const root = page.locator('.journey');
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.includes('scene-motion')),
    ),
  ).toBe(false);
  await page.locator('#osserva').scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute('data-motion-ready', 'true');
  const transformed = await page
    .locator('.forest-painting')
    .evaluate((el) => getComputedStyle(el).transform);
  expect(transformed).not.toBe('none');
  const control = page.getByRole('button', { name: 'Disattiva movimento' });
  await control.click();
  await expect(root).toHaveAttribute('data-motion', 'off');
  expect(
    await page
      .locator('.forest-painting')
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe('none');
  await page.getByRole('button', { name: 'Attiva movimento' }).click();
  await expect(root).toHaveAttribute('data-motion', 'on');
  await page
    .getByRole('navigation', { name: 'Tappe del viaggio' })
    .getByRole('link', { name: 'Il Cercatore', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp('#sottosuolo$'));
  await expect(
    page.getByRole('link', { name: 'Esplora il mondo del tartufo' }),
  ).toBeVisible();
});

test('Reduced motion keeps the complete journey without downloading GSAP', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await expect(
    page.getByRole('button', { name: 'Movimento ridotto' }),
  ).toBeDisabled();
  for (const id of [
    'sottosuolo',
    'scoperte',
    'movimento',
    'restituire',
    'riccardo',
    'orizzonte',
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} h2`).first()).toBeVisible();
  }
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.includes('scene-motion')),
    ),
  ).toBe(false);
  expect(
    await page
      .locator('.forest-stage')
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe('absolute');
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test.describe('Static journey', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  test('No-JS journey keeps scenes, anchors and published reading links', async ({
    page,
  }) => {
    await page.goto('http://127.0.0.1:4321' + base);
    await page.getByRole('link', { name: 'Segui il sentiero' }).click();
    await expect(page).toHaveURL(/#osserva$/);
    await expect(page.locator('[data-scene]')).toHaveCount(10);
    await expect(page.locator('.discovery-note')).toHaveCount(3);
    await expect(page.locator('.motion-toggle')).toBeHidden();
    const about = page.getByRole('link', { name: 'Conosci Riccardo' });
    await about.scrollIntoViewIfNeeded();
    await about.click();
    await expect(page).toHaveURL(new RegExp(base + 'chi-sono/$'));
    await expect(page.locator('h1')).toHaveText('Riccardo Vittori');
  });
});

test('Touch and live preference changes leave controls reachable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + base);
    await page.getByRole('link', { name: 'Segui il sentiero' }).tap();
    await expect(page.locator('.journey')).toHaveAttribute(
      'data-motion-ready',
      'true',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.journey')).toHaveAttribute(
      'data-motion',
      'off',
    );
    await page.locator('#orizzonti').scrollIntoViewIfNeeded();
    await page.locator('.future-directions summary').tap();
    await expect(page.locator('.future-directions')).toHaveAttribute(
      'open',
      '',
    );
    await expect(page.locator('.future-directions a')).toHaveCount(0);
  } finally {
    await context.close();
  }
});
