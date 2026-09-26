import { z } from 'astro/zod';
export const checkoutUrl = z.url().refine((value) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Checkout richiede HTTPS senza credenziali');
export const ctaUrl = z.string().refine((value) => {
  if (
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    !/\s/.test(value) &&
    !Array.from(value).some((character) => character.charCodeAt(0) < 32)
  )
    return true;
  return checkoutUrl.safeParse(value).success;
}, 'URL CTA non sicuro');
export const priceSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .default('EUR'),
});
