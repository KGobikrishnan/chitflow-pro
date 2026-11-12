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
      toast.success(`Chit Group "${created.name}" created successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to create group: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Chit Group
            </h3>
            <p className="text-xs text-slate-500">
              Establish a new chit fund circle with auto-calculated installment values
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chit Group Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Pongal Prosperity Chit 2027"
              {...register('name')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            {errors.name && <p className="text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Chit Value (INR) *
              </label>
              <input
                type="number"
                {...register('chitValue')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.durationMonths && <p className="text-rose-500 mt-1">{errors.durationMonths.message}</p>}
            </div>
          </div>

          {/* Auto Calculation Preview Banner */}
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Calculated Monthly Target:</span>
              <p className="text-base font-bold text-indigo-700 dark:text-indigo-400">
                ₹{calculatedMonthly.toLocaleString('en-IN')} / member
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400">Estimated End Date:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {calculatedEndDate || 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Member Count *
              </label>
              <input
                type="number"
                {...register('memberCount')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.startDate && <p className="text-rose-500 mt-1">{errors.startDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Due Day (Day of Month)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                {...register('collectionDueDate')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.collectionDueDate && <p className="text-rose-500 mt-1">{errors.collectionDueDate.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grace Period (Days)
              </label>
              <input
                type="number"
                min="0"
                {...register('gracePeriodDays')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.gracePeriodDays && <p className="text-rose-500 mt-1">{errors.gracePeriodDays.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows="2"
              placeholder="Provide background, target demographic, or specific auction terms..."
              {...register('description')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
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
              {isSubmitting ? 'Creating...' : 'Establish Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

