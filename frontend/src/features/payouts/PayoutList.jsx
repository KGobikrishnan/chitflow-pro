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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Payouts & Auction Management
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredPayouts.length} Draws Held
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit monthly auction bidding, 5% foreman commissions, and subscriber dividend distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Auction Draw</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Net Disbursed to Winners</span>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
            {formatCurrency(totalNetDisbursed)}
          </p>
          <p className="text-[11px] text-slate-500">{filteredPayouts.length} successful auctions</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gross Chit Disbursed</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
            {formatCurrency(totalGrossDistributed)}
          </p>
          <p className="text-[11px] text-slate-500">Cumulative prize pool</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Company Commission Earned</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            {formatCurrency(totalCommissionEarned)}
          </p>
          <p className="text-[11px] text-slate-500">5% statutory service fee</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Discount Bids Realized</span>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
            {formatCurrency(totalDiscountBids)}
          </p>
          <p className="text-[11px] text-slate-500">Dividends returned to circle</p>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
        <div className="p-3 border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 dark:text-white">
            Completed Auction Draws & Prize Disbursements
          </span>
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Chit Circles</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Payout ID</th>
                <th className="px-4 py-2.5">Chit Group</th>
                <th className="px-4 py-2.5">Winning Member</th>
                <th className="px-4 py-2.5">Cycle #</th>
                <th className="px-4 py-2.5">Gross Value</th>
                <th className="px-4 py-2.5">Bid Discount</th>
                <th className="px-4 py-2.5">Commission</th>
                <th className="px-4 py-2.5">Net Disbursed</th>
                <th className="px-4 py-2.5">Dividend / Sub</th>
                <th className="px-4 py-2.5">Date & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {filteredPayouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-mono text-slate-500">{po.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                    {po.groupName}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{po.memberName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{po.memberId}</div>
                  </td>
                  <td className="px-4 py-2.5 font-bold">Month #{po.installmentNumber}</td>
                  <td className="px-4 py-2.5 font-mono">{formatCurrency(po.grossAmount)}</td>
                  <td className="px-4 py-2.5 text-rose-600 font-semibold font-mono">
                    -{formatCurrency(po.discountBidAmount)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-emerald-600">
                    {formatCurrency(po.companyCommissionAmount)} ({po.companyCommissionPercent}%)
                  </td>
                  <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {formatCurrency(po.netPayoutAmount)}
                  </td>
                  <td className="px-4 py-2.5 font-medium font-mono text-slate-700 dark:text-slate-300">
                    {formatCurrency(po.dividendPerMember)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-slate-600 dark:text-slate-300">{formatDate(po.payoutDate)}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
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
      toast.success(`Prize payout of ₹${created.netPayoutAmount.toLocaleString('en-IN')} confirmed!`);
      reset();
      onClose();
    } catch (e) {
      toast.error('Failed to record payout: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-lg max-w-xl w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Record Auction Draw Payout
            </h3>
            <p className="text-xs text-slate-500">
              Calculate discount bid, 5% foreman fees, and member dividend return
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chit Circle *
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setValue('groupId', e.target.value);
                  const grp = groups.find((g) => g.id === e.target.value);
                  if (grp) setValue('grossAmount', grp.chitValue);
                }}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
                Auction Winning Subscriber *
              </label>
              <select
                {...register('memberId')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
                Auction Month # *
              </label>
              <input
                type="number"
                min="1"
                {...register('installmentNumber')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gross Pool Value (INR) *
              </label>
              <input
                type="number"
                {...register('grossAmount')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Winning Bid Discount *
              </label>
              <input
                type="number"
                {...register('discountBidAmount')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-md border border-indigo-100 dark:border-indigo-900/50 space-y-1 text-xs">
            <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-300 text-sm font-mono">
              <span>Net Disbursement to Winner:</span>
              <span>₹{netDisbursed.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              <span>Foreman Commission (5%):</span>
              <span>₹{commissionAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              <span>Dividend per Subscriber:</span>
              <span className="font-semibold text-emerald-600">₹{dividendPerMember.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disbursement Date *
              </label>
              <input
                type="date"
                {...register('payoutDate')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel *
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
            />
            {errors.referenceNumber && (
              <p className="text-rose-500 mt-1">{errors.referenceNumber.message}</p>
            )}
          </div>

          <div className="pt-3 border-t border-[#e2e4e9] dark:border-[#1e283d] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
            >
              {isSubmitting ? 'Recording...' : 'Disburse Prize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
