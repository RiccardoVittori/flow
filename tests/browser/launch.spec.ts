import { test, expect } from '@playwright/test';
import { base } from '../../site.config.mjs';

test('Sponsor and visitor paths prepare the matching request without claiming delivery', async ({
  page,
}) => {
  await page.goto(base);
  await page
    .getByRole('link', { name: 'Proponi una collaborazione ↗' })
    .click();
  await expect(page.locator('#interest')).toHaveValue(
    'Sponsor e collaborazioni',
  );
  await page
    .getByRole('textbox', { name: 'Come ti chiami?' })
    .fill('Visitatore test');
  await page.getByRole('button', { name: 'Prepara la richiesta ↗' }).click();
  await expect(page.locator('#request-text')).toHaveValue(
    /Sponsor e collaborazioni/,
  );
  await expect(page.locator('#request-text')).toHaveValue(/non prenotazione/);
  await expect(page.getByRole('status')).not.toContainText('Richiesta inviata');
  const send = page.locator('#send-request');
  if (await send.isVisible())
    await expect(send).toHaveAttribute('href', /^(https:\/\/wa.me\/|mailto:)/);
  else await expect(page.getByRole('status')).toContainText('non inviata');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Salva .txt' }).click();
  expect((await download).suggestedFilename()).toBe('richiesta-flow.txt');
});

test('Interest in the longer retreat does not become a booking or payment', async ({
  page,
}) => {
  await page.goto(base);
  await page
    .getByRole('link', { name: 'Esprimi interesse per Immersive ↗' })
    .click();
  await expect(page.locator('#interest')).toHaveValue(
    'FLOW Immersive — 2–3 giorni',
  );
  await expect(page.locator('#percorsi')).toContainText(
    'non è una prenotazione',
  );
  await expect(
    page.locator('input[type=creditcard], [data-checkout]'),
  ).toHaveCount(0);
  await expect(
    page.locator('a[href*="stripe.com"],a[href*="paypal.com"]'),
  ).toHaveCount(0);
});

test('The free resource is a usable document with a real return path', async ({
  page,
}) => {
  await page.goto(base);
  await page.getByRole('link', { name: 'Apri il taccuino gratuito ↗' }).click();
  await expect(page.locator('h1')).toContainText('notato oggi');
  await expect(
    page.getByRole('button', { name: 'Stampa o salva in PDF' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Torna a FLOW' }).click();
  await expect(page.locator('h1')).toContainText('Feel Your');
});

test('The one-page experience and resources remain navigable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + base);
    await page.getByRole('link', { name: 'Trova la tua esperienza ↘' }).click();
    await expect(page).toHaveURL(/#esperienze$/);
    await expect(
      page.getByRole('heading', { name: 'Un altro modo di leggere il bosco.' }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: 'Apri il taccuino gratuito ↗' })
      .click();
    await expect(page.locator('h1')).toContainText('notato oggi');
  } finally {
    await context.close();
  }
});

test('Fresh truffle and lesson enquiries keep their own fields and do not leak hidden values', async ({
  page,
}) => {
  await page.goto(base);
  await page
    .getByRole('link', { name: 'Richiedi disponibilità tartufo ↗' })
    .click();
  await expect(page.locator('#truffle-fields')).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Come ti chiami?' })
    .fill('Test richiesta');
  await page
    .getByRole('textbox', { name: 'Specie o preferenza' })
    .fill('Specie da consigliare');
  await page
    .getByRole('spinbutton', { name: 'Quantità in grammi' })
    .fill('100');
  await page.getByRole('button', { name: 'Prepara la richiesta ↗' }).click();
  await expect(page.locator('#request-text')).toHaveValue(/Grammi: 100/);
  await expect(page.locator('#request-text')).toHaveValue(
    /non prenotazione né ordine/,
  );
  await page
    .getByRole('link', { name: 'Parliamo della tua pratica ↗' })
    .click();
  await expect(page.locator('#lesson-fields')).toBeVisible();
  await expect(page.locator('#truffle-fields')).toBeHidden();
  await page
    .getByRole('combobox', { name: 'Modalità', exact: true })
    .selectOption('Online');
  await page.getByRole('button', { name: 'Prepara la richiesta ↗' }).click();
  await expect(page.locator('#request-text')).toHaveValue(/Modalità: Online/);
  await expect(page.locator('#request-text')).not.toHaveValue(/Grammi: 100/);
  await page
    .getByRole('link', { name: 'Mi interessa un’uscita sociale ↗' })
    .click();
  await expect(page.locator('#meal-fields')).toBeVisible();
  await expect(page.locator('#lesson-fields')).toBeHidden();
});
