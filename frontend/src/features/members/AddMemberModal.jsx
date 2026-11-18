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
      toast.success(`Subscriber "${created.fullName}" onboarded successfully!`);
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to add member: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111625] rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Enroll New Chit Subscriber
            </h3>
            <p className="text-xs text-slate-500">
              KYC credentials, nominee designation, and circle assignment
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
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
                placeholder="e.g. Balasubramaniam K"
                {...register('fullName')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
              {errors.fullName && <p className="text-rose-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Indian Mobile Number (10 digits) *
              </label>
              <input
                type="text"
                placeholder="e.g. 9842100001"
                {...register('mobileNumber')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
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
                placeholder="e.g. bala@example.com"
                {...register('email')}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
              placeholder="e.g. 14, Kumaran Road, Tirupur"
              {...register('address')}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
            />
            {errors.address && <p className="text-rose-500 mt-1">{errors.address.message}</p>}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#182032] rounded-md border border-[#e2e4e9] dark:border-[#1e283d]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">
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
          <div className="border-t border-[#e2e4e9] dark:border-[#1e283d] pt-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Statutory Nominee Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominee Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Radha B"
                  {...register('nomineeName')}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                />
                {errors.nomineeName && (
                  <p className="text-rose-500 mt-1">{errors.nomineeName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship *
                </label>
                <select
                  {...register('nomineeRelationship')}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
                >
                  <option value="Spouse">Spouse (மனைவி / கணவர்)</option>
                  <option value="Father">Father (தந்தை)</option>
                  <option value="Mother">Mother (தாய்)</option>
                  <option value="Son">Son (மகன்)</option>
                  <option value="Daughter">Daughter (மகள்)</option>
                  <option value="Brother">Brother (சகோதரன்)</option>
                  <option value="Sister">Sister (சகோதரி)</option>
                  <option value="Business Partner">Business Partner</option>
                  <option value="Other Legal Heir">Other Legal Heir</option>
                </select>
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
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
                />
                {errors.nomineeMobile && (
                  <p className="text-rose-500 mt-1">{errors.nomineeMobile.message}</p>
                )}
              </div>
            </div>
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
              {isSubmitting ? 'Onboarding...' : 'Onboard Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
