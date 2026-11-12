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
import { PageHeader } from '../../components/common/PageHeader';
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

  const handleDownloadPDF = (receipt) => {
    receiptService.downloadReceiptPDF(receipt, settings);
    toast.success(`PDF downloaded for receipt ${receipt.receiptNumber}`);
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
      <PageHeader
        title="Receipt Management"
        subtitle="Search, verify, download PDF and print official stamped transaction vouchers"
        breadcrumbs={['ChitFlow', 'Receipts']}
        action={
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Receipts CSV</span>
          </button>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipt #, member, or ref ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-white"
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

      {/* Receipts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Receipt Number</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Member Details</th>
                <th className="px-4 py-3">Chit Group</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Amount Received</th>
                <th className="px-4 py-3">Remaining Balance</th>
                <th className="px-4 py-3">Method & Reference</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReceipts.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {rcpt.receiptNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(rcpt.paymentDate)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{rcpt.memberName}</div>
                    <div className="text-[11px] text-slate-400">{rcpt.memberId}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{rcpt.groupName}</td>
                  <td className="px-4 py-3 font-medium">Month #{rcpt.installmentNumber}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {formatCurrency(rcpt.amountReceived)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(rcpt.remainingBalance)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{rcpt.paymentMethod}</span>
                    <span className="block font-mono text-[11px] text-slate-400">{rcpt.referenceNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setActiveReceiptModal(rcpt)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md"
                        title="Preview Official Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(rcpt)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Official Receipt Preview</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleDownloadPDF(activeReceiptModal)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div id="printable-receipt" className="mt-4 p-8 bg-white text-slate-900 rounded-lg border border-slate-200 text-xs font-sans">
              <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-black text-indigo-700 tracking-tight">CHITFLOW</h1>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                    Official Payment Receipt
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2 max-w-xs leading-relaxed">
                    {settings.companyName}<br />
                    {settings.address}, {settings.city}<br />
                    {settings.registrationNumber}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 rounded bg-indigo-50 border border-indigo-100">
                    <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Receipt No</p>
                    <p className="text-base font-mono font-bold text-indigo-900">{activeReceiptModal.receiptNumber}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Date: <span className="font-semibold text-slate-800">{formatDate(activeReceiptModal.paymentDate)}</span>
                  </p>
                </div>
              </div>

              {/* Bill To & Chit Info */}
              <div className="grid grid-cols-2 gap-8 my-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Received From</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{activeReceiptModal.memberName}</p>
                  <p className="text-slate-600 mt-0.5">Member ID: {activeReceiptModal.memberId}</p>
                  <p className="text-slate-600">Mobile: {activeReceiptModal.memberMobile || '-'}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chit Scheme Details</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{activeReceiptModal.groupName}</p>
                  <p className="text-slate-600 mt-0.5">Installment Cycle: Month #{activeReceiptModal.installmentNumber}</p>
                  <p className="text-slate-600">Method: {activeReceiptModal.paymentMethod} ({activeReceiptModal.referenceNumber})</p>
                </div>
              </div>

              {/* Breakdown Table */}
              <table className="w-full border border-slate-200 text-left my-6">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Expected</th>
                    <th className="p-2.5 text-right">Previously Paid</th>
                    <th className="p-2.5 text-right">Amount Received</th>
                    <th className="p-2.5 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-medium">
                      Installment #{activeReceiptModal.installmentNumber} Contribution
                    </td>
                    <td className="p-2.5 text-right font-medium">{formatCurrency(activeReceiptModal.expectedAmount)}</td>
                    <td className="p-2.5 text-right">{formatCurrency(activeReceiptModal.previousPaid || 0)}</td>
                    <td className="p-2.5 text-right font-bold text-indigo-700">
                      {formatCurrency(activeReceiptModal.amountReceived)}
                    </td>
                    <td className="p-2.5 text-right font-semibold text-rose-600">
                      {formatCurrency(activeReceiptModal.remainingBalance)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Status & Signatures */}
              <div className="flex justify-between items-end pt-6 border-t border-slate-200 mt-8">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    STATUS: {activeReceiptModal.remainingBalance === 0 ? 'FULLY PAID' : 'PARTIALLY PAID'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-3 italic">
                    Thank you for your timely payment. Computer-generated voucher.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-36 border-b border-slate-300 pb-8 text-slate-400 italic text-[11px]">
                    Authorized Cashier
                  </div>
                  <p className="text-[10px] font-semibold text-slate-600 uppercase mt-1">For ChitFlow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

