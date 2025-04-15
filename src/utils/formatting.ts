export const formatStringNumberWithDecimalPrecision = (
  stringNumber: string,
  maxDecimals: number,
): string => {
  if (stringNumber.includes(".")) {
    const [integerPart, decimalPart] = stringNumber.split(".");

    const truncatedDecimal = decimalPart.slice(0, maxDecimals);

    return `${integerPart}.${truncatedDecimal}`;
  } else {
    return stringNumber;
  }
};
