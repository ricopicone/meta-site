window.MathJax = {
  loader: {load: ['[tex]/ams', '[tex]/boldsymbol', '[tex]/mathtools']},
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    macros: {
      ensuremath: ["#1",1],
      textup: ["{\\mathrm{#1}}",1],
      bm: ["{\\boldsymbol{#1}}",1], // MathJax doesn't support \bm, so we replace it with \boldsymbol
      mat: ["\\bm{#1}",1],
      bnot: ["\\overline{#1}",1],
      band: ["#1\\bigcdot#2",2],
      bor: ["#1+#2",2],
      bnand: ["#1\\mathbin{\\mathrm{nand}}#2",2],
      bnor: ["#1\\mathbin{\\mathrm{nor}}#2",2],
      bxor: ["#1\\mathbin{\\mathrm{xor}}#2",2],
      bxnor: ["#1\\mathbin{\\mathrm{xnor}}#2",2],
      E: ["\\operatorname{E} \\left[#1\\right]",1],
      Var: ["\\operatorname{Var} \\left[#1\\right]",1],
      Skew: ["\\operatorname{Skew} \\left[#1\\right]",1],
      Kurt: ["\\operatorname{Kurt} \\left[#1\\right]",1],
      Cov: ["\\operatorname{Cov} \\left[#1\\right]",1],
      Cor: ["\\operatorname{Cor} \\left[#1\\right]",1],
      diff: ["\\mathop{}\\!d#1",1],
      Diff: ["\\mathop{}\\!d^{#1}",1],
      argmax: ["\\operatorname{argmax}_{#1}",1],
      argmin: ["\\operatorname{argmin}_{#1}",1],
      abs: ["\\lvert #1 \\rvert",1],
      norm: ["\\lVert #1 \\rVert",1],
      parallelsum: ["\\DeclareMathOperator{\\parallelsum}{\\mathbin{\|}}"],
      Div: ["\\DeclareMathOperator{\\Div}{div}"],
      grad: ["\\DeclareMathOperator{\\grad}{grad}"],
      curl: ["\\DeclareMathOperator{\\curl}{curl}"],
      adj: ["\\DeclareMathOperator{\\adj}{adj}"],
      sgn: ["\\DeclareMathOperator{\\sgn}{sgn}"],
      arctanh: ["\\DeclareMathOperator{\\arctanh}{arctanh}"],
      arccosh: ["\\DeclareMathOperator{\\arccosh}{arccosh}"],
      arcsinh: ["\\DeclareMathOperator{\\arcsinh}{arcsinh}"],
      arctantwo: ["\\DeclareMathOperator{\\arctantwo}{arctan_2}"],
      atantwo: ["\\DeclareMathOperator{\\atantwo}{atan_2}"],
      ceil: ["\\DeclarePairedDelimiter{\\ceil}{\\lceil}{\\rceil}"],
      floor: ["\\DeclarePairedDelimiter{\\floor}{\\lfloor}{\\rfloor}"],
    },
    packages: {'[+]': ['amsmath', 'amsfonts', 'amssymb', 'boldsymbol']}
  },
  svg: {
    fontCache: 'global'
  }
};

(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
  script.async = true;
  document.head.appendChild(script);
})();