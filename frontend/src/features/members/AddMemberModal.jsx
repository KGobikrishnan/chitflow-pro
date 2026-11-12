import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { memberSchema } from '../../utils/validators';
import { useAppStore } from '../../store/useAppStore';

export const AddMemberModal = ({ isOpen, onClose }) => {
  const groups = useAppStore((state) => state.groups);
  const addMember = useAppStore((state) => state.addMember);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      address: '',
      city: 'Coimbatore',
      joiningDate: new Date().toISOString().split('T')[0],
      assignedGroupIds: [],
      nomineeName: '',
      nomineeRelationship: 'Spouse',
      nomineeMobile: '',
      notes: '',
      status: 'ACTIVE',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    try {
      const created = addMember(data);
      toast.success(`Member "${created.fullName}" onboarded successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to add member: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Enroll New Member
            </h3>
            <p className="text-xs text-slate-500">
              Register personal details, nominee nomination, and group assignments
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                {...register('fullName')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.fullName && <p className="text-rose-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (10 digits) *
              </label>
              <input
                type="text"
                placeholder="e.g. 9842100001"
                {...register('mobileNumber')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.mobileNumber && (
                <p className="text-rose-500 mt-1">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                {...register('email')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.email && <p className="text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Town *
              </label>
              <input
                type="text"
                placeholder="e.g. Coimbatore"
                {...register('city')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              {errors.city && <p className="text-rose-500 mt-1">{errors.city.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential / Business Address *
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 42, Cross Cut Road, Gandhipuram"
              {...register('address')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            {errors.address && <p className="text-rose-500 mt-1">{errors.address.message}</p>}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Assign to Chit Circle (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={group.id}
                    {...register('assignedGroupIds')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{group.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nominee details */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Nominee Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominee Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Ramesh"
                  {...register('nomineeName')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.nomineeName && (
                  <p className="text-rose-500 mt-1">{errors.nomineeName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Mother"
                  {...register('nomineeRelationship')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.nomineeRelationship && (
                  <p className="text-rose-500 mt-1">{errors.nomineeRelationship.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominee Mobile *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9842100099"
                  {...register('nomineeMobile')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.nomineeMobile && (
                  <p className="text-rose-500 mt-1">{errors.nomineeMobile.message}</p>
                )}
              </div>
            </div>
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
              {isSubmitting ? 'Onboarding...' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

