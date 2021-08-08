import { formatData, formatNumber } from './format-service';
import {
    locale, 
    testRows, 
    headers1, 
    headers2, 
    formatParameters1, 
    formattedRows1, 
    formatParameters2, 
    formattedRows2
} from './format-service.data';

test('format single number to 1 decimal place', () => {
    const formattedNumber = formatNumber(100, locale, formatParameters1);
    expect(formattedNumber).toEqual('100.0');
});

test('format single number to 2 decimal places', () => {
    const formattedNumber = formatNumber(100, locale, formatParameters2);
    expect(formattedNumber).toEqual('100.00');
});

test('try to format an invalid number', () => {
    expect(() => formatNumber('100.A', locale, formatParameters1)).toThrow('Input value is not a number: 100.A');
});

test('format rows to 1 decimal place', () => {
    formatData(testRows, headers1, locale, formatParameters1)
    expect(testRows).toStrictEqual(formattedRows1);
});

test('format rows to 2 decimal places', () => {
    formatData(testRows, headers1, locale, formatParameters2)
    expect(testRows).toStrictEqual(formattedRows2);
});

test('attempt to format numbers with invalid header', () => {
    expect(() => formatData(testRows, headers2, locale, formatParameters2))
        .toThrow('Unknown format type: fake');
});