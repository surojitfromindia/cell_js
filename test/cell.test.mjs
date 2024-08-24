import test from 'node:test';
import assert from 'node:assert';
import { groupTokens, tokenizeFormula } from '../src/app.mjs';

const expr = 'A1+A2';

test('create tokens', (t) => {
  assert.deepEqual(tokenizeFormula(expr), ['A1', '+', 'A2']);
});
test('return a token grouped from parse tree', () => {
  const g = groupTokens(tokenizeFormula(expr));
  assert.deepEqual(g, {
    cell_refs: ['A1', 'A2'],
    numerice_values: [],
  });
});
