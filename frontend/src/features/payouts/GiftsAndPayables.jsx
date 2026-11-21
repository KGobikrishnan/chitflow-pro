import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Filter,
  DollarSign,
  X,
  CreditCard,
  User,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export const GiftsAndPayables = () => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const giftSchemes = useAppStore((state) => state.giftSchemes || []);
  const updateGiftSubscriberStatus = useAppStore((state) => state.updateGiftSubscriberStatus);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState(giftSchemes[0]?.id || '');
  const [activePaymentModalData, setActivePaymentModalData] = useState(null); // { schemeId, memberId, memberName, payableAmount, giftItem }

  const activeScheme = giftSchemes.find((s) => s.id === selectedSchemeId) || giftSchemes[0];

  // Subscribers assigned under this scheme
  const schemeSubscribers = activeScheme ? activeScheme.subscribers || [] : [];

  const totalPayableBudget = (activeScheme?.payable || 0) * (schemeSubscribers.length || 0);
  const totalPaidCount = schemeSubscribers.filter((s) => s.status === 'PAID').length;
  const totalPendingCount = schemeSubscribers.length - totalPaidCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600" />
              <span>Gifts & Payables Management</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {giftSchemes.length} Active Schemes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Administer festival gifts, gold/silver tokens, bonus incentives, and payable distributions for Standard Chit Plans.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Gift & Payable Scheme</span>
        </button>
      </div>

      {/* Scheme Selector & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Scheme Selector */}
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] flex flex-col justify-between">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Active Chit Scheme
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md font-semibold text-slate-900 dark:text-white"
          >
            {giftSchemes.length === 0 && <option value="">No schemes created</option>}
            {giftSchemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.groupName} - {s.giftName}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-2 block font-mono">
            Disbursement: {activeScheme?.dateOfDisbursement || 'N/A'}
          </span>
        </div>

        {/* Gift Token Info */}
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gift Reward Item</span>
          <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{activeScheme?.giftName || 'None'}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Disbursed to all eligible subscribers</p>
        </div>

        {/* Payable Cash Component */}
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Cash Payable Per Sub</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
            {formatCurrency(activeScheme?.payable || 0)}
          </p>
          <p className="text-[11px] text-slate-500">Total pool: {formatCurrency(totalPayableBudget)}</p>
        </div>

        {/* Settlement Ratio */}
        <div className="p-4 bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Settlement Status</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
              {totalPaidCount} / {schemeSubscribers.length}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-semibold">
              {totalPendingCount} Pending
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${schemeSubscribers.length > 0 ? (totalPaidCount / schemeSubscribers.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid Box / Subscriber List Under This Plan */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
        <div className="p-3 border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              Subscribers Under Scheme: {activeScheme?.groupName || 'Select a Scheme'} ({schemeSubscribers.length} Members)
            </span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Due Date: {activeScheme?.dateOfDisbursement || '-'}
          </span>
        </div>

        {schemeSubscribers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No subscribers enrolled in this plan. Create a new Gift & Payable Scheme above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-[#182032] text-[10px] uppercase text-slate-500 dark:text-slate-400 font-mono border-b border-[#e2e4e9] dark:border-[#1e283d]">
                <tr>
                  <th className="px-4 py-2.5">Subscriber</th>
                  <th className="px-4 py-2.5">Contact Details</th>
                  <th className="px-4 py-2.5">Gift Item</th>
                  <th className="px-4 py-2.5 text-right">Payable Cash</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Disbursement Details</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e4e9] dark:divide-[#1e283d]">
                {schemeSubscribers.map((sub) => {
                  const isPaid = sub.status === 'PAID';
                  return (
                    <tr key={sub.memberId} className="hover:bg-slate-50/50 dark:hover:bg-[#151c2e]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {sub.memberName}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{sub.memberId}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        <div>{sub.mobile || '-'}</div>
                        <div className="text-[10px] text-slate-400">{sub.city || 'Tamil Nadu'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Gift className="w-3 h-3 text-amber-600" />
                          <span>{activeScheme.giftName}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(activeScheme.payable || 0)}
                      </td>
                      <td className="px-4 py-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {isPaid ? (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {sub.paymentMethod}
                            </span>{' '}
                            • {sub.referenceNo}
                            <div className="text-[10px] text-slate-400">Paid on: {formatDate(sub.paidDate)}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not disbursed yet</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isPaid ? (
                          <span className="text-[11px] font-medium text-emerald-600">Disbursed</span>
                        ) : (
                          <button
                            onClick={() =>
                              setActivePaymentModalData({
                                schemeId: activeScheme.id,
                                memberId: sub.memberId,
                                memberName: sub.memberName,
                                payableAmount: activeScheme.payable,
                                giftItem: activeScheme.giftName,
                              })
                            }
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Create Gift Scheme Pop-up */}
      <CreateGiftSchemeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* 2. Paid Action Pop-up (Payment Method & Reference No) */}
      {activePaymentModalData && (
        <MarkPaidModal
          data={activePaymentModalData}
          onClose={() => setActivePaymentModalData(null)}
          onConfirm={(paymentData) => {
            updateGiftSubscriberStatus(
              activePaymentModalData.schemeId,
              activePaymentModalData.memberId,
              paymentData
            );
            toast.success(`Disbursement confirmed for ${activePaymentModalData.memberName}!`);
            setActivePaymentModalData(null);
          }}
        />
      )}
    </div>
  );
};

/**
 * 1. Create Gift & Payable Scheme Modal
 * Pop-up Fields:
 * 1. Chit Circle
 * 2. Gift (List - Client will enter this)
 * 3. Payable
 * 4. Date of Disbursement
 */
const CreateGiftSchemeModal = ({ isOpen, onClose }) => {
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const addGiftScheme = useAppStore((state) => state.addGiftScheme);

  // Filter groups strictly to Gift & Payable category
  const giftEligibleGroups = groups.filter((g) => {
    if (g.distributionCategory) {
      return g.distributionCategory === 'GIFT_PAYABLE';
    }
    return g.id === 'GRP-2026-001' || g.planType === 'STANDARD';
  });

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [giftName, setGiftName] = useState('1 Gram Gold Coin (916 KDM)');
  const [payable, setPayable] = useState(5000);
  const [dateOfDisbursement, setDateOfDisbursement] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGroupId) {
      toast.error('Please select a Chit Circle');
      return;
    }

    const group = groups.find((g) => g.id === selectedGroupId);
    // Find subscribers enrolled in this circle
    const enrolledMembers = members.filter((m) => m.assignedGroupIds?.includes(selectedGroupId));

    const scheme = {
      id: `GFT-${Date.now().toString().slice(-6)}`,
      groupId: selectedGroupId,
      groupName: group?.name || 'Standard Chit Circle',
      giftName,
      payable: Number(payable),
      dateOfDisbursement,
      createdAt: new Date().toISOString(),
      subscribers: enrolledMembers.map((m) => ({
        memberId: m.id,
        memberName: m.fullName,
        mobile: m.mobileNumber,
        city: m.city,
        status: 'PENDING',
        paidDate: null,
        paymentMethod: null,
        referenceNo: null,
      })),
    };

    addGiftScheme(scheme);
    toast.success(`Gift & Payable Scheme established for "${scheme.groupName}"!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-indigo-600" />
              <span>Establish Gift & Payable Scheme</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure gifts and payable cash incentives for Standard Chit subscribers
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* 1. Chit Circle */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Chit Circle *
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
                const chosenGroup = groups.find((g) => g.id === e.target.value);
                // Pre-populate gifts if defined in chit group creation
                if (chosenGroup?.giftItems && chosenGroup.giftItems.length > 0) {
                  const giftTitles = chosenGroup.giftItems.map((gi) => gi.title).filter(Boolean).join(', ');
                  if (giftTitles) setGiftName(giftTitles);
                  const totalExtra = chosenGroup.giftItems.reduce((sum, gi) => sum + (Number(gi.extraCash) || 0), 0);
                  if (totalExtra > 0) setPayable(totalExtra);
                }
              }}
              required
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            >
              <option value="">-- Choose Gift & Payable Chit Circle --</option>
              {giftEligibleGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.id})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Gift (Client will enter this) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. Gift Reward / Incentive Item *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1 Gram Gold Coin, Silver Lamp, Festival Gift Hamper"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
          </div>

          {/* 3. Payable Cash Component */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. Payable Amount (INR Per Subscriber) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={payable}
              onChange={(e) => setPayable(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* 4. Date of Disbursement */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              4. Date of Disbursement *
            </label>
            <input
              type="date"
              required
              value={dateOfDisbursement}
              onChange={(e) => setDateOfDisbursement(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-[#e2e4e9] dark:border-[#1e283d]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Create Scheme</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * 2. Mark Paid Pop-up (Payment Method & Reference No)
 */
const MarkPaidModal = ({ data, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [referenceNo, setReferenceNo] = useState(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      paymentMethod,
      referenceNo,
      paidDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111625] rounded-xl max-w-sm w-full p-5 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Confirm Disbursement
            </h3>
            <p className="text-[11px] text-slate-500">
              {data.memberName} ({data.memberId})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-900/40 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Gift Token:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{data.giftItem}</span>
          </div>
          <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-300 font-mono mt-1 text-sm">
            <span>Payable Amount:</span>
            <span>₹{Number(data.payableAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            >
              <option value="BANK_TRANSFER">Bank Transfer (IMPS / NEFT)</option>
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="CASH">Cash Counter</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reference / Cheque No *
            </label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Paid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

