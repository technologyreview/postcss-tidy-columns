const run = require('.');
const { typical, typicalWithBreakpoints } = require('./sharedConfigs');
const { VAR_FUNCTION_REGEX } = require('../tidy-var');

/**
 * Replace `tidy-var()` functions within property values.
 */
describe('The `tidy-var()` function is replaced with the expected option value', () => {
  test(
    'Replaces a single instance of `tidy-var()` in a declaration',
    () => run(
      'div { margin-left: tidy-var(gap); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a multiple instances of `tidy-var()` in a declaration',
    () => run(
      'div { padding: 0 tidy-var(edge) 0 tidy-var(gap); }',
      'div { padding: 0 0.625rem 0 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a single-quoted `tidy-var()` value',
    () => run(
      "div { margin-left: tidy-var('gap'); }",
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Replaces a double-quoted `tidy-var()` value',
    () => run(
      'div { margin-left: tidy-var("gap"); }',
      'div { margin-left: 1.25rem; }',
      typical,
    ),
  );

  test(
    'Ignores unknown value',
    () => run(
      'div { margin-left: tidy-var(flurm); }',
      'div { margin-left: tidy-var(flurm); }',
      typical,
    ),
  );

  test(
    'Replaces the correct value from within a matched breakpoint',
    () => run(
      // eslint-disable-next-line max-len
      'div { margin-left: tidy-var(gap); } @media (min-width: 900px) { div { margin-left: tidy-var(gap); } }',
      'div { margin-left: 1.25rem; } @media (min-width: 900px) { div { margin-left: 0.625rem; } }',
      typicalWithBreakpoints,
    ),
  );
});

/**
 * Matches tidy-var() functions.
 */
describe('Matches tidy-var() functions', () => {
  test.each([
    'tidy-var(gap)',
    'tidy-var(edge)',
    'tidy-var(siteMax)',
  ])(
    'Matches expected tidy-var functions',
    (input) => {
      expect(VAR_FUNCTION_REGEX.test(input)).toBeTruthy();
    },
  );

  test.each([
    'tidy-span(gap)',
    'tidy-span(4)',
    'tidy-offset(1)',
    'tidy-var(hello)',
    'calc(tidy-var(hello))',
  ])(
    'Ignores non tidy-var() functions',
    (input) => {
      expect(VAR_FUNCTION_REGEX.test(input)).toBeFalsy();
    },
  );
});
