/**
 * Common chit fund calculations
 */
export const calculateChitFinancials = ({ chitValue, memberCount, durationMonths }) => {
  const value = Number(chitValue) || 0;
  const count = Number(memberCount) || 0;
  const duration = Number(durationMonths) || count || 1;

  const monthlyInstallment = duration > 0 ? Math.round(value / duration) : 0;
  const expectedTotalCollection = value;

  return {
    monthlyInstallment,
    expectedTotalCollection,
    duration,
  };
};

export const calculateCollectionEfficiency = (collected, expected) => {
  if (!expected || expected <= 0) return 0;
  const percent = (collected / expected) * 100;
  return Math.min(Math.round(percent * 10) / 10, 100);
};

