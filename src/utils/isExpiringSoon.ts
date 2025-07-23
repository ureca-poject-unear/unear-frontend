export const isExpiringSoon = (couponEnd: string): boolean => {
  const today = new Date();
  const endDate = new Date(couponEnd);
  const diffInDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays <= 7;
};
