import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Receipt as ReceiptIcon,
  Download,
  Printer,
  ArrowRight,
  ShieldCheck,
  User,
  Layers,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { paymentSchema } from '../../utils/validators';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { receiptService } from '../../services/receipt.service';

export const RecordPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);
  const recordPayment = useAppStore((state) => state.recordPayment);
  const settings = useAppStore((state) => state.settings);

  const initialMemberId = searchParams.get('memberId') || '';
  const initialGroupId = searchParams.get('groupId') || '';
  const initialInstallmentId = searchParams.get('installmentId') || '';

  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState(initialInstallmentId);
  const [completedReceipt, setCompletedReceipt] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      groupId: initialGroupId,
      memberId: initialMemberId,
      installmentId: initialInstallmentId,
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      referenceNumber: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (initialGroupId) setSelectedGroupId(initialGroupId);
    if (initialMemberId) setSelectedMemberId(initialMemberId);
    if (initialInstallmentId) setSelectedInstallmentId(initialInstallmentId);
  }, [initialGroupId, initialMemberId, initialInstallmentId]);

  const groupMembers = selectedGroupId
    ? members.filter((m) => m.assignedGroupIds?.includes(selectedGroupId))
    : members;

  const memberInstallments = installments.filter((ins) => {
    if (selectedGroupId && ins.groupId !== selectedGroupId) return false;
    if (selectedMemberId && ins.memberId !== selectedMemberId) return false;
    return ins.remainingAmount > 0;
  });

  const activeInstallment = installments.find((ins) => ins.id === selectedInstallmentId);

  useEffect(() => {
    if (activeInstallment) {
      setValue('amount', activeInstallment.remainingAmount);
      setValue('installmentId', activeInstallment.id);
    }
  }, [activeInstallment, setValue]);

  const enteredAmount = watch('amount') || 0;
  const remainingAfterPayment = activeInstallment
    ? Math.max(0, activeInstallment.remainingAmount - Number(enteredAmount))
    : 0;

  const onSubmit = (data) => {
    const result = recordPayment(data);
    if (result.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      toast.success(`Payment of ₹${data.amount.toLocaleString('en-IN')} recorded! Receipt generated.`);
      setCompletedReceipt(result.receipt);
    } else {
      toast.error(result.error || 'Payment could not be processed.');
    }
  };

  const handleDownloadPDF = (receipt) => {
    receiptService.downloadReceiptPDF(receipt, settings);
    toast.success('Official PDF voucher downloaded.');
  };

  const handleRecordAnother = () => {
    setCompletedReceipt(null);
    reset({
      groupId: selectedGroupId,
      memberId: selectedMemberId,
      installmentId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      referenceNumber: '',
      notes: '',
    });
    setSelectedInstallmentId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Collect Installment Payment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record partial or full member subscription dues with instant receipt creation.
          </p>
        </div>
      </div>

      {completedReceipt ? (
        /* Modern Success Voucher Card */
        <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-8 shadow-md max-w-2xl mx-auto animate-in fade-in zoom-in-95">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Payment Successfully Confirmed
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Receipt No: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{completedReceipt.receiptNumber}</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#182032] rounded-md p-5 border border-[#e2e4e9] dark:border-[#1e283d] text-xs space-y-3">
            <div className="flex justify-between pb-2 border-b border-[#e2e4e9]/80 dark:border-[#1e283d]">
              <span className="text-slate-500">Subscriber:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{completedReceipt.memberName} ({completedReceipt.memberId})</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#e2e4e9]/80 dark:border-[#1e283d]">
              <span className="text-slate-500">Chit Circle:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{completedReceipt.groupName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#e2e4e9]/80 dark:border-[#1e283d]">
              <span className="text-slate-500">Installment Cycle:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">Month #{completedReceipt.installmentNumber}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#e2e4e9]/80 dark:border-[#1e283d]">
              <span className="text-slate-500">Amount Collected:</span>
              <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(completedReceipt.amountReceived)}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#e2e4e9]/80 dark:border-[#1e283d]">
              <span className="text-slate-500">Outstanding Remaining:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                {formatCurrency(completedReceipt.remainingBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Channel & Ref:</span>
              <span className="font-medium font-mono text-slate-800 dark:text-slate-200">
                {completedReceipt.paymentMethod} • {completedReceipt.referenceNumber}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => handleDownloadPDF(completedReceipt)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </button>
            <button
              onClick={() => navigate(`/receipts?receiptNumber=${completedReceipt.receiptNumber}`)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <ReceiptIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>View in Receipts</span>
            </button>
            <button
              onClick={handleRecordAnother}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md"
            >
              Record Another
            </button>
          </div>
        </div>
      ) : (
        /* Payment Workflow Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-6 shadow-xs">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Select Chit Circle *
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value);
                    setValue('groupId', e.target.value);
                    setSelectedMemberId('');
                    setValue('memberId', '');
                    setSelectedInstallmentId('');
                    setValue('installmentId', '');
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                >
                  <option value="">-- Choose Circle --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Value: ₹{g.chitValue.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                {errors.groupId && <p className="text-rose-500 mt-1">{errors.groupId.message}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Select Enrolled Subscriber *
                </label>
                <select
                  value={selectedMemberId}
                  disabled={!selectedGroupId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    setValue('memberId', e.target.value);
                    setSelectedInstallmentId('');
                    setValue('installmentId', '');
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">-- Choose Member --</option>
                  {groupMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id} - {m.city})
                    </option>
                  ))}
                </select>
                {errors.memberId && <p className="text-rose-500 mt-1">{errors.memberId.message}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  3. Select Pending Installment Cycle *
                </label>
                <select
                  value={selectedInstallmentId}
                  disabled={!selectedMemberId}
                  onChange={(e) => {
                    setSelectedInstallmentId(e.target.value);
                    setValue('installmentId', e.target.value);
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">-- Choose Installment Schedule --</option>
                  {memberInstallments.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      Month #{ins.installmentNumber} (Due: {formatDate(ins.dueDate)}) — Balance: ₹
                      {ins.remainingAmount.toLocaleString('en-IN')} [{ins.status}]
                    </option>
                  ))}
                </select>
                {errors.installmentId && (
                  <p className="text-rose-500 mt-1">{errors.installmentId.message}</p>
                )}
                {selectedMemberId && memberInstallments.length === 0 && (
                  <p className="text-emerald-600 mt-1 font-medium">
                    All installments for this subscriber are fully settled!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Amount (INR) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter amount (Supports partial)"
                    {...register('amount')}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono font-bold"
                  />
                  {errors.amount && <p className="text-rose-500 mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    {...register('paymentDate')}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Channel *
                  </label>
                  <select
                    {...register('paymentMethod')}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / QR)</option>
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT / IMPS / RTGS)</option>
                    <option value="CASH">Cash Counter Payment</option>
                    <option value="CHEQUE">Cheque / Demand Draft</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Ref / Cheque No *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI8839210 or NEFT91823"
                    {...register('referenceNumber')}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
                  />
                  {errors.referenceNumber && (
                    <p className="text-rose-500 mt-1">{errors.referenceNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collection Remarks
                </label>
                <input
                  type="text"
                  placeholder="Optional teller notes or ledger comments"
                  {...register('notes')}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#e2e4e9] dark:border-[#1e283d] flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !activeInstallment}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Recording...' : 'Confirm Payment & Generate Receipt'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Breakdown Preview */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs text-xs space-y-3.5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-[#e2e4e9] dark:border-[#1e283d]">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Transaction Breakdown</span>
              </h3>

              {activeInstallment ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheduled Due:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {formatCurrency(activeInstallment.expectedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Previously Paid:</span>
                      <span className="font-semibold text-emerald-600 font-mono">
                        {formatCurrency(activeInstallment.paidAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Balance:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {formatCurrency(activeInstallment.remainingAmount)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#e2e4e9] dark:border-[#1e283d] flex justify-between text-indigo-600 font-bold font-mono">
                      <span>Being Collected:</span>
                      <span>{formatCurrency(enteredAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white font-mono">
                      <span>Remaining After:</span>
                      <span className={remainingAfterPayment === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                        {formatCurrency(remainingAfterPayment)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-[#182032] rounded border border-[#e2e4e9]/60 dark:border-[#1e283d] text-[11px] leading-relaxed">
                    {remainingAfterPayment === 0 ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        This transaction will fully settle Month #{activeInstallment.installmentNumber}.
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Partial collection. ₹{remainingAfterPayment.toLocaleString('en-IN')} remains outstanding.
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Select circle, member, and installment to preview financial breakdown.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
