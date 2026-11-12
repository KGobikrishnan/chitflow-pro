import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, IndianRupee, Users } from 'lucide-react';
import { toast } from 'sonner';
import { chitGroupSchema } from '../../utils/validators';
import { useAppStore } from '../../store/useAppStore';
import { calculateEndDate } from '../../utils/date';

export const CreateGroupModal = ({ isOpen, onClose }) => {
  const addGroup = useAppStore((state) => state.addGroup);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(chitGroupSchema),
    defaultValues: {
      name: '',
      chitValue: 500000,
      memberCount: 20,
      durationMonths: 20,
      startDate: new Date().toISOString().split('T')[0],
      collectionDueDate: 10,
      gracePeriodDays: 5,
      frequency: 'MONTHLY',
      description: '',
      status: 'ACTIVE',
    },
  });

  const chitVal = watch('chitValue') || 0;
  const durMonths = watch('durationMonths') || 1;
  const startDt = watch('startDate');
  const calculatedMonthly = durMonths > 0 ? Math.round(chitVal / durMonths) : 0;
  const calculatedEndDate = calculateEndDate(startDt, durMonths);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    try {
      const created = addGroup(data);
      toast.success(`Chit Group "${created.name}" established successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to create group: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-lg max-w-xl w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Chit Group
            </h3>
            <p className="text-xs text-slate-500">
              Configure group tenure, installment run-rate, and statutory rules
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chit Group Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Coimbatore Traders Circle 2027"
              {...register('name')}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
            {errors.name && <p className="text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Chit Pool Value (INR) *
              </label>
              <input
                type="number"
                {...register('chitValue')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
              />
              {errors.chitValue && <p className="text-rose-500 mt-1">{errors.chitValue.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (Months) *
              </label>
              <input
                type="number"
                {...register('durationMonths')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
              {errors.durationMonths && <p className="text-rose-500 mt-1">{errors.durationMonths.message}</p>}
            </div>
          </div>

          {/* Auto Calculation Preview Banner */}
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-md border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Monthly Contribution Target:</span>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">
                ₹{calculatedMonthly.toLocaleString('en-IN')} / subscriber
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400">Scheduled End Date:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                {calculatedEndDate || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Capacity (Subscribers) *
              </label>
              <input
                type="number"
                {...register('memberCount')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
              {errors.memberCount && <p className="text-rose-500 mt-1">{errors.memberCount.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
              {errors.startDate && <p className="text-rose-500 mt-1">{errors.startDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Due Day (1-31)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                {...register('collectionDueDate')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grace Period (Days)
              </label>
              <input
                type="number"
                min="0"
                {...register('gracePeriodDays')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows="2"
              placeholder="Background, target subscriber segment, or specific auction terms..."
              {...register('description')}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
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
              {isSubmitting ? 'Establishing...' : 'Establish Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
