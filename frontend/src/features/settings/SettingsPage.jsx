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
    toast.success('Company & compliance settings saved successfully!');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage company details, statutory compliance headers, UI theme, and demo state backup.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Statutory Business Profile</span>
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City & Pincode
              </label>
              <input
                type="text"
                name="city"
                value={formSettings.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white font-mono"
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
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Currency
              </label>
              <input
                type="text"
                disabled
                value="INR (₹) - Indian Rupee"
                className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-[#e2e4e9] dark:border-[#1e283d]">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span>Interface Appearance Theme</span>
        </h3>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-md border text-left transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 dark:text-white font-bold'
                : 'border-[#e2e4e9] dark:border-[#1e283d] hover:bg-slate-50'
            }`}
          >
            <div className="font-semibold text-xs">Light Appearance</div>
            <div className="text-[11px] text-slate-500">Soft neutral white for daytime operations</div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-md border text-left transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-950/40 text-indigo-300 font-bold'
                : 'border-[#e2e4e9] dark:border-[#1e283d] hover:bg-slate-800'
            }`}
          >
            <div className="font-semibold text-xs">Dark Appearance</div>
            <div className="text-[11px] text-slate-400">Deep obsidian charcoal contrast</div>
          </button>
        </div>
      </div>

      {/* LocalStorage Data Controls */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>State Backup & Data Management</span>
        </h3>
        <p className="text-slate-500 mb-3 text-xs">
          Export application memory state, import custom JSON backups, or restore the default seed dataset.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportBackupJSON}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Backup JSON</span>
          </button>

          <label className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 rounded-md flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Demo Data"
        message="Reset all data back to the default seed state? Any payments recorded in this session will be restored."
        confirmText="Confirm Reset"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
