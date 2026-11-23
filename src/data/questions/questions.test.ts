import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALL_QUESTIONS,
  CATEGORY_ORDER,
  QUESTIONS_BY_CATEGORY,
  getQuestionCountSummary,
} from './index';

test('each of the 5 categories has at least 100 unique questions', () => {
  const summary = getQuestionCountSummary();
  assert.ok(summary.total >= 500, `Expected >= 500 total questions, got ${summary.total}`);

  for (const cat of CATEGORY_ORDER) {
    const list = QUESTIONS_BY_CATEGORY[cat];
    assert.ok(
      list.length >= 100,
      `Category "${cat}" should have >= 100 questions, got ${list.length}`,
    );
  }
});

test('all questions have unique prompts, valid options, progressive difficulties, and cover ages 6-15', () => {
  const seenPrompts = new Set<string>();

  for (const cat of CATEGORY_ORDER) {
    const list = QUESTIONS_BY_CATEGORY[cat];
    const diffCounts = { 1: 0, 2: 0, 3: 0 };

    for (const q of list) {
      const normalized = q.prompt.trim().toLowerCase();
      assert.equal(
        seenPrompts.has(normalized),
        false,
        `Duplicate prompt found in ${cat}: "${q.prompt}"`,
      );
      seenPrompts.add(normalized);

      assert.equal(q.options.length, 4, `Question ${q.id} must have 4 options`);
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex <= 3,
        `Question ${q.id} has invalid correctIndex`,
      );
      assert.ok(q.explanation.trim().length > 15, `Question ${q.id} missing explanation`);
      assert.ok(q.empathyTip.trim().length > 10, `Question ${q.id} missing empathyTip`);
      assert.ok(q.minAge >= 6 && q.maxAge <= 15 && q.minAge <= q.maxAge, `Question ${q.id} age range invalid`);

      diffCounts[q.difficulty] += 1;
    }

    assert.ok(diffCounts[1] >= 30, `${cat} tier 1 should have >= 30 questions, got ${diffCounts[1]}`);
    assert.ok(diffCounts[2] >= 30, `${cat} tier 2 should have >= 30 questions, got ${diffCounts[2]}`);
    assert.ok(diffCounts[3] >= 30, `${cat} tier 3 should have >= 30 questions, got ${diffCounts[3]}`);
  }
});

test('strict child-safety guard: excludes sexual harassment topics for minors', () => {
  const forbiddenPatterns = [
    /sexuel/iu,
    /porn/iu,
    /nude/iu,
    /sext/iu,
    /attouchement/iu,
    /(?:^|[^\p{L}])viols?(?=$|[^\p{L}])/iu,
  ];

  for (const q of ALL_QUESTIONS) {
    const corpus = `${q.prompt} ${q.options.join(' ')} ${q.explanation} ${q.empathyTip}`;
    for (const pattern of forbiddenPatterns) {
      assert.equal(
        pattern.test(corpus),
        false,
        `Forbidden term matched in question ${q.id}: ${pattern}`,
      );
    }
  }
});
