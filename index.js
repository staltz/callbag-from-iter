const fromIter = iter => (start, sink) => {
  if (start !== 0) return;
  const iterator =
    typeof Symbol !== 'undefined' && iter[Symbol.iterator]
      ? iter[Symbol.iterator]()
      : iter;
  let inloop = false;
  let got1 = false;
  let res;
  function loop() {
    inloop = true;
    while (got1) {
      got1 = false;
      res = iterator.next();
      if (res.done) sink(2);
      else sink(1, res.value);
    }
    inloop = false;
  }
  sink(0, t => {
    if (t === 1) {
      got1 = true;
      if (!inloop && !(res && res.done)) loop();
    }
  });
};

module.exports = fromIter;
