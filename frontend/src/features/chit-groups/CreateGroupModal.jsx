import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { chitGroupSchema } from '../../utils/validators';
import { useAppStore } from '../../store/useAppStore';
import { calculateEndDate } from '../../utils/date';

export const CreateGroupModal = ({ isOpen, onClose }) => {
  const addGroup = useAppStore((state) => state.addGroup);
  const [selectedPlanType, setSelectedPlanType] = useState('STANDARD'); // 'STANDARD' | 'MONTHLY_DIFFERENT'

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
              Select scheme architecture: Standard Fixed Plan or Variable Auction Circle
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mt-4">
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
                  <Gift className="w-3.5 h-3.5" />
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
              Fixed monthly contribution. Ideal for traditional savings with <span className="font-semibold text-indigo-600">Gifts & Payables</span> module.
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
              Variable monthly dues schedule with full <span className="font-semibold text-purple-600">Auction & Payouts</span> dividend calendar.
            </p>
          </button>
        </div>

        {/* Form Body Based on Plan Type */}
        {selectedPlanType === 'STANDARD' ? (
          <StandardPlanForm addGroup={addGroup} onClose={onClose} />
        ) : (
          <MonthlyDifferentPlanForm addGroup={addGroup} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

/**
 * 1. Standard Chit Plan Form
 * Fields:
 * 1. Chit Name
 * 2. Monthly Contribution
 * 3. Duration
 * 4. Total Chit: (Monthly Cons * Duration)
 * 5. Target Capacity: Default "Nil" (or numeric input)
 * 6. Start Date
 * 7. Monthly Due Day
 * 8. Grace Period
 * 9. Desc
 */
const StandardPlanForm = ({ addGroup, onClose }) => {
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
        monthlyContribution: Number(monthlyContribution),
        durationMonths: Number(duration),
        chitValue: totalChitValue,
        memberCount: parsedCapacity,
        targetCapacityDisplay: targetCapacity,
        startDate,
        collectionDueDate: Number(monthlyDueDay),
        gracePeriodDays: Number(gracePeriod),
        description: description || 'Standard Chit Scheme with Gifts & Payables allocation',
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

      {/* Auto Calculated Total Chit Banner */}
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
          placeholder="Details on gold coin, festival gift, or maturity payout vouchers..."
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
          <Gift className="w-3.5 h-3.5" />
          <span>Create Standard Plan</span>
        </button>
      </div>
    </form>
  );
};

/**
 * 2. Monthly Different Chit Plan Form
 * Fields:
 * 1. Chit Name
 * 2. Start Month (e.g. 2026-11)
 * 3. Duration
 * 4. Chit Calendar (Month auto display based on Start Month | Monthly Contribution | Amt need to Pay)
 * 5. Target Capacity
 * 6. Monthly Due
 * 7. Grace Period
 * 8. Amt Distribution Date
 */
const MonthlyDifferentPlanForm = ({ addGroup, onClose }) => {
  const [chitName, setChitName] = useState('');
  const [startMonth, setStartMonth] = useState(new Date().toISOString().substring(0, 7)); // 'YYYY-MM'
  const [duration, setDuration] = useState(12);
  const [baseContribution, setBaseContribution] = useState(25000);
  const [targetCapacity, setTargetCapacity] = useState(20);
  const [monthlyDueDay, setMonthlyDueDay] = useState(10);
  const [gracePeriod, setGracePeriod] = useState(5);
  const [distributionDate, setDistributionDate] = useState(15); // Date of the month when prize pool is distributed

  // Build dynamic Chit Calendar schedule based on Start Month and Duration
  const [calendarRows, setCalendarRows] = useState(() => {
    return generateCalendarSchedule(startMonth, duration, baseContribution);
  });

  // Re-generate or update rows when startMonth or duration or baseContribution changes
  const handleRegenerateCalendar = (newStartMonth, newDuration, newBase) => {
    setCalendarRows(generateCalendarSchedule(newStartMonth, newDuration, newBase));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...calendarRows];
    updated[index][field] = Number(value);
    setCalendarRows(updated);
  };

  function generateCalendarSchedule(stMonth, dur, base) {
    const rows = [];
    const [yearStr, monthStr] = stMonth.split('-');
    let currYear = parseInt(yearStr, 10);
    let currMonth = parseInt(monthStr, 10); // 1-12

    for (let i = 0; i < dur; i++) {
      const monthDisplay = `${currYear}-${String(currMonth).padStart(2, '0')}`;
      // In auction chits, early months usually have higher dividends, so Amt Need to Pay is lower
      // Month 1 has no auction dividend (full amount), then progressive
      const estimatedDividend = i === 0 ? 0 : Math.round(base * 0.15);
      const amtNeedToPay = Math.max(0, base - estimatedDividend);

      rows.push({
        monthIndex: i + 1,
        monthName: monthDisplay,
        monthlyContribution: base,
        amtNeedToPay: amtNeedToPay,
      });

      currMonth++;
      if (currMonth > 12) {
        currMonth = 1;
        currYear++;
      }
    }
    return rows;
  }

  const totalGrossChit = calendarRows.reduce((sum, r) => sum + Number(r.monthlyContribution || 0), 0) * (Number(targetCapacity) || 1);

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
        chitValue: totalGrossChit || Number(baseContribution) * Number(duration) * Number(targetCapacity),
        memberCount: Number(targetCapacity),
        durationMonths: Number(duration),
        startDate: `${startMonth}-01`,
        startMonth: startMonth,
        collectionDueDate: Number(monthlyDueDay),
        gracePeriodDays: Number(gracePeriod),
        distributionDate: Number(distributionDate),
        calendarSchedule: calendarRows,
        description: 'Monthly Different Variable Auction Plan with Scheduled Calendar',
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
          placeholder="e.g. Coimbatore Textile Circle (Auction 2026-27)"
          value={chitName}
          onChange={(e) => setChitName(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            2. Start Month *
          </label>
          <input
            type="month"
            required
            value={startMonth}
            onChange={(e) => {
              setStartMonth(e.target.value);
              handleRegenerateCalendar(e.target.value, duration, baseContribution);
            }}
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
            onChange={(e) => {
              const d = Number(e.target.value);
              setDuration(d);
              handleRegenerateCalendar(startMonth, d, baseContribution);
            }}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Base Monthly (INR) *
          </label>
          <input
            type="number"
            min="1000"
            required
            value={baseContribution}
            onChange={(e) => {
              const b = Number(e.target.value);
              setBaseContribution(b);
              handleRegenerateCalendar(startMonth, duration, b);
            }}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      {/* 4. Chit Calendar (Month Auto Display | Monthly Contribution | Amt need to pay) */}
      <div className="border border-[#e2e4e9] dark:border-[#1e283d] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#131929]">
        <div className="p-2.5 bg-purple-50/70 dark:bg-purple-950/40 border-b border-[#e2e4e9] dark:border-[#1e283d] flex justify-between items-center">
          <div>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>4. Chit Calendar (Schedule & Variable Pay)</span>
            </span>
            <span className="text-[10px] text-slate-500 block">
              Auto generated from {startMonth}. Edit custom installment rates below if needed:
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
            {calendarRows.length} Cycles
          </span>
        </div>

        <div className="max-h-40 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase text-slate-500 font-mono sticky top-0">
              <tr>
                <th className="px-3 py-1.5">Month</th>
                <th className="px-3 py-1.5">Monthly Contribution</th>
                <th className="px-3 py-1.5">Amt Need To Pay (Post-Dividend)</th>
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
                      value={row.monthlyContribution}
                      onChange={(e) => handleRowChange(idx, 'monthlyContribution', e.target.value)}
                      className="w-28 px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 font-mono"
                    />
                  </td>
                  <td className="px-3 py-1">
                    <input
                      type="number"
                      value={row.amtNeedToPay}
                      onChange={(e) => handleRowChange(idx, 'amtNeedToPay', e.target.value)}
                      className="w-28 px-2 py-0.5 border border-indigo-200 dark:border-indigo-800 rounded bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono font-semibold"
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
            Day of every month when auction winner receives disbursement.
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
          <span>Create Variable Auction Plan</span>
        </button>
      </div>
    </form>
  );
};
