export function extractNumberFromString(itemPrice: String) {
  return Number(itemPrice.replace(/[^.\d]/g, ''));
}

export function calculateTotal(...args: number[]) {
  let sum = 0;
  for (let arg of args) sum += arg;
  return sum;
}

export function calculateTax(totalItemsPrice: number, tax = 0.08, digits = 2) {
  const itemsTax = tax * totalItemsPrice;
  const itemsTaxFixed = itemsTax.toFixed(digits);
  return extractNumberFromString(itemsTaxFixed);
}
