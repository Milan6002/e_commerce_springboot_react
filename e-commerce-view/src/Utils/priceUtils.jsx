export const calculateDiscountPrice = (price, discount) => {
  if (!price) return 0;

  const discountAmount = (price * discount) / 100;
  const finalPrice = price - discountAmount;

  return Math.round(finalPrice);
};