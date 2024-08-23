
const test = require("node:test");
const cell_refs = {
  A1: {
    value: 32,
    formula: '32',
    dependents: []
  },
  A2: {
    value: 42,
    formula: 'A1+10',
    dependents: []
  }
}


// run through whole all cells and update the dependents

const tokenizeFormula = (formula) => {
  const regex = /([A-Z][0-9]+|\d+|\+|\-|\*|\/|\(|\))/g;
  // Use the regex to match tokens in the string
  const tokens = expression.match(regex);
  // Return the tokens or an empty array if no match
  return tokens || [];
}



test('create tokens', (t) => {
  const expr = 'A1+A2';
  assert.equal(1, 1)
})
