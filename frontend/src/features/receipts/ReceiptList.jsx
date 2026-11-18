import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Download,
  Printer,
  Eye,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { receiptService } from '../../services/receipt.service';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV } from '../../utils/export';
import { toast } from 'sonner';

export const ReceiptList = () => {
  const [searchParams] = useSearchParams();
  const receipts = useAppStore((state) => state.receipts);
  const groups = useAppStore((state) => state.groups);
  const settings = useAppStore((state) => state.settings);

  const initialReceiptNumber = searchParams.get('receiptNumber') || '';

  const [searchQuery, setSearchQuery] = useState(initialReceiptNumber);
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [activeReceiptModal, setActiveReceiptModal] = useState(
    initialReceiptNumber ? receipts.find((r) => r.receiptNumber === initialReceiptNumber) : null
  );

  const filteredReceipts = receipts.filter((rcpt) => {
    if (groupFilter !== 'ALL' && rcpt.groupId !== groupFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNo = rcpt.receiptNumber?.toLowerCase().includes(q);
      const matchMem = rcpt.memberName?.toLowerCase().includes(q);
      const matchRef = rcpt.referenceNumber?.toLowerCase().includes(q);
      const matchId = rcpt.memberId?.toLowerCase().includes(q);
      if (!matchNo && !matchMem && !matchRef && !matchId) return false;
    }
    return true;
  });

  const handleDownloadPDF = (receipt, format = 'standard') => {
    receiptService.downloadReceiptPDF(receipt, settings, format);
    toast.success(`Receipt downloaded (${format.toUpperCase()}) for ${receipt.receiptNumber}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const data = filteredReceipts.map((r) => ({
      'Receipt Number': r.receiptNumber,
      'Date': r.paymentDate,
      'Member ID': r.memberId,
      'Member Name': r.memberName,
      'Chit Group': r.groupName,
      'Installment Month': `Month ${r.installmentNumber}`,
      'Amount Received (INR)': r.amountReceived,
      'Remaining Balance (INR)': r.remainingBalance,
      'Payment Method': r.paymentMethod,
      'Reference Number': r.referenceNumber,
      'Status': r.status,
    }));
    exportToCSV(data, `ChitFlow_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Payment Receipts
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredReceipts.length} Issued
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit trail of official computer-generated receipt vouchers and PDF statements.
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
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-3 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipt #, member name, ref..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-800 dark:text-white font-medium"
          >
            <option value="ALL">All Chit Circles</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-[#e2e4e9] dark:border-[#1e283d] font-mono text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Receipt #</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Member Details</th>
                <th className="px-4 py-2.5">Chit Circle</th>
                <th className="px-4 py-2.5">Installment</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Balance</th>
                <th className="px-4 py-2.5">Method & Ref</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
              {filteredReceipts.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {rcpt.receiptNumber}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(rcpt.paymentDate)}</td>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{rcpt.memberName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{rcpt.memberId}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{rcpt.groupName}</td>
                  <td className="px-4 py-2.5 font-medium">Month #{rcpt.installmentNumber}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">
                    {formatCurrency(rcpt.amountReceived)}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {formatCurrency(rcpt.remainingBalance)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-slate-700 dark:text-slate-300">{rcpt.paymentMethod}</span>
                    <span className="block font-mono text-[10px] text-slate-400">{rcpt.referenceNumber}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setActiveReceiptModal(rcpt)}
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Preview Official Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(rcpt)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official A4 Receipt Modal */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#111625] rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-[#e2e4e9] dark:border-[#1e283d] my-8 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2e4e9] dark:border-[#1e283d] no-print">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Official Receipt Voucher</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <div className="flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-0.5">
                  <button
                    onClick={() => handleDownloadPDF(activeReceiptModal, 'standard')}
                    className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded"
                    title="A5 Standard Voucher"
                  >
                    A5 PDF
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(activeReceiptModal, '3inch')}
                    className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded"
                    title="3 inch (80mm) Thermal POS Printer Slip"
                  >
                    3" Thermal
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(activeReceiptModal, '2inch')}
                    className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded"
                    title="2 inch (58mm) Thermal POS Printer Slip"
                  >
                    2" Thermal
                  </button>
                </div>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clean Modern A4 Document Style */}
            <div id="printable-receipt" className="mt-4 p-8 bg-white text-slate-900 rounded border border-slate-200 text-xs font-sans">
              <div className="flex justify-between items-start pb-5 border-b border-slate-200">
                <div>
                  <h1 className="text-xl font-bold text-indigo-700 tracking-tight">CHITFLOW</h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                    Official Payment Voucher
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                    {settings.companyName}<br />
                    {settings.address}, {settings.city}<br />
                    {settings.registrationNumber}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 rounded bg-indigo-50 border border-indigo-100">
                    <p className="text-[9px] text-indigo-600 font-semibold uppercase tracking-wider">Receipt Number</p>
                    <p className="text-sm font-mono font-bold text-indigo-950">{activeReceiptModal.receiptNumber}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    Date: <span className="font-semibold text-slate-800">{formatDate(activeReceiptModal.paymentDate)}</span>
                  </p>
                </div>
              </div>

              {/* Bill To & Chit Info */}
              <div className="grid grid-cols-2 gap-8 my-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Received From</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activeReceiptModal.memberName}</p>
                  <p className="text-slate-600 font-mono text-[11px] mt-0.5">Subscriber ID: {activeReceiptModal.memberId}</p>
                  <p className="text-slate-600 font-mono text-[11px]">Mobile: {activeReceiptModal.memberMobile || '-'}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chit Scheme Details</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{activeReceiptModal.groupName}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Installment: Month #{activeReceiptModal.installmentNumber}</p>
                  <p className="text-slate-600 font-mono text-[11px]">Method: {activeReceiptModal.paymentMethod} ({activeReceiptModal.referenceNumber})</p>
                </div>
              </div>

              {/* Breakdown Table */}
              <table className="w-full border border-slate-200 text-left my-5">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px] font-mono">
                  <tr>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Expected</th>
                    <th className="p-2 text-right">Previously Paid</th>
                    <th className="p-2 text-right">Amount Received</th>
                    <th className="p-2 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2 font-sans font-medium">
                      Installment #{activeReceiptModal.installmentNumber} Subscription
                    </td>
                    <td className="p-2 text-right font-medium">{formatCurrency(activeReceiptModal.expectedAmount)}</td>
                    <td className="p-2 text-right">{formatCurrency(activeReceiptModal.previousPaid || 0)}</td>
                    <td className="p-2 text-right font-bold text-indigo-700">
                      {formatCurrency(activeReceiptModal.amountReceived)}
                    </td>
                    <td className="p-2 text-right font-semibold text-rose-600">
                      {formatCurrency(activeReceiptModal.remainingBalance)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Status & Signatures */}
              <div className="flex justify-between items-end pt-5 border-t border-slate-200 mt-6">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    STATUS: {activeReceiptModal.remainingBalance === 0 ? 'FULLY SETTLED' : 'PARTIALLY PAID'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-2 italic">
                    Computer-generated statutory transaction receipt. No signature required.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-32 border-b border-slate-300 pb-6 text-slate-400 italic text-[10px]">
                    Authorized Officer
                  </div>
                  <p className="text-[9px] font-semibold text-slate-600 uppercase mt-1">For ChitFlow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
