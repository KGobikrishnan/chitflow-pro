export const analyticsService = {
  calculateKPIs: ({ groups = [], members = [], installments = [], payouts = [] }) => {
    const activeChits = groups.filter((g) => g.status === 'ACTIVE').length;
    const totalMembers = members.length;

    // Monthly expected collection across active groups
    const expectedMonthlyCollection = groups
      .filter((g) => g.status === 'ACTIVE')
      .reduce((sum, g) => sum + (Number(g.monthlyInstallment) * Number(g.memberCount) || 0), 0);

    // Sum from all installments
    let totalCollected = 0;
    let totalPending = 0;
    let overdueCount = 0;
    let overdueAmount = 0;
    let paidCount = 0;
    let partiallyPaidCount = 0;
    let pendingCount = 0;

    installments.forEach((ins) => {
      totalCollected += Number(ins.paidAmount) || 0;
      totalPending += Number(ins.remainingAmount) || 0;

      if (ins.status === 'PAID') paidCount++;
      else if (ins.status === 'PARTIALLY_PAID') partiallyPaidCount++;
      else if (ins.status === 'OVERDUE') {
        overdueCount++;
        overdueAmount += Number(ins.remainingAmount) || 0;
      } else if (ins.status === 'PENDING') {
        pendingCount++;
      }
    });

    const totalPayouts = payouts.reduce((sum, p) => sum + (Number(p.netPayoutAmount) || 0), 0);

    const totalExpectedEver = totalCollected + totalPending;
    const collectionEfficiency = totalExpectedEver > 0 ? Math.round((totalCollected / totalExpectedEver) * 100) : 0;

    return {
      activeChits,
      totalMembers,
      expectedMonthlyCollection,
      totalCollected,
      totalPending,
      totalPayouts,
      collectionEfficiency,
      overdueCount,
      overdueAmount,
      distribution: {
        paid: paidCount,
        partiallyPaid: partiallyPaidCount,
        pending: pendingCount,
        overdue: overdueCount,
      },
    };
  },

  getMonthlyCollectionTrend: (transactions = []) => {
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const monthKey = tx.paymentDate ? tx.paymentDate.substring(0, 7) : 'Unknown';
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, collected: 0, count: 0 };
      }
      monthlyMap[monthKey].collected += Number(tx.amount) || 0;
      monthlyMap[monthKey].count += 1;
    });

    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
  },
};

