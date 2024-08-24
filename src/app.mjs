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
        const t_ref = _cells[ref];
        if (t_ref) {
          _cells[ref].dependents.push(ref_key);
        }
      }
    }
    _cells[ref_key].tokenized_formula = tokenized_formula;
  }
  return _cells;
};

const cells = {
  A1: {
    value: 32,
    formula: '500',
    tokenized_formula: [],
    dependents: [],
  },
  A2: {
    value: 42,
    formula: 'A1/10', // replace to 500 + 10
    tokenized_formula: [],
    dependents: [],
  },
  A3: {
    value: 52,
    formula: 'A2+A1', // replace to 500+10+500
    tokenized_formula: [],
    dependents: [],
  },
  A4: {
    value: 52,
    formula: 'A3 + A7',
    tokenized_formula: [],
    dependents: [],
  },

};

// try to print any rec- stage.
const updateCells = (cells, current_node_address, already_visited, current_path) => {
  const node = cells[current_node_address];

  // Check if we are revisiting a node in the current path (circular reference)
  if (current_path.has(current_node_address)) {
    throw new Error("Circular ref is found for node " + current_node_address)
  }

  // If we have already visited this node in another path, return
  if (already_visited.has(current_node_address)) {
    return;
  }

  already_visited.add(current_node_address);
  current_path.add(current_node_address);

  console.log(`node ${current_node_address} formula ${node.formula}  `)

  // Recursively visit dependents
  node.dependents.forEach(dp => updateCells(cells, dp, already_visited, current_path));

  // Remove the node from the current path after recursion
  current_path.delete(current_node_address);
}
const cells2 = initialDependents(cells);
console.log("ce2", cells2);

updateCells(cells2, "A1", new Set(), new Set())


const formulaEval = (cells, cell_ref) => {
  const node = cells[cell_ref];
  const tokens = node.tokenized_formula;
  const regex = /[A-Z][0-9]+/g;
  const updated_tokens = [];
  // ref replace :  every cell ref with value (if not found then zero)
  for (const tk of tokens) {
    if (regex.test(tk)) {
      const v = cells[tk] ? cells[tk].value : 0
      updated_tokens.push(v)
    }
    else {
      updated_tokens.push(tk)
    }
  }
  const f_string = updated_tokens.join('');
  return eval(f_string)
}


const r = formulaEval(cells2, 'A2');

console.log("rs", r)

export { tokenizeFormula, groupTokens };
