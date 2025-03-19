export function validateUserFunction(
  code: string
): ((formData: Record<string, any>) => void) | null {
  try {
    if (typeof code !== 'string' || code.trim() === '') {
      throw new Error('Invalid function: Input is not a string or is empty.');
    }

    if (!/^(\s*\(?\s*\w+\s*\)?\s*=>|function\s*\()/m.test(code)) {
      throw new Error(
        'Invalid function: Must be an arrow function or function declaration.'
      );
    }

    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'formData',
      `"use strict"; return (${code})(formData);`
    );
    fn({});

    return fn as (formData: Record<string, any>) => void;
  } catch (error) {
    console.error('Function validation error:', error);
    return null;
  }
}
