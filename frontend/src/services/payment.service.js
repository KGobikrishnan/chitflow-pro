import { receiptService } from './receipt.service';

export const paymentService = {
  /**
   * Process a payment atomically:
   * 1. Validates installment exists
   * 2. Checks not overpaying
   * 3. Calculates new paid & remaining
   * 4. Determines updated status
   * 5. Creates transaction & receipt
   */
  processPayment: ({
    paymentData,
    installments,
    members,
    groups,
    existingReceiptsCount,
  }) => {
    const { groupId, memberId, installmentId, amount, paymentDate, paymentMethod, referenceNumber, notes } = paymentData;

    const installmentIndex = installments.findIndex((ins) => ins.id === installmentId);
    if (installmentIndex === -1) {
      throw new Error('Installment not found.');
    }

    const currentInst = installments[installmentIndex];
    const payAmt = Number(amount);

    if (payAmt <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    if (payAmt > currentInst.remainingAmount) {
      throw new Error(`Payment cannot exceed outstanding balance of ₹${currentInst.remainingAmount.toLocaleString('en-IN')}`);
    }

    const member = members.find((m) => m.id === memberId);
    const group = groups.find((g) => g.id === groupId);

    const newPaidAmount = currentInst.paidAmount + payAmt;
    const newRemaining = currentInst.expectedAmount - newPaidAmount;
    const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const updatedInstallment = {
      ...currentInst,
      paidAmount: newPaidAmount,
      remainingAmount: newRemaining,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      status: newStatus,
    };

    const receiptNumber = receiptService.generateReceiptNumber(existingReceiptsCount);
    const txId = `TXN-${Date.now()}`;

    const newTransaction = {
      id: txId,
      receiptNumber,
      groupId,
      memberId,
      installmentId,
      installmentNumber: currentInst.installmentNumber,
      amount: payAmt,
      expectedAmount: currentInst.expectedAmount,
      previousPaid: currentInst.paidAmount,
      remainingBalance: newRemaining,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      referenceNumber,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    const newReceipt = {
      id: `RCPT-${Date.now()}`,
      receiptNumber,
      transactionId: txId,
      groupId,
      groupName: group?.name || 'Chit Group',
      memberId,
      memberName: member?.fullName || 'Member',
      memberMobile: member?.mobileNumber || '',
      installmentNumber: currentInst.installmentNumber,
      month: currentInst.month,
      expectedAmount: currentInst.expectedAmount,
      previousPaid: currentInst.paidAmount,
      amountReceived: payAmt,
      remainingBalance: newRemaining,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      referenceNumber,
      status: newStatus,
      createdAt: new Date().toISOString(),
    };

    return {
      updatedInstallment,
      newTransaction,
      newReceipt,
    };
  },
};

