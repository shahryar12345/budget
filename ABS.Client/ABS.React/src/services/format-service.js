export const formatData = (rows, headers, locale, formatOptions) => {
  rows.forEach(row => {
    if (row.childRows?.length) {
      formatData(row.childRows, headers, locale, formatOptions);
    }
    headers.forEach(header => {
      row[header.key] = formatValue(row[header.key], header.formatType, locale, formatOptions);
    });
  });
}

export const formatValue = (value, type, locale, formatOptions) => {
  if (type) {
    // do not attempt to format null or undefined values
    // continue to format 0, true, or other falsy values
    if (value !== null && value !== undefined) {
      switch (type) {
        case 'number':
          value = formatNumber(value, locale, formatOptions);
          break;
        default:
          throw `Unknown format type: ${type}`
      }
    }
  }
  return value;
}

export const parseNumber = (value, locale) => {
  if (!value) return 0;
  let rawValue = `${value}`;

  // determine if value is surrounded by parentheses and remove them
  const isNegative = value[0] === '(' && value[value.length - 1] === ')';
  rawValue = rawValue.replace(/[()]/g, '');

  // remove whitespace
  rawValue = rawValue.replace(' ', '');

  // determine and remove separator character
  const separator = Intl.NumberFormat(locale).format('9999')[1];
  rawValue = rawValue.replace(separator, '');

  // remove currency symbols
  //const currencySymbol = Intl.NumberFormat(locale).format(1)[0];
  //rawValue = rawValue.replace(currencySymbol, '');
  rawValue = rawValue.replace(/[£$ €]/g, '');

  return isNegative ? -1 * parseFloat(rawValue) : parseFloat(rawValue);
}

export const formatNumber = (value, locale, formatOptions) => {

  // attempt to remove all formatting before determining
  // if raw value is a number
  const rawValue = parseNumber(value, locale);

  // throw an exception if input isn't a number
  if (isNaN(rawValue)) {
    throw `Input value is not a number: ${rawValue}`;
  }
  let formattedNumber;
  if (formatOptions?.style === 'percent') formattedNumber = Intl.NumberFormat(locale, formatOptions).format(rawValue / 100);
  else formattedNumber = Intl.NumberFormat(locale, formatOptions).format(rawValue);
  // signing doesn't work like we want it to
  // currently, if we have the currency symbol turned on, we get the appropriate
  // accounting or standard signing. however, if we have the style set to 'decimal'
  // to leave off the currency symbol, it removes outer parenthesis. this
  // only affects negative decimal numbers with currency symbol set to 'accounting,
  // so correct for this use case.
  let signedFormattedNumber = formattedNumber;
  if (rawValue < 0 && formatOptions.currencySign === 'accounting' && formatOptions.style === 'decimal') {
    // in this use case, the minus sign must be suppressed
    formatOptions.signDisplay = 'never';
    signedFormattedNumber = `(${formattedNumber})`;
  }

  return signedFormattedNumber;
}
