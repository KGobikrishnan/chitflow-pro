import React, { useState } from 'react';
import {
  Building2,
  User,
  Palette,
  Database,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { PageHeader } from '../../components/common/PageHeader';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const SettingsPage = () => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const resetDemoData = useAppStore((state) => state.resetDemoData);
  const importData = useAppStore((state) => state.importData);

  const [formSettings, setFormSettings] = useState(settings);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    updateSettings(formSettings);
    toast.success('Company & Admin settings updated successfully!');
  };

  const handleExportBackupJSON = () => {
    const storeState = useAppStore.getState();
    const backup = {
      groups: storeState.groups,
      members: storeState.members,
      installments: storeState.installments,
      transactions: storeState.transactions,
      receipts: storeState.receipts,
      payouts: storeState.payouts,
      settings: storeState.settings,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ChitFlow_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('System state backup JSON downloaded.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const res = importData(parsed);
        if (res.success) {
          toast.success('State imported successfully from backup JSON!');
        } else {
          toast.error('Failed to import: ' + res.error);
        }
      } catch (err) {
        toast.error('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    toast.success('Application demo data reset to default seed state.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Configure company details, statutory compliance headers, appearance, and local storage data"
        breadcrumbs={['ChitFlow', 'Settings']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Organization & Legal Profile</span>
        </h3>

        <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formSettings.companyName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration / CIN Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formSettings.registrationNumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Office Address
              </label>
              <input
                type="text"
                name="address"
                value={formSettings.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City, State & Pincode
              </label>
              <input
                type="text"
                name="city"
                value={formSettings.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formSettings.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formSettings.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <input
                type="text"
                disabled
                value="INR (₹) - Indian Rupee"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span>Appearance & Color Scheme</span>
        </h3>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-left transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-semibold">Light Theme</div>
            <div className="text-[11px] text-slate-500">Clean slate daylight styling</div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-950/40 text-indigo-300 font-bold'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div className="font-semibold">Dark Theme</div>
            <div className="text-[11px] text-slate-400">Deep obsidian nighttime contrast</div>
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Local Storage Demo State Management</span>
        </h3>
        <p className="text-slate-500 mb-4">
          Export application memory state, import custom JSON batches, or restore the default seed dataset.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackupJSON}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Data</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Demo Data"
        message="Are you sure you want to reset all data back to the default seed state? Any payments recorded in this session will be overwritten."
        confirmText="Yes, Reset State"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};

