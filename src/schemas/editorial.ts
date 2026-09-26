import { z } from 'astro/zod';

export const idSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
export const stageSchema = z.enum(['vision', 'project', 'action', 'impact']);
export const evidenceSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1),
    url: z
      .url()
      .refine(
        (url) => URL.canParse(url) && new URL(url).protocol === 'https:',
        'La fonte deve usare HTTPS',
      ),
    kind: z.enum([
      'source',
      'activity-record',
      'financial-record',
      'measurement',
      'assessment',
    ]),
    recordedAt: z.iso.date(),
    limitations: z.string().min(1),
  })
  .strict();

export const publicationFields = {
  draft: z.boolean().default(true),
  test: z.boolean().default(false),
  publishedDate: z.coerce.date().optional(),
  stage: stageSchema.default('vision'),
  evidence: z.array(evidenceSchema).default([]),
};

export type Publication = z.infer<z.ZodObject<typeof publicationFields>>;

export function validateStage(
  record: Pick<Publication, 'stage' | 'evidence'>,
  ctx: z.RefinementCtx,
) {
  const ids = record.evidence.map((item) => item.id);
  if (new Set(ids).size !== ids.length)
    ctx.addIssue({
      code: 'custom',
      path: ['evidence'],
      message: 'ID evidenza duplicato',
    });
  if (
    (record.stage === 'action' || record.stage === 'impact') &&
    !record.evidence.length
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['evidence'],
      message: 'Azioni e impatti richiedono evidenze documentate',
    });
  }
}

export function validateEvidenceReferences(
  refs: string[],
  evidence: z.infer<typeof evidenceSchema>[],
  ctx: z.RefinementCtx,
  field: (string | number)[],
) {
  for (const ref of refs) {
    if (!evidence.some((item) => item.id === ref))
      ctx.addIssue({
        code: 'custom',
        path: field,
        message: `Evidenza non definita: ${ref}`,
      });
  }
}
