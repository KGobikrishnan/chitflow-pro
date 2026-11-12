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
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { exportToCSV } from '../../utils/export';
import { PageHeader } from '../../components/common/PageHeader';
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

      // Find next due
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
      header: 'Member ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500 font-semibold">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Member Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
            {row.original.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {row.original.fullName}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {row.original.city}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'mobileNumber',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
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
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
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
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.original.totalPaid)}
        </span>
      ),
    },
    {
      accessorKey: 'totalPending',
      header: 'Total Pending',
      cell: ({ row }) => (
        <span className="font-bold text-amber-600 dark:text-amber-400">
          {formatCurrency(row.original.totalPending)}
        </span>
      ),
    },
    {
      accessorKey: 'nextDueDate',
      header: 'Next Due',
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
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
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/members/${row.original.id}`)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md"
            title="View Member Ledger"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMemberToDelete(row.original)}
            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md"
            title="Delete Member"
          >
            <Trash2 className="w-4 h-4" />
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
      <PageHeader
        title="Member Management"
        subtitle="Maintain KYC profiles, assigned chit subscriptions, and complete payment ledgers"
        breadcrumbs={['ChitFlow', 'Members']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Search member name, ID, phone or city..."
        filterComponent={
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="ALL">All Chit Groups</option>
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
        title="Delete Member"
        message={`Are you sure you want to delete ${memberToDelete?.fullName}? All associated membership records will be permanently removed.`}
        confirmText="Yes, Delete Member"
        isDestructive={true}
        onConfirm={confirmDeleteMember}
        onClose={() => setMemberToDelete(null)}
      />
    </div>
  );
};

