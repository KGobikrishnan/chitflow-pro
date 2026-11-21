import React, { useState } from 'react';
import {
  X,
  Layers,
  Calendar,
  Sparkles,
  Info,
  Check,
  IndianRupee,
  Gift,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { calculateEndDate } from '../../utils/date';

/**
 * Distribution Categories:
 * - NON_AUCTION: Non-Auction Payment (Maturity / Fixed Return)
 * - GIFT_PAYABLE: Gift & Payable (Gifts + Cash breakdown)
 * - AUCTION_PAYOUT: Auction & Payouts (Auction Bidding & Dividends)
 */
export const CreateGroupModal = ({ isOpen, onClose }) => {
  const addGroup = useAppStore((state) => state.addGroup);

  // 1. Distribution Category Selection (Top Step)
  const [distributionCategory, setDistributionCategory] = useState('AUCTION_PAYOUT'); // 'NON_AUCTION' | 'GIFT_PAYABLE' | 'AUCTION_PAYOUT'

  // 2. Plan Architecture
  const [selectedPlanType, setSelectedPlanType] = useState('STANDARD'); // 'STANDARD' | 'MONTHLY_DIFFERENT'

  // Dynamic Gift Items for GIFT_PAYABLE category
  const [giftItems, setGiftItems] = useState([
    { id: '1', title: '1 Gram 916 Hallmark Gold Coin', extraCash: 0 },
  ]);

  const handleAddGiftItem = () => {
    setGiftItems((prev) => [
      ...prev,
      { id: String(Date.now()), title: '', extraCash: 0 },
    ]);
  };

  const handleRemoveGiftItem = (id) => {
    if (giftItems.length <= 1) {
      toast.error('At least one gift item is required for Gift & Payable scheme');
      return;
    }
    setGiftItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGiftItemChange = (id, field, value) => {
    setGiftItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Create New Chit Circle Scheme</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure distribution category, returns architecture, and tenure rules
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Chit Category / Distribution Type Selection */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase font-mono tracking-wider">
            Step 1: Chit Category / Distribution Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Auction & Payouts */}
            <button
              type="button"
              onClick={() => setDistributionCategory('AUCTION_PAYOUT')}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                distributionCategory === 'AUCTION_PAYOUT'
                  ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 ring-1 ring-purple-600'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#151c2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Auction & Payouts</span>
                </div>
                {distributionCategory === 'AUCTION_PAYOUT' && (
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                Monthly auction bidding, foreman commission, and member dividend payouts.
              </p>
            </button>

            {/* Gift & Payable */}
            <button
              type="button"
              onClick={() => setDistributionCategory('GIFT_PAYABLE')}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                distributionCategory === 'GIFT_PAYABLE'
                  ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-600'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#151c2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Gift & Payable</span>
                </div>
                {distributionCategory === 'GIFT_PAYABLE' && (
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                Festival gifts (gold, silver, articles) + extra payable cash disbursements.
              </p>
            </button>

            {/* Non-auction Payment */}
            <button
              type="button"
              onClick={() => setDistributionCategory('NON_AUCTION')}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                distributionCategory === 'NON_AUCTION'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#151c2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Non-auction Payment</span>
                </div>
                {distributionCategory === 'NON_AUCTION' && (
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                Full maturity return or structured fixed payout without auction discount.
              </p>
            </button>
          </div>
        </div>

        {/* DYNAMIC GIFT DETAILS SECTION (Only when Category is Gift & Payable) */}
        {distributionCategory === 'GIFT_PAYABLE' && (
          <div className="mt-4 p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Gift className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-xs text-amber-950 dark:text-amber-200">
                  Gift & Cash Breakdown Allocation
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddGiftItem}
                className="px-2 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Define the gifts (e.g. 1 gram gold, silver lamp) and extra cash amounts allocated to subscribers under this circle:
            </p>

            <div className="space-y-2">
              {giftItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-[#182032] rounded-md border border-amber-200 dark:border-amber-900/50 text-xs"
                >
                  <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-300 w-14 shrink-0">
                    Gift #{idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Gram 916 Gold Coin / Festival Hamper"
                    value={item.title}
                    onChange={(e) => handleGiftItemChange(item.id, 'title', e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1 w-36 shrink-0">
                    <span className="text-slate-400 font-mono text-[11px]">Extra ₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Cash (e.g. 5000)"
                      value={item.extraCash}
                      onChange={(e) => handleGiftItemChange(item.id, 'extraCash', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  {giftItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGiftItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Plan Type Selector Tabs */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase font-mono tracking-wider">
            Step 2: Installment Plan Architecture *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedPlanType('STANDARD')}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                selectedPlanType === 'STANDARD'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#151c2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      selectedPlanType === 'STANDARD'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Standard Chit Plan</span>
                </div>
                {selectedPlanType === 'STANDARD' && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Fixed monthly contribution target across all tenure cycles.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlanType('MONTHLY_DIFFERENT')}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                selectedPlanType === 'MONTHLY_DIFFERENT'
                  ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 ring-1 ring-purple-600'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#151c2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      selectedPlanType === 'MONTHLY_DIFFERENT'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Monthly Different Plan</span>
                </div>
                {selectedPlanType === 'MONTHLY_DIFFERENT' && (
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Custom individual contribution and payable amount per monthly cycle without auto-calc overwrites.
              </p>
            </button>
          </div>
        </div>

        {/* STEP 3: Form Body Based on Plan Type */}
        {selectedPlanType === 'STANDARD' ? (
          <StandardPlanForm
            addGroup={addGroup}
            distributionCategory={distributionCategory}
            giftItems={giftItems}
            onClose={onClose}
          />
        ) : (
          <MonthlyDifferentPlanForm
            addGroup={addGroup}
            distributionCategory={distributionCategory}
            giftItems={giftItems}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

/**
 * 1. Standard Chit Plan Form
 */
const StandardPlanForm = ({ addGroup, distributionCategory, giftItems, onClose }) => {
  const [chitName, setChitName] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [duration, setDuration] = useState(20);
  const [targetCapacity, setTargetCapacity] = useState('Nil');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyDueDay, setMonthlyDueDay] = useState(10);
  const [gracePeriod, setGracePeriod] = useState(5);
  const [description, setDescription] = useState('');

  const totalChitValue = Number(monthlyContribution || 0) * Number(duration || 0);
  const endDate = calculateEndDate(startDate, duration);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chitName.trim()) {
      toast.error('Please enter a Chit Name');
      return;
    }

    try {
      const parsedCapacity = targetCapacity === 'Nil' || !targetCapacity ? duration : Number(targetCapacity);
      const created = addGroup({
        name: chitName,
        planType: 'STANDARD',
        distributionCategory,
        giftItems: distributionCategory === 'GIFT_PAYABLE' ? giftItems : [],
        monthlyContribution: Number(monthlyContribution),
        durationMonths: Number(duration),
        chitValue: totalChitValue,
        memberCount: parsedCapacity,
        targetCapacityDisplay: targetCapacity,
        startDate,
        collectionDueDate: Number(monthlyDueDay),
        gracePeriodDays: Number(gracePeriod),
        description: description || `Standard Chit Scheme under ${distributionCategory} allocation`,
        status: 'ACTIVE',
      });
      toast.success(`Standard Chit Plan "${created.name}" created successfully!`);
      onClose();
    } catch (err) {
      toast.error('Error creating plan: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          1. Chit Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Diwali Gold Savings Scheme 2026"
          value={chitName}
          onChange={(e) => setChitName(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            2. Monthly Contribution (INR) *
          </label>
          <input
            type="number"
            min="100"
            required
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            3. Duration (Months) *
          </label>
          <input
            type="number"
            min="2"
            max="120"
            required
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Total Chit Banner */}
      <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
            4. Total Chit Value (Monthly Cons × Duration):
          </span>
          <p className="text-base font-bold text-indigo-950 dark:text-white font-mono">
            ₹{totalChitValue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Scheduled End:</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
            {endDate}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            5. Target Capacity *
          </label>
          <input
            type="text"
            value={targetCapacity}
            onChange={(e) => setTargetCapacity(e.target.value)}
            placeholder='Default "Nil" or enter number (e.g. 20)'
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">Client can leave as "Nil" or specify subscriber ceiling.</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            6. Start Date *
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            7. Monthly Due Day (1 - 31) *
          </label>
          <input
            type="number"
            min="1"
            max="31"
            required
            value={monthlyDueDay}
            onChange={(e) => setMonthlyDueDay(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            8. Grace Period (Days) *
          </label>
          <input
            type="number"
            min="0"
            max="30"
            required
            value={gracePeriod}
            onChange={(e) => setGracePeriod(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          9. Description & Notes
        </label>
        <textarea
          rows="2"
          placeholder="Details on distribution, maturity payout, or circle notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white resize-none"
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
          <Check className="w-3.5 h-3.5" />
          <span>Create Standard Plan</span>
        </button>
      </div>
    </form>
  );
};

/**
 * 2. Monthly Different Chit Plan Form
 * Per user instructions:
 * - Removed 'Base Monthly' & Auto-Calculation completely!
 * - Start Month and Duration only.
 * - In Chit Calendar table: Month (auto display based on Start Month) | Monthly Contribution | Amt need to Pay.
 * - Editing one value DOES NOT calculate or overwrite any other amount.
 */
const MonthlyDifferentPlanForm = ({ addGroup, distributionCategory, giftItems, onClose }) => {
  const [chitName, setChitName] = useState('');
  const [startMonth, setStartMonth] = useState(new Date().toISOString().substring(0, 7)); // 'YYYY-MM'
  const [duration, setDuration] = useState(12);
  const [targetCapacity, setTargetCapacity] = useState(20);
  const [monthlyDueDay, setMonthlyDueDay] = useState(10);
  const [gracePeriod, setGracePeriod] = useState(5);
  const [distributionDate, setDistributionDate] = useState(15);

  // Dynamic Chit Calendar schedule based on Start Month and Duration without auto-overwrites
  const [calendarRows, setCalendarRows] = useState(() => {
    return generateCalendarSchedule(startMonth, duration);
  });

  function generateCalendarSchedule(stMonth, dur, existingRows = []) {
    const rows = [];
    const [yearStr, monthStr] = stMonth.split('-');
    let currYear = parseInt(yearStr, 10);
    let currMonth = parseInt(monthStr, 10);

    for (let i = 0; i < dur; i++) {
      const monthDisplay = `${currYear}-${String(currMonth).padStart(2, '0')}`;
      const existing = existingRows[i];

      rows.push({
        monthIndex: i + 1,
        monthName: monthDisplay,
        // Keep user entered values if existing, otherwise blank/zero for user to enter
        monthlyContribution: existing ? existing.monthlyContribution : '',
        amtNeedToPay: existing ? existing.amtNeedToPay : '',
      });

      currMonth++;
      if (currMonth > 12) {
        currMonth = 1;
        currYear++;
      }
    }
    return rows;
  }

  // Handle month or duration changes while preserving existing inputs where possible
  const handleStartMonthChange = (newStartMonth) => {
    setStartMonth(newStartMonth);
    setCalendarRows(generateCalendarSchedule(newStartMonth, duration, calendarRows));
  };

  const handleDurationChange = (newDur) => {
    setDuration(newDur);
    setCalendarRows(generateCalendarSchedule(startMonth, newDur, calendarRows));
  };

  // Pure independent update without any auto-calculation or overwrites
  const handleRowChange = (index, field, value) => {
    const updated = [...calendarRows];
    updated[index] = {
      ...updated[index],
      [field]: value === '' ? '' : Number(value),
    };
    setCalendarRows(updated);
  };

  const totalCalculatedPool = calendarRows.reduce(
    (sum, r) => sum + (Number(r.monthlyContribution) || 0),
    0
  ) * (Number(targetCapacity) || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chitName.trim()) {
      toast.error('Please enter a Chit Name');
      return;
    }

    try {
      const created = addGroup({
        name: chitName,
        planType: 'MONTHLY_DIFFERENT',
        distributionCategory,
        giftItems: distributionCategory === 'GIFT_PAYABLE' ? giftItems : [],
        chitValue: totalCalculatedPool || 500000,
        memberCount: Number(targetCapacity),
        durationMonths: Number(duration),
        startDate: `${startMonth}-01`,
        startMonth: startMonth,
        collectionDueDate: Number(monthlyDueDay),
        gracePeriodDays: Number(gracePeriod),
        distributionDate: Number(distributionDate),
        calendarSchedule: calendarRows.map((r) => ({
          ...r,
          monthlyContribution: Number(r.monthlyContribution) || 0,
          amtNeedToPay: Number(r.amtNeedToPay) || 0,
        })),
        description: `Monthly Different Plan under ${distributionCategory} allocation`,
        status: 'ACTIVE',
      });
      toast.success(`Monthly Variable Chit "${created.name}" created!`);
      onClose();
    } catch (err) {
      toast.error('Error creating plan: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
          1. Chit Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Coimbatore Textile Circle (Variable Schedule 2026-27)"
          value={chitName}
          onChange={(e) => setChitName(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            2. Start Month *
          </label>
          <input
            type="month"
            required
            value={startMonth}
            onChange={(e) => handleStartMonthChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            3. Duration (Months) *
          </label>
          <input
            type="number"
            min="2"
            max="60"
            required
            value={duration}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* 4. Chit Calendar (Month Auto Display | Monthly Contribution | Amt need to pay) */}
      <div className="border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#131929]">
        <div className="p-2.5 bg-purple-50/70 dark:bg-purple-950/40 border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center">
          <div>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>4. Chit Calendar Schedule</span>
            </span>
            <span className="text-[10px] text-slate-500 block">
              Auto generated from {startMonth}. Enter specific monthly contribution and payable amount independently:
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
            {calendarRows.length} Cycles
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase text-slate-500 font-mono sticky top-0">
              <tr>
                <th className="px-3 py-1.5">Month</th>
                <th className="px-3 py-1.5">Monthly Contribution (INR)</th>
                <th className="px-3 py-1.5">Amt Need To Pay (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9] dark:divide-[#1e283d] bg-white dark:bg-[#111625]">
              {calendarRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#182032]">
                  <td className="px-3 py-1 font-mono font-medium text-slate-800 dark:text-slate-200">
                    #{row.monthIndex} ({row.monthName})
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="number"
                      placeholder="Enter Cons"
                      value={row.monthlyContribution}
                      onChange={(e) => handleRowChange(idx, 'monthlyContribution', e.target.value)}
                      className="w-32 px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="number"
                      placeholder="Enter Payable"
                      value={row.amtNeedToPay}
                      onChange={(e) => handleRowChange(idx, 'amtNeedToPay', e.target.value)}
                      className="w-32 px-2 py-0.5 border border-indigo-200 dark:border-indigo-800 rounded bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono font-semibold"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            5. Target Capacity (Subscribers) *
          </label>
          <input
            type="number"
            min="2"
            max="100"
            required
            value={targetCapacity}
            onChange={(e) => setTargetCapacity(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            6. Monthly Due Day *
          </label>
          <input
            type="number"
            min="1"
            max="31"
            required
            value={monthlyDueDay}
            onChange={(e) => setMonthlyDueDay(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            7. Grace Period (Days) *
          </label>
          <input
            type="number"
            min="0"
            max="30"
            required
            value={gracePeriod}
            onChange={(e) => setGracePeriod(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            8. Amount Distribution Date *
          </label>
          <input
            type="number"
            min="1"
            max="31"
            required
            value={distributionDate}
            onChange={(e) => setDistributionDate(Number(e.target.value))}
            placeholder="Day of month (e.g. 15)"
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Day of every month when disbursement is distributed.
          </span>
        </div>
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
          className="px-4 py-1.5 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Create Variable Schedule Plan</span>
        </button>
      </div>
    </form>
  );
};
