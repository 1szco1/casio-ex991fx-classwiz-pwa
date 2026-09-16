/* calc-steps — "worked solutions" recorder for the 991EX real-number path.
   Pure; no DOM. Mirrors the exact normalized string `s` (numbers, + - * / ^
   ( ) , fn-calls) that evaluateExpression hands to `new Function`, and mirrors
   JS precedence/associativity + the engine's angle-aware ctx so that the FINAL
   step equals the engine result. Each binary/fn reduction becomes one step. */
'use strict';

const ANG_DEG = 0, ANG_RAD = 1, ANG_GRA = 2;

function fmtN(v){
  if (!isFinite(v)) return String(v);
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e10 || a < 1e-9)) return v.toExponential(9);
  return parseFloat(String(+v.toFixed(10))).toString();
}

function realCtx(A){
  const R = v => A === ANG_DEG ? v * Math.PI / 180 : (A === ANG_GRA ? v * Math.PI / 200 : v);
  const F = v => A === ANG_DEG ? v * 180 / Math.PI : (A === ANG_GRA ? v * 200 / Math.PI : v);
  return {
    sin: x => Math.sin(R(x)),           cos: x => Math.cos(R(x)),         tan: x => Math.tan(R(x)),
    asin: x => F(Math.asin(x)),         acos: x => F(Math.acos(x)),       atan: x => F(Math.atan(x)),
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
    abs: Math.abs, sqrt: Math.sqrt, cbrt: Math.cbrt, sqr: x => x * x,
    ln: Math.log, log: (x, b) => b === undefined ? Math.log10(x) : Math.log(x) / Math.log(b),
    exp: Math.exp, log2: Math.log2, log10: Math.log10,
    root: (a, b) => b === undefined ? Math.sqrt(a) : Math.pow(b, 1 / a)
  };
}

function recordReal(s, A){
  const ctx = realCtx(A);
  const numRe = /^((\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)/;
  const fnRe = /^([A-Za-z]+)/;
  const toks = []; let i = 0;
  while (i < s.length){
    const ch = s[i];
    if (ch === '*' && s[i + 1] === '*'){ toks.push({ t: 'op', v: '^' }); i += 2; continue; }
    if ('+-*/^(),'.indexOf(ch) >= 0){ toks.push({ t: 'op', v: ch }); i++; continue; }
    const m = s.slice(i).match(numRe);
    if (m){ toks.push({ t: 'num', v: parseFloat(m[1]), raw: m[1] }); i += m[1].length; continue; }
    const f = s.slice(i).match(fnRe);
    if (f){ toks.push({ t: 'fn', v: f[1].toLowerCase() }); i += f[1].length; continue; }
    return { steps: [], final: NaN, error: 'token @' + i };
  }
  toks.push({ t: 'end' });
  const steps = [];
  let p = 0;
  const peek = () => toks[p], next = () => toks[p++];
  function rec(op, lhs, rhs, val){
    steps.push({ op, lhs, rhs, val });
  }
  function atom(){
    const t = peek();
    if (t.t === 'num'){ next(); return t.v; }
    if (t.t === 'op' && t.v === '('){
      next(); const v = expr();
      if (peek().t === 'op' && peek().v === ')') next();
      return v;
    }
    if (t.t === 'fn'){
      const fn = next().v;
      const open = peek();
      if (open.t === 'op' && open.v === '('){
        next();
        const a = expr();
        let b = undefined;
        if (peek().t === 'op' && peek().v === ','){
          next(); b = expr();
        }
        if (peek().t === 'op' && peek().v === ')') next();
        const f = ctx[fn];
        const val = typeof f === 'function' ? f(a, b) : NaN;
        const suffix = /^(sin|cos|tan)$/.test(fn)
          ? (A === ANG_DEG ? '°' : A === ANG_GRA ? 'ᵍ' : '')
          : '';
        rec(fn, fmtN(a) + suffix, b === undefined ? '' : fmtN(b), val);
        return val;
      }
      const a = atom();
      const f = ctx[fn];
      const val = typeof f === 'function' ? f(a) : NaN;
      rec(fn, fmtN(a), '', val);
      return val;
    }
    return NaN;
  }
  function powRhs(){
    if (peek().t === 'op' && peek().v === '-'){
      next(); const a = pow(); return -a;
    }
    return pow();
  }
  function pow(){
    let a = atom();
    for (;;){
      const t = peek();
      if (t.t === 'op' && t.v === '^'){
        next(); const b = powRhs();
        const val = Math.pow(a, b);
        rec('^', fmtN(a), fmtN(b), val);
        a = val; continue;
      }
      break;
    }
    return a;
  }
  function unary(){
    const t = peek();
    if (t.t === 'op' && (t.v === '-' || t.v === '+')){
      next(); const v = unary();
      return t.v === '-' ? -v : v;
    }
    return pow();
  }
  function term(){
    let a = unary();
    for (;;){
      const t = peek();
      if (t.t === 'op' && (t.v === '*' || t.v === '/')){
        next(); const b = unary();
        const val = t.v === '*' ? a * b : a / b;
        rec(t.v === '*' ? '×' : '÷', fmtN(a), fmtN(b), val);
        a = val; continue;
      }
      break;
    }
    return a;
  }
  function expr(){
    let a = term();
    for (;;){
      const t = peek();
      if (t.t === 'op' && (t.v === '+' || t.v === '-')){
        next(); const b = term();
        const val = t.v === '+' ? a + b : a - b;
        rec(t.v === '+' ? '+' : '−', fmtN(a), fmtN(b), val);
        a = val; continue;
      }
      break;
    }
    return a;
  }
  const final = expr();
  return { steps, final };
}

const _fmtN = fmtN;

if (typeof module !== 'undefined') module.exports = { recordReal, fmtN, realCtx, ANG_DEG, ANG_RAD, ANG_GRA };
