const { paramHandler } = require('../../../utils/paramhandler');
const PayStructure = require('../../../models/paystructure');
const { request } = require('../../../utils/context');
const formula = require('excel-formula');
const mongoose = require('mongoose'); // ES5 or below

function calculateValMap(name, valMap, depth = 0) {
  // Check if the value is available then return the value
  if (valMap[name] && valMap[name].value !== '') {
    return valMap[name].value;
  } else if (depth >= Object.keys(valMap).length) {
    return '';
  }
  // Else let's see if all the dependents are computed
  const valObj = valMap[name];
  let hasVal = true;
  if (valObj.formula !== null) {
    // Perform computation
    let jsEq = formula.toJavaScript(valObj.formula);
    valObj.dependents.forEach((dep) => {
      let repVal = '';
      if (valMap[dep] && valMap[dep].value !== '') {
        repVal = valMap[dep].value;
      } else {
        repVal = calculateValMap(dep, valMap, ++depth);
      }
      if (repVal !== '') {
        jsEq = jsEq.replaceAll(dep, repVal);
      } else {
        hasVal = false;
      }
    });
    if (hasVal) {
      try {
        const res = eval(jsEq);
        valMap[name].value = res.toString();
        return res;
      } catch (err) {
        return '';
      }
    }
  }
  return valObj.value || '';
}

const calculatePayStructure = async (_, args, { me: mez, tenantid: tenantidz }) =>
  new Promise(async (resolve, reject) => {
    let me = mez;
    let tenantid = tenantidz;
    const param =
      me?.user?.username === 'gonngod'
        ? paramHandler({ ...args.query })
        : paramHandler({ ...args.query, tenantid });
    try {
      const ps = await PayStructure.findOne({
        $and: [
          { _id: mongoose.Types.ObjectId(args.input.salaryStructure) },
          { tenantid: mongoose.Types.ObjectId(tenantid) }
        ]
      })
        .populate('payHeads')
        .populate({
          path: 'payHeads',
          populate: [{ path: 'computedFormula' }],
        });
      const valMap = {};
      if(!ps) 
        return reject(new Error('PayStructure Not Found!'))

      ps.payHeads.forEach((ph) => {
        let fr = ph.computedFormula?.formula;
        if (fr) {
          let tokens = formula.getTokens(fr);
          let ops = tokens.filter(
            (t) => t.type === 'operand' && t.subtype === 'range'
          );
          const ob = {
            value: '',
            name: ph.name,
            formula: fr,
            dependents: ops.map((op) => op.value),
          };
          valMap[ph.name] = ob;
        } else {
          // check if the value is provided in the input args
          let inpVal = args.input.payHeads.filter((h) => h.name === ph.name);
          if (inpVal.length > 0) {
            valMap[ph.name] = {
              value: inpVal[0].value,
              name: ph.name,
              formula: null,
              dependents: [],
            };
          }
        }
      });

      Object.keys(valMap).forEach((key) => {
        const k = calculateValMap(key, valMap, 0);
      });

      resolve({
        _id: ps._id,
        username: args.input?.username,
        eCode: args.input?.eCode,
        salaryStructure: ps.salaryStructure,
        calculatedPayHeads: ps.payHeads.map((p) => {
          return {
            _id: p._id,
            name: p.name,
            calculatedValue: valMap[p.name]?.value || '',
            calculationType: p.calculationType,
            payhead_type: p.payhead_type,
          };
        }),
      });
    } catch (e) {
      reject(e);
    }
  });

module.exports = calculatePayStructure;
