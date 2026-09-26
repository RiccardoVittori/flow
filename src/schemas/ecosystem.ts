import { z } from 'astro/zod';
import {
  idSchema,
  publicationFields,
  validateStage,
  validateEvidenceReferences,
} from './editorial.ts';

// Future content contracts, not empty public collections or commercial offers.
const entityFields = {
  ...publicationFields,
  id: idSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  documentation: z.array(z.url()).default([]),
};
const evidenceRefs = z.array(idSchema).min(1);
const impactDomain = z.enum(['people', 'flora', 'fauna']);
const money = z
  .object({
    amountMinor: z.number().int().nonnegative(),
    currency: z.string().regex(/^[A-Z]{3}$/),
  })
  .strict();
const resource = z
  .object({
    id: idSchema,
    amount: money,
    kind: z.enum(['received', 'pledged', 'spent']),
    occurredAt: z.iso.date(),
    destination: z.string().min(1),
    evidenceRefs,
  })
  .strict();
const indicator = z
  .object({
    id: idSchema,
    domain: impactDomain,
    label: z.string().min(1),
    unit: z.string().min(1),
    baseline: z.number(),
    observed: z.number(),
    measuredAt: z.iso.date(),
    method: z.string().min(1),
    limitations: z.string().min(1),
    evidenceRefs,
  })
  .strict();
const activity = z
  .object({
    id: idSchema,
    title: z.string().min(1),
    date: z.iso.date(),
    description: z.string().min(1),
    evidenceRefs,
  })
  .strict();
const result = z
  .object({ description: z.string().min(1), evidenceRefs })
  .strict();
const impactIntention = z
  .object({
    intention: z.string().min(1),
    indicatorIds: z.array(idSchema).default([]),
  })
  .strict();

