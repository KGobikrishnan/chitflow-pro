import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Trophy,
  Plus,
  Calendar,
  IndianRupee,
  Download,
  Users,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { payoutSchema } from '../../utils/validators';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { PageHeader } from '../../components/common/PageHeader';
import { exportToCSV } from '../../utils/export';

export const PayoutList = () => {
  const payouts = useAppStore((state) => state.payouts);
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const recordPayout = useAppStore((state) => state.recordPayout);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  const filteredPayouts = payouts.filter((p) => {
    if (selectedGroupFilter !== 'ALL' && p.groupId !== selectedGroupFilter) return false;
    return true;
  });

  const totalGrossDistributed = filteredPayouts.reduce((sum, p) => sum + (p.grossAmount || 0), 0);
  const totalNetDisbursed = filteredPayouts.reduce((sum, p) => sum + (p.netPayoutAmount || 0), 0);
  const totalCommissionEarned = filteredPayouts.reduce((sum, p) => sum + (p.companyCommissionAmount || 0), 0);
  const totalDiscountBids = filteredPayouts.reduce((sum, p) => sum + (p.discountBidAmount || 0), 0);

  const handleExportCSV = () => {
    const data = filteredPayouts.map((p) => ({
      'Payout ID': p.id,
      'Group': p.groupName,
      'Winning Member': p.memberName,
      'Installment Number': p.installmentNumber,
      'Gross Value (INR)': p.grossAmount,
      'Discount Bid (INR)': p.discountBidAmount,
      'Foreman Commission (INR)': p.companyCommissionAmount,
      'Net Disbursed (INR)': p.netPayoutAmount,
      'Dividend / Member': p.dividendPerMember,
      'Payout Date': p.payoutDate,
      'Reference': p.referenceNumber,
    }));
    exportToCSV(data, `ChitFlow_Payouts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts & Auction Management"
        subtitle="Manage monthly auction bidding, discount dividend calculation and prize money disbursement"
        breadcrumbs={['ChitFlow', 'Payouts & Auctions']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Payouts</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Payout</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Net Disbursed to Members</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {formatCurrency(totalNetDisbursed)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {filteredPayouts.length} auction draws</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Gross Chit Disbursed</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalGrossDistributed)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Aggregate face value</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Foreman Commission Earned</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalCommissionEarned)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">5% statutory service fee</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Auction Bid Discounts</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(totalDiscountBids)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Distributed as member dividends</p>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 dark:text-white">
            Completed Auction Draws & Prize Disbursements
          </span>
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Payout ID</th>
                <th className="px-4 py-3">Chit Group</th>
                <th className="px-4 py-3">Winning Member</th>
                <th className="px-4 py-3">Draw #</th>
                <th className="px-4 py-3">Gross Value</th>
                <th className="px-4 py-3">Bid Discount</th>
                <th className="px-4 py-3">Company Commission</th>
                <th className="px-4 py-3">Net Disbursed</th>
                <th className="px-4 py-3">Dividend / Member</th>
                <th className="px-4 py-3">Date & Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-medium text-slate-500">{po.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {po.groupName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{po.memberName}</div>
                    <div className="text-[11px] text-slate-400">{po.memberId}</div>
                  </td>
                  <td className="px-4 py-3 font-bold">Month {po.installmentNumber}</td>
                  <td className="px-4 py-3">{formatCurrency(po.grossAmount)}</td>
                  <td className="px-4 py-3 text-rose-600 font-semibold">
                    -{formatCurrency(po.discountBidAmount)}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-600">
                    {formatCurrency(po.companyCommissionAmount)} ({po.companyCommissionPercent}%)
                  </td>
                  <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(po.netPayoutAmount)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(po.dividendPerMember)}
                  </td>
                  <td className="px-4 py-3">
                    <div>{formatDate(po.payoutDate)}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {po.paymentMethod} • {po.referenceNumber}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreatePayoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// Modal for recording new payout
const CreatePayoutModal = ({ isOpen, onClose }) => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const recordPayout = useAppStore((state) => state.recordPayout);

  const [selectedGroupId, setSelectedGroupId] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      groupId: '',
      memberId: '',
      installmentNumber: 1,
      grossAmount: 500000,
      discountBidAmount: 60000,
      companyCommissionPercent: 5,
      payoutDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'BANK_TRANSFER',
      referenceNumber: '',
      notes: '',
    },
  });

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupMembers = selectedGroupId
    ? members.filter((m) => m.assignedGroupIds?.includes(selectedGroupId))
    : members;

  const grossVal = watch('grossAmount') || 0;
  const bidDiscount = watch('discountBidAmount') || 0;
  const commPercent = watch('companyCommissionPercent') || 5;

  const commissionAmount = Math.round((grossVal * commPercent) / 100);
  const netDisbursed = Math.max(0, grossVal - bidDiscount);
  const dividendPool = Math.max(0, bidDiscount - commissionAmount);
  const dividendPerMember = selectedGroup?.memberCount ? Math.round(dividendPool / selectedGroup.memberCount) : 0;

  if (!isOpen) return null;

  const onSubmit = (data) => {
    try {
      const created = recordPayout(data);
      toast.success(`Payout of ₹${created.netPayoutAmount.toLocaleString('en-IN')} recorded successfully!`);
      reset();
      onClose();
    } catch (e) {
      toast.error('Failed to record payout: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Record Auction Payout
            </h3>
            <p className="text-xs text-slate-500">
              Disburse chit prize money with transparent dividend calculation
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chit Group *
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setValue('groupId', e.target.value);
                  const grp = groups.find((g) => g.id === e.target.value);
                  if (grp) setValue('grossAmount', grp.chitValue);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="">-- Select Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.groupId && <p className="text-rose-500 mt-1">{errors.groupId.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Winning Member *
              </label>
              <select
                {...register('memberId')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="">-- Select Winner --</option>
                {groupMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.id})
                  </option>
                ))}
              </select>
              {errors.memberId && <p className="text-rose-500 mt-1">{errors.memberId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Draw / Month # *
              </label>
              <input
                type="number"
                min="1"
                {...register('installmentNumber')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gross Chit (INR) *
              </label>
              <input
                type="number"
                {...register('grossAmount')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Winning Bid Discount (INR) *
              </label>
              <input
                type="number"
                {...register('discountBidAmount')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Live Calculation Preview Banner */}
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900 space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-300 text-sm">
              <span>Net Disbursement to Winner:</span>
              <span>₹{netDisbursed.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Foreman Commission (5%):</span>
              <span>₹{commissionAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Dividend per Subscriber:</span>
              <span className="font-semibold text-emerald-600">₹{dividendPerMember.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payout Date *
              </label>
              <input
                type="date"
                {...register('payoutDate')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disbursement Method *
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS)</option>
                <option value="CHEQUE">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bank Ref / Transaction / Cheque No *
            </label>
            <input
              type="text"
              placeholder="e.g. NEFT928172901 or CHQ-448201"
              {...register('referenceNumber')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            {errors.referenceNumber && (
              <p className="text-rose-500 mt-1">{errors.referenceNumber.message}</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              {isSubmitting ? 'Recording...' : 'Disburse Prize Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

