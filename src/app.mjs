'use strict';
const tokenizeFormula = (formula) => {
  const regex = /([A-Z][0-9]+|\d+|\+|\-|\*|\/|\(|\))/g;
  // Use the regex to match tokens in the string
  const tokens = formula.match(regex);
  // Return the tokens or an empty array if no match
  return tokens || [];
};

const groupTokens = (tokens) => {
  const cell_refs = [];
  const numerice_values = [];

  const cell_regex = /[A-Z][0-9]+/g;
  const number_regex = /d+/;

  for (const tk of tokens) {
    if (number_regex.test(tk)) {
      numerice_values.push(tk);
    } else {
      if (cell_regex.test(tk)) {
        cell_refs.push(tk);
      }
    }
  }
  return {
    cell_refs,
    numerice_values,
  };
};

const initialDependents = (cells) => {
  const _cells = cells;
  // run through whole all cells and update the dependents
  for (const [ref_key, ref_value] of Object.entries(_cells)) {
    const tokenized_formula = tokenizeFormula(ref_value.formula);
    const { cell_refs } = groupTokens(tokenized_formula);
    if (cell_refs.length > 0) {
      for (const ref of cell_refs) {
        _cells[ref].dependents.push(ref_key);
      }
    }
    _cells[ref_key].tokenized_formula = tokenized_formula;
  }
  return _cells;
};

const cells = {
  A1: {
    value: 32,
    formula: '32',
    tokenized_formula: [],
    dependents: [],
  },
  A2: {
    value: 42,
    formula: 'A1+10',
    tokenized_formula: [],
    dependents: [],
  },
  A3 : {
    value: 52,
    formula: 'A2+10',
    tokenized_formula: [],
    dependents: [],
  },
  A4: {
    value: 52,
    formula: '88 + 107',
    tokenized_formula: [],
    dependents: [],
  }


};

const rPrinR = (cells, current_node_address, already_visited)=>{
  const node = cells[current_node_address];
  already_visited.add(current_node_address)
  console.log(current_node_address,"CN",node?.formula);
  if(node.dependents.length > 0){
    node.dependents.forEach(dp=> rPrinR(cells,dp,already_visited))
  }
}

const cells2 =  initialDependents(cells);
console.log("ce2",cells2);

rPrinR(cells2,"A1",new Set())


export { tokenizeFormula, groupTokens };
