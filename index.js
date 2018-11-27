const fromIter = iter => (start, sink) => {
  if (start !== 0) return;
  const isIterable = typeof Symbol !== 'undefined' && iter[Symbol.iterator];
  const iterator = isIterable ? iter[Symbol.iterator]() : iter;
  let disposed = false;
  let result = {};
  sink(0, t => {
    if (disposed) return;
    if (t === 1) result = iterator.next();
    if (t === 2) disposed = true;
  });
  while (!result.done && !disposed) sink(1, result.value);
  if (!disposed) sink(2);
};

module.exports = fromIter;
