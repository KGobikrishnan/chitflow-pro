import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Download,
  Phone,
  MapPin,
  Eye,
  Trash2,
  Filter,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { exportToCSV } from '../../utils/export';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AddMemberModal } from './AddMemberModal';
import { toast } from 'sonner';

export const MemberList = () => {
  const navigate = useNavigate();
  const members = useAppStore((state) => state.members);
  const groups = useAppStore((state) => state.groups);
  const installments = useAppStore((state) => state.installments);
  const deleteMember = useAppStore((state) => state.deleteMember);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  // Compute aggregated financials per member
  const tableData = members
    .filter((m) => {
      if (selectedGroupFilter === 'ALL') return true;
      return m.assignedGroupIds?.includes(selectedGroupFilter);
    })
    .map((member) => {
      const memberInst = installments.filter((ins) => ins.memberId === member.id);
      const totalPaid = memberInst.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
      const totalPending = memberInst.reduce((sum, ins) => sum + (ins.remainingAmount || 0), 0);

      const nextDueInst = memberInst
        .filter((ins) => ins.remainingAmount > 0)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

      return {
        ...member,
        totalPaid,
        totalPending,
        nextDueDate: nextDueInst ? nextDueInst.dueDate : null,
      };
    });

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500 font-semibold">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Subscriber Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
            {row.original.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {row.original.fullName}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> {row.original.city}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'mobileNumber',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium font-mono flex items-center gap-1">
          <Phone className="w-3 h-3 text-slate-400" />
          {row.original.mobileNumber}
        </div>
      ),
    },
    {
      id: 'groups',
      header: 'Assigned Circles',
      cell: ({ row }) => {
        const assigned = row.original.assignedGroupIds || [];
        return (
          <div className="flex flex-wrap gap-1">
            {assigned.map((gid) => {
              const grp = groups.find((g) => g.id === gid);
              return (
                <span
                  key={gid}
                  className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {grp ? grp.name : gid}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalPaid',
      header: 'Total Paid',
      cell: ({ row }) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          {formatCurrency(row.original.totalPaid)}
        </span>
      ),
    },
    {
      accessorKey: 'totalPending',
      header: 'Pending Balance',
      cell: ({ row }) => (
        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
          {formatCurrency(row.original.totalPending)}
        </span>
      ),
    },
    {
      accessorKey: 'nextDueDate',
      header: 'Next Due',
      cell: ({ row }) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.original.nextDueDate ? formatDate(row.original.nextDueDate) : 'Clear'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => navigate(`/members/${row.original.id}`)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Open Member Ledger"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMemberToDelete(row.original)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Delete Member"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const handleExport = () => {
    const exportData = tableData.map((m) => ({
      'Member ID': m.id,
      'Full Name': m.fullName,
      'Mobile Number': m.mobileNumber,
      'Email': m.email || '',
      'City': m.city,
      'Total Paid': m.totalPaid,
      'Total Pending': m.totalPending,
      'Next Due Date': m.nextDueDate || 'None',
      'Status': m.status,
    }));
    exportToCSV(exportData, `ChitFlow_Members_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      toast.success(`Member ${memberToDelete.fullName} removed.`);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Member Directory
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {members.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit member KYC records, nominee nomination, and subscription payment ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Filter by subscriber name, ID, phone, city..."
        filterComponent={
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-[#182032] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Chit Circles</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <AddMemberModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <ConfirmDialog
        isOpen={!!memberToDelete}
        title="Remove Member"
        message={`Remove ${memberToDelete?.fullName} from directory? Associated historical transactions and receipts will be updated.`}
        confirmText="Confirm Removal"
        isDestructive={true}
        onConfirm={confirmDeleteMember}
        onClose={() => setMemberToDelete(null)}
      />
    </div>
  );
};
