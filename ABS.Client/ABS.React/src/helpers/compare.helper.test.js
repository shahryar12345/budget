import { compareFunction } from './compare.helper';

// numeric sorts
const unsortedNumericResults = [12, 11, 6, 19, 1, 18, 4, 2, 10, 0, 3, 15, 7, 8, 14, 5, 9, 13, 16, 20, 17];
const sortedAscendingNumericResults = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const sortedDescendingNumericResults = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

// alphabetical sorts
const unsortedAlphaResults = ['mu', 'lambda', 'zeta', 'upsilon', 'rho', 'tau', 'delta', 'beta', 'kappa', 'alpha', 'gamma', 'omicron', 'eta', 'theta', 'xi', 'epsilon', 'iota', 'nu', 'pi', 'phi', 'sigma'];
const sortedAscendingAlphaResults = ['alpha', 'beta', 'delta', 'epsilon', 'eta', 'gamma', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'omicron', 'phi', 'pi', 'rho', 'sigma', 'tau', 'theta', 'upsilon', 'xi', 'zeta'];
const sortedDescendingAlphaResults = ['zeta', 'xi', 'upsilon', 'theta', 'tau', 'sigma', 'rho', 'pi', 'phi', 'omicron', 'nu', 'mu', 'lambda', 'kappa', 'iota', 'gamma', 'eta', 'epsilon', 'delta', 'beta', 'alpha'];

// mixed results: This really shouldn't happen, but if we were to compare strings with numerals, we
// want to sort the numbers naturally. String compare with numbers produces results that do not match expectations.
const unsortedMixedResults = ['football', 11, 'zebra', 19, 'Anthony', 18, 4, 'ball', 'smile', 0, 3, 15, 7, 'smile', 14, 'dossier', 9, 13, 16, 20, 'cranky'];
const sortedAscendingMixedResults = [0, 3, 4, 7, 9, 11, 13, 14, 15, 16, 18, 19, 20, 'Anthony', 'ball', 'cranky', 'dossier', 'football', 'smile', 'smile', 'zebra'];
const sortedDescendingMixedResults = ['zebra', 'smile', 'smile', 'football', 'dossier', 'cranky', 'ball', 'Anthony', 20, 19, 18, 16, 15, 14, 13, 11, 9, 7, 4, 3, 0];


test('Test ascending numeric sort', () => {
  const sortedResults = unsortedNumericResults.sort((a, b) => compareFunction('ascending', a, b));
  expect(sortedResults).toEqual(sortedAscendingNumericResults);
});

test('Test descending numeric sort', () => {
  const sortedResults = unsortedNumericResults.sort((a, b) => compareFunction('descending', a, b));
  expect(sortedResults).toEqual(sortedDescendingNumericResults);
});

test('Test ascending alphabetical sort', () => {
  const sortedResults = unsortedAlphaResults.sort((a, b) => compareFunction('ascending', a, b));
  expect(sortedResults).toEqual(sortedAscendingAlphaResults);
});

test('Test descending alphabetical sort', () => {
  const sortedResults = unsortedAlphaResults.sort((a, b) => compareFunction('descending', a, b));
  expect(sortedResults).toEqual(sortedDescendingAlphaResults);
});

test('Test ascending alphanumeric (mixed) sort', () => {
  const sortedResults = unsortedMixedResults.sort((a, b) => compareFunction('ascending', a, b));
  expect(sortedResults).toEqual(sortedAscendingMixedResults);
});

test('Test descending alphanumeric (mixed) sort', () => {
  const sortedResults = unsortedMixedResults.sort((a, b) => compareFunction('descending', a, b));
  expect(sortedResults).toEqual(sortedDescendingMixedResults);
});