export const projectSchema = z
  .object({
    ...entityFields,
    location: z
      .object({ placeId: idSchema.optional(), description: z.string().min(1) })
      .strict(),
    problem: z.string().min(1),
    objective: z.string().min(1),
    status: z.enum(['designed', 'active', 'paused', 'completed']),
    partners: z.array(idSchema).default([]),
    beneficiaries: z.array(impactDomain).min(1),
    peopleImpact: impactIntention.optional(),
    floraImpact: impactIntention.optional(),
    faunaImpact: impactIntention.optional(),
    resourcesRaised: z.array(resource).default([]),
    resourcesUsed: z.array(resource).default([]),
    activities: z.array(activity).default([]),
    participants: z.number().int().nonnegative().optional(),
    outputs: z.array(result).default([]),
    outcomes: z.array(result).default([]),
    indicators: z.array(indicator).default([]),
    updates: z.array(idSchema).default([]),
    images: z
      .array(
        z
          .object({
            assetId: idSchema,
            alt: z.string().min(1),
            source: z.url(),
            license: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
    lessonsLearned: z.array(z.string().min(1)).default([]),
  })
  .strict()
  .superRefine((record, ctx) => {
    validateStage(record, ctx);
    const reported =
      record.activities.length +
      record.resourcesRaised.length +
      record.resourcesUsed.length +
      record.outputs.length +
      record.outcomes.length +
      record.indicators.length;
    if (
      (record.stage === 'vision' || record.stage === 'project') &&
      (reported > 0 || record.participants !== undefined)
    )
      ctx.addIssue({
        code: 'custom',
        path: ['stage'],
        message:
          'Una visione o un progetto non può contenere attività, fondi o risultati già realizzati',
      });
    if (
      (record.status === 'active' || record.status === 'completed') &&
      record.stage !== 'action' &&
      record.stage !== 'impact'
    )
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Un progetto attivo richiede lo stadio azione o impatto',
      });
    if (
      (record.stage === 'action' || record.stage === 'impact') &&
      !record.activities.length
    )
      ctx.addIssue({
        code: 'custom',
        path: ['activities'],
        message: 'Documentare almeno una attività realmente avvenuta',
      });
    if (
      record.stage === 'impact' &&
      (!record.outcomes.length || !record.indicators.length)
    )
      ctx.addIssue({
        code: 'custom',
        path: ['outcomes'],
        message:
          'Impatto richiede risultati e indicatori misurati, non soltanto output',
      });
    if (
      record.stage !== 'impact' &&
      (record.outcomes.length || record.indicators.length)
    )
      ctx.addIssue({
        code: 'custom',
        path: ['stage'],
        message: 'Le misure di impatto richiedono lo stadio impatto',
      });
    const indicatorIds = record.indicators.map((item) => item.id);
    if (new Set(indicatorIds).size !== indicatorIds.length)
      ctx.addIssue({
        code: 'custom',
        path: ['indicators'],
        message: 'ID indicatore duplicato',
      });
    for (const domain of [
      'peopleImpact',
      'floraImpact',
      'faunaImpact',
    ] as const) {
      for (const id of record[domain]?.indicatorIds || [])
        if (!indicatorIds.includes(id))
          ctx.addIssue({
            code: 'custom',
            path: [domain, 'indicatorIds'],
            message: `Indicatore non definito: ${id}`,
          });
    }
    for (const field of [
      'activities',
      'resourcesRaised',
      'resourcesUsed',
      'outputs',
      'outcomes',
      'indicators',
    ] as const) {
      record[field].forEach((item, index) =>
        validateEvidenceReferences(item.evidenceRefs, record.evidence, ctx, [
          field,
          index,
          'evidenceRefs',
        ]),
      );
    }
    record.resourcesUsed.forEach((item, index) => {
      if (item.kind !== 'spent')
        ctx.addIssue({
          code: 'custom',
          path: ['resourcesUsed', index, 'kind'],
          message: 'Risorse utilizzate devono essere spese documentate',
        });
    });
    record.resourcesRaised.forEach((item, index) => {
      if (item.kind === 'spent')
        ctx.addIssue({
          code: 'custom',
          path: ['resourcesRaised', index, 'kind'],
          message: 'Separare raccolta e spesa',
        });
    });
  });

export const impactUpdateSchema = z
  .object({
    ...entityFields,
    stage: z.literal('impact'),
    projectId: idSchema,
    period: z.object({ start: z.iso.date(), end: z.iso.date() }).strict(),
    outcomes: z.array(result).min(1),
    indicators: z.array(indicator).min(1),
    lessonsLearned: z.array(z.string().min(1)).min(1),
  })
  .strict()
  .superRefine((record, ctx) => {
    validateStage(record, ctx);
    if (record.period.end < record.period.start)
      ctx.addIssue({
        code: 'custom',
        path: ['period'],
        message: 'Periodo non valido',
      });
    for (const field of ['outcomes', 'indicators'] as const)
      record[field].forEach((item, index) =>
        validateEvidenceReferences(item.evidenceRefs, record.evidence, ctx, [
          field,
          index,
          'evidenceRefs',
        ]),
      );
  });

export const experienceSchema = z
  .object({
    ...entityFields,
    kind: z.enum([
      'field-experience',
      'bootcamp',
      'retreat',
      'course',
      'exchange',
    ]),
    location: z.string().min(1),
    pathIds: z.array(idSchema).default([]),
    projectIds: z.array(idSchema).default([]),
    learningObjectives: z.array(z.string().min(1)).min(1),
    activities: z.array(z.string().min(1)).min(1),
    reciprocity: z
      .object({
        learnFrom: z.string().min(1),
        exchange: z.string().min(1),
        contribute: z.string().min(1),
        returnDocumentation: z.string().min(1),
      })
      .strict(),
    access: z
      .object({
        mode: z.enum(['open', 'funded', 'paid', 'mixed']),
        description: z.string().min(1),
      })
      .strict(),
    impactUpdateIds: z.array(idSchema).default([]),
  })
  .strict()
  .superRefine((record, ctx) => {
    validateStage(record, ctx);
    if (record.stage === 'impact' && !record.impactUpdateIds.length)
      ctx.addIssue({
        code: 'custom',
        path: ['impactUpdateIds'],
        message:
          'Collegare risultati documentati, non dedurre impatto dalla partecipazione',
      });
  });

export const campaignSchema = z
  .object({
    ...entityFields,
    purpose: z.enum(['access', 'territory', 'culture', 'research']),
    objective: z.string().min(1),
    status: z.enum(['planned', 'open', 'closed']),
    projectIds: z.array(idSchema).default([]),
    experienceIds: z.array(idSchema).default([]),
    allocationPlan: z.string().min(1),
    goal: money.optional(),
    resourcesRaised: z.array(resource).default([]),
  })
  .strict()
  .superRefine((record, ctx) => {
    validateStage(record, ctx);
    if (
      (record.status !== 'planned' || record.resourcesRaised.length) &&
      (record.stage === 'vision' || record.stage === 'project')
    )
      ctx.addIssue({
        code: 'custom',
        path: ['stage'],
        message:
          'Una campagna aperta o una raccolta richiedono azioni documentate',
      });
    record.resourcesRaised.forEach((item, index) =>
      validateEvidenceReferences(item.evidenceRefs, record.evidence, ctx, [
        'resourcesRaised',
        index,
        'evidenceRefs',
      ]),
    );
  });

export const partnerSchema = z
  .object({
    ...entityFields,
    role: z.string().min(1),
    website: z.url(),
    relationshipEvidence: evidenceRefs,
  })
  .strict()
  .superRefine((record, ctx) => {
    validateStage(record, ctx);
    validateEvidenceReferences(
      record.relationshipEvidence,
      record.evidence,
      ctx,
      ['relationshipEvidence'],
    );
  });

export type FlowProject = z.infer<typeof projectSchema>;
export type FlowExperience = z.infer<typeof experienceSchema>;
export type FlowCampaign = z.infer<typeof campaignSchema>;
