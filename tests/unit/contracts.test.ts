import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  projectSchema,
  impactUpdateSchema,
  experienceSchema,
  campaignSchema,
  partnerSchema,
} from '../../src/schemas/ecosystem.ts';
import { visible } from '../../src/lib/publication.ts';
import {
  checkoutUrl,
  ctaUrl,
  priceSchema,
} from '../../src/schemas/commerce.ts';

// TEST fixtures only: imaginary records, never loaded into content collections.
const evidence = {
  id: 'test-record',
  title: 'TEST record',
  url: 'https://example.org/test',
  kind: 'activity-record',
  recordedAt: '2026-01-01',
  limitations: 'TEST, no real activity',
};
const project = {
  id: 'test-project',
  title: 'TEST',
  description: 'Fixture',
  test: true,
  stage: 'project',
  location: { description: 'TEST' },
  problem: 'TEST',
  objective: 'TEST',
  status: 'designed',
  beneficiaries: ['people'],
};
const activity = {
  id: 'test-activity',
  title: 'TEST',
  date: '2026-01-01',
  description: 'TEST',
  evidenceRefs: ['test-record'],
};
const indicator = {
  id: 'test-indicator',
  domain: 'people',
  label: 'TEST',
  unit: 'TEST units',
  baseline: 0,
  observed: 1,
  measuredAt: '2026-01-01',
  method: 'TEST method',
  limitations: 'TEST, not causal',
  evidenceRefs: ['test-record'],
};
const outcome = { description: 'TEST outcome', evidenceRefs: ['test-record'] };
const action = {
  ...project,
  stage: 'action',
  status: 'active',
  activities: [activity],
  evidence: [evidence],
};

test('Publication excludes draft, TEST and future records', () => {
  const now = new Date('2026-01-01');
  const data = {
    draft: false,
    test: false,
    publishedDate: new Date('2025-01-01'),
  };
  assert.equal(visible({ data }, now), true);
  for (const change of [
    { draft: true },
    { test: true },
    { publishedDate: new Date('2027-01-01') },
  ])
    assert.equal(visible({ data: { ...data, ...change } }, now), false);
});
test('Plans cannot claim activities, participants or measured outcomes', () => {
  assert.equal(projectSchema.safeParse(project).success, true);
  for (const change of [
    { activities: [activity] },
    { participants: 0 },
    { outcomes: [outcome] },
    { status: 'active' },
    { status: 'completed' },
  ])
    assert.equal(
      projectSchema.safeParse({ ...project, ...change }).success,
      false,
    );
});
test('Action requires an activity and resolvable evidence', () => {
  assert.equal(projectSchema.safeParse(action).success, true);
  for (const change of [
    { evidence: [] },
    { activities: [] },
    { evidence: [{ ...evidence, id: 'other' }] },
    { evidence: [evidence, evidence] },
  ])
    assert.equal(
      projectSchema.safeParse({ ...action, ...change }).success,
      false,
    );
});
test('Impact requires outcomes, baseline, method, limitations and evidence', () => {
  const impact = {
    ...action,
    stage: 'impact',
    outcomes: [outcome],
    indicators: [indicator],
  };
  assert.equal(projectSchema.safeParse(impact).success, true);
  for (const change of [
    { outcomes: [] },
    { indicators: [] },
    { indicators: [{ ...indicator, baseline: undefined }] },
    { indicators: [{ ...indicator, method: '' }] },
    { indicators: [{ ...indicator, limitations: '' }] },
    { peopleImpact: { intention: 'TEST', indicatorIds: ['missing'] } },
  ])
    assert.equal(
      projectSchema.safeParse({ ...impact, ...change }).success,
      false,
    );
  assert.equal(
    projectSchema.safeParse({ ...action, indicators: [indicator] }).success,
    false,
  );
});
test('Financial records distinguish funds received, pledged and spent', () => {
  const resource = {
    id: 'test-money',
    amount: { amountMinor: 100, currency: 'EUR' },
    kind: 'received',
    occurredAt: '2026-01-01',
    destination: 'TEST',
    evidenceRefs: ['test-record'],
  };
  assert.equal(
    projectSchema.safeParse({ ...action, resourcesRaised: [resource] }).success,
    true,
  );
  assert.equal(
    projectSchema.safeParse({ ...action, resourcesUsed: [resource] }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...action,
      resourcesRaised: [{ ...resource, kind: 'spent' }],
    }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...action,
      resourcesRaised: [
        { ...resource, amount: { amountMinor: -1, currency: 'EUR' } },
      ],
    }).success,
    false,
  );
});
test('Impact updates reject reversed periods and missing references', () => {
  const update = {
    id: 'test-update',
    title: 'TEST',
    description: 'TEST',
    test: true,
    stage: 'impact',
    projectId: 'test-project',
    period: { start: '2026-01-01', end: '2026-01-02' },
    outcomes: [outcome],
    indicators: [indicator],
    evidence: [evidence],
    lessonsLearned: ['TEST'],
  };
  assert.equal(impactUpdateSchema.safeParse(update).success, true);
  assert.equal(
    impactUpdateSchema.safeParse({
      ...update,
      period: { start: '2026-02-01', end: '2026-01-01' },
    }).success,
    false,
  );
  assert.equal(
    impactUpdateSchema.safeParse({ ...update, evidence: [] }).success,
    false,
  );
});
test('Experiences require reciprocity and documented impact', () => {
  const record = {
    id: 'test-experience',
    title: 'TEST',
    description: 'TEST',
    test: true,
    kind: 'retreat',
    location: 'TEST',
    learningObjectives: ['TEST'],
    activities: ['TEST'],
    reciprocity: {
      learnFrom: 'TEST',
      exchange: 'TEST',
      contribute: 'TEST',
      returnDocumentation: 'TEST',
    },
    access: { mode: 'funded', description: 'TEST' },
  };
  assert.equal(experienceSchema.safeParse(record).success, true);
  assert.equal(
    experienceSchema.safeParse({ ...record, reciprocity: undefined }).success,
    false,
  );
  assert.equal(
    experienceSchema.safeParse({
      ...record,
      stage: 'impact',
      evidence: [evidence],
    }).success,
    false,
  );
});
test('Campaigns and partner relationships require documentation', () => {
  const campaign = {
    id: 'test-campaign',
    title: 'TEST',
    description: 'TEST',
    test: true,
    purpose: 'access',
    objective: 'TEST',
    status: 'planned',
    allocationPlan: 'TEST',
  };
  assert.equal(campaignSchema.safeParse(campaign).success, true);
  assert.equal(
    campaignSchema.safeParse({ ...campaign, status: 'open' }).success,
    false,
  );
  assert.equal(
    partnerSchema.safeParse({
      id: 'test-partner',
      title: 'TEST',
      description: 'TEST',
      role: 'TEST',
      website: 'https://example.org',
      relationshipEvidence: ['missing'],
    }).success,
    false,
  );
});
test('Commercial links reject protocol-relative, credential and script URLs', () => {
  for (const url of [
    '//example.org',
    '/\\example.org',
    'javascript:alert(1)',
    'http://example.org',
    'https://user:pass@example.org',
  ])
    assert.equal(ctaUrl.safeParse(url).success, false);
  assert.equal(ctaUrl.safeParse('/flow/il-cercatore/').success, true);
  assert.equal(
    checkoutUrl.safeParse('https://example.org/checkout').success,
    true,
  );
  assert.equal(priceSchema.safeParse({ amount: -1 }).success, false);
});
