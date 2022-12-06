const union = (set1, set2) => new Set([...set1, ...set2]);

const intersection = (set1, set2) => new Set([...set1].filter((item) => set2.has(item)));

const isSuperSet = (set1, set2) => [...set2].every((item) => set1.has(item));

const difference = (set1, set2) => new Set([...set1].filter((item) => !set2.has(item)));

const symmetricDifference = (set1, set2) => new Set([...difference(set1, set2), ...difference(set2, set1)]);

module.exports = {
  union,
  intersection,
  isSuperSet,
  difference,
  symmetricDifference,
}