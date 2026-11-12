import { parseISO, addMonths, format } from 'date-fns';

export const installmentService = {
  /**
   * Generates full installment schedule for a chit group and its members
   */
  generateGroupSchedules: (group, members) => {
    const installments = [];
    const duration = Number(group.durationMonths);
    const start = parseISO(group.startDate);
    const dueDay = Number(group.collectionDueDate) || 10;
    const monthlyAmount = Number(group.monthlyInstallment);

    for (let m = 1; m <= duration; m++) {
      const monthDate = addMonths(start, m - 1);
      const yr = monthDate.getFullYear();
      const mo = monthDate.getMonth() + 1;
      const moStr = mo < 10 ? `0${mo}` : `${mo}`;
      const dueDayStr = dueDay < 10 ? `0${dueDay}` : `${dueDay}`;
      const dueDate = `${yr}-${moStr}-${dueDayStr}`;
      const monthLabel = `${yr}-${moStr}`;

      members.forEach((member) => {
        const id = `INS-${group.id}-M${m < 10 ? '0' + m : m}-${member.id}`;
        installments.push({
          id,
          groupId: group.id,
          memberId: member.id,
          installmentNumber: m,
          month: monthLabel,
          dueDate,
          expectedAmount: monthlyAmount,
          paidAmount: 0,
          remainingAmount: monthlyAmount,
          paymentDate: null,
          status: 'UPCOMING',
        });
      });
    }

    return installments;
  },

  /**
   * Calculate status based on amounts & current date
   */
  computeInstallmentStatus: (installment, currentDate = new Date()) => {
    if (installment.remainingAmount <= 0 && installment.paidAmount > 0) {
      return 'PAID';
    }
    if (installment.paidAmount > 0 && installment.remainingAmount > 0) {
      return 'PARTIALLY_PAID';
    }

    const due = new Date(installment.dueDate);
    if (due < currentDate) {
      return 'OVERDUE';
    }
    return 'PENDING';
  },
};

