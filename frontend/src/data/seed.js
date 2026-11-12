/**
 * Realistic Indian Demo Data for ChitFlow
 * 3 Chit Groups, 25 Members, Realistic Installment Schedules,
 * 50+ Payment Transactions, Receipts, Payouts, Notifications, and Settings
 */

export const initialGroups = [
  {
    id: 'GRP-2026-001',
    name: 'Diwali Special Chit 2026',
    chitValue: 500000,
    memberCount: 25,
    durationMonths: 25,
    monthlyInstallment: 20000,
    startDate: '2026-01-10',
    endDate: '2028-01-10',
    collectionDueDate: 10,
    gracePeriodDays: 5,
    frequency: 'MONTHLY',
    description: 'Flagship festival festive savings chit for premium business owners in Coimbatore & Tirupur.',
    status: 'ACTIVE',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'GRP-2026-002',
    name: 'Monthly Savings Chit',
    chitValue: 200000,
    memberCount: 20,
    durationMonths: 20,
    monthlyInstallment: 10000,
    startDate: '2026-03-05',
    endDate: '2027-10-05',
    collectionDueDate: 5,
    gracePeriodDays: 3,
    frequency: 'MONTHLY',
    description: 'Ideal monthly systematic wealth accumulation circle for salaried professionals & traders.',
    status: 'ACTIVE',
    createdAt: '2026-02-15T11:30:00.000Z',
  },
  {
    id: 'GRP-2026-003',
    name: 'Premium Business Chit',
    chitValue: 1000000,
    memberCount: 20,
    durationMonths: 20,
    monthlyInstallment: 50000,
    startDate: '2026-06-15',
    endDate: '2028-01-15',
    collectionDueDate: 15,
    gracePeriodDays: 5,
    frequency: 'MONTHLY',
    description: 'High net-worth commercial trade chit fund for equipment financing and bulk raw material purchase.',
    status: 'ACTIVE',
    createdAt: '2026-05-20T09:00:00.000Z',
  },
];

export const initialMembers = [
  {
    id: 'MEM-0001',
    fullName: 'Rajesh Kumar',
    mobileNumber: '9842100001',
    email: 'rajesh.kumar@chitflow.demo',
    address: '42, Cross Cut Road, Gandhipuram',
    city: 'Coimbatore',
    joiningDate: '2026-01-02',
    assignedGroupIds: ['GRP-2026-001', 'GRP-2026-003'],
    nomineeName: 'Priya Rajesh',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100091',
    notes: 'Textile mill owner, exemplary credit history.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0002',
    fullName: 'Senthil Nathan',
    mobileNumber: '9842100002',
    email: 'senthil.n@chitflow.demo',
    address: '15, Kumaran Road',
    city: 'Tirupur',
    joiningDate: '2026-01-03',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Kavitha Senthil',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100092',
    notes: 'Garment export partner.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0003',
    fullName: 'Anand Sundaram',
    mobileNumber: '9842100003',
    email: 'anand.s@chitflow.demo',
    address: '88, DB Road, RS Puram',
    city: 'Coimbatore',
    joiningDate: '2026-01-03',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Deepa Sundaram',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100093',
    notes: 'Automotive dealership manager.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0004',
    fullName: 'Karthik Subramanian',
    mobileNumber: '9842100004',
    email: 'karthik.sub@chitflow.demo',
    address: '12B, West Masi Street',
    city: 'Madurai',
    joiningDate: '2026-01-04',
    assignedGroupIds: ['GRP-2026-001', 'GRP-2026-002'],
    nomineeName: 'Meenakshi K',
    nomineeRelationship: 'Mother',
    nomineeMobile: '9842100094',
    notes: 'Electronics wholesale supplier.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0005',
    fullName: 'Venkatesh Prasad',
    mobileNumber: '9842100005',
    email: 'venkat.prasad@chitflow.demo',
    address: '304, Trichy Road, Singanallur',
    city: 'Coimbatore',
    joiningDate: '2026-01-04',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Lakshmi Venkatesh',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100095',
    notes: 'Chartered Accountant.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0006',
    fullName: 'Manoj Krishnan',
    mobileNumber: '9842100006',
    email: 'manoj.k@chitflow.demo',
    address: '5/18, Palace Road',
    city: 'Salem',
    joiningDate: '2026-01-05',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Geetha M',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100096',
    notes: 'Steel hardware distributor.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0007',
    fullName: 'Dinesh Balaji',
    mobileNumber: '9842100007',
    email: 'dinesh.b@chitflow.demo',
    address: '77, Avinashi Road, Peelamedu',
    city: 'Coimbatore',
    joiningDate: '2026-01-05',
    assignedGroupIds: ['GRP-2026-001', 'GRP-2026-003'],
    nomineeName: 'Saranya Dinesh',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100097',
    notes: 'IT Solutions provider.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0008',
    fullName: 'Murugan Palanisamy',
    mobileNumber: '9842100008',
    email: 'murugan.p@chitflow.demo',
    address: '22, Brough Road',
    city: 'Erode',
    joiningDate: '2026-01-06',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Chitra Murugan',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100098',
    notes: 'Agro products and turmeric merchant.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0009',
    fullName: 'Ganesh Moorthy',
    mobileNumber: '9842100009',
    email: 'ganesh.m@chitflow.demo',
    address: '9, Thillai Nagar 4th Cross',
    city: 'Trichy',
    joiningDate: '2026-01-06',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Revathi Ganesh',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100099',
    notes: 'Hospital pharmacy director.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0010',
    fullName: 'Arunachalam Chettiar',
    mobileNumber: '9842100010',
    email: 'arun.chettiar@chitflow.demo',
    address: '101, Big Bazaar Street',
    city: 'Coimbatore',
    joiningDate: '2026-01-07',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Visalakshi A',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100100',
    notes: 'Jewellery and bullion trader.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0011',
    fullName: 'Suresh Babu',
    mobileNumber: '9842100011',
    email: 'suresh.b@chitflow.demo',
    address: '14, Gandhinagar Main',
    city: 'Tirupur',
    joiningDate: '2026-01-07',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Nalini Suresh',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100101',
    notes: 'Knitting machines distributor.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0012',
    fullName: 'Ramesh Chandran',
    mobileNumber: '9842100012',
    email: 'ramesh.c@chitflow.demo',
    address: '4, Race Course Road',
    city: 'Coimbatore',
    joiningDate: '2026-01-08',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Sunita Chandran',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100102',
    notes: 'Civil construction engineer.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0013',
    fullName: 'Vijay Anand',
    mobileNumber: '9842100013',
    email: 'vijay.a@chitflow.demo',
    address: '19, Sathy Road',
    city: 'Erode',
    joiningDate: '2026-01-08',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Archana Vijay',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100103',
    notes: 'Edible oil refining trader.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0014',
    fullName: 'Praveen Kumar',
    mobileNumber: '9842100014',
    email: 'praveen.k@chitflow.demo',
    address: '11, Maravaneri',
    city: 'Salem',
    joiningDate: '2026-01-08',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Bhavani Praveen',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100104',
    notes: 'Sago and starch manufacturing.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0015',
    fullName: 'Harish Shankar',
    mobileNumber: '9842100015',
    email: 'harish.s@chitflow.demo',
    address: '67, Vadavalli Road',
    city: 'Coimbatore',
    joiningDate: '2026-01-09',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Shalini Harish',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100105',
    notes: 'Foundry equipment vendor.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0016',
    fullName: 'Saravanan Muthu',
    mobileNumber: '9842100016',
    email: 'saravanan.m@chitflow.demo',
    address: '28, Kongu Nagar',
    city: 'Tirupur',
    joiningDate: '2026-01-09',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Gowri Saravanan',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100106',
    notes: 'Dyeing unit managing partner.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0017',
    fullName: 'Selvam Ramasamy',
    mobileNumber: '9842100017',
    email: 'selvam.r@chitflow.demo',
    address: '50, New Fairlands',
    city: 'Salem',
    joiningDate: '2026-01-09',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Menaka Selvam',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100107',
    notes: 'Logistics fleet owner.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0018',
    fullName: 'Naveen Vignesh',
    mobileNumber: '9842100018',
    email: 'naveen.v@chitflow.demo',
    address: '33, Ganapathy Industrial Estate',
    city: 'Coimbatore',
    joiningDate: '2026-01-09',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Sudha Naveen',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100108',
    notes: 'Pumps and motor exporter.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0019',
    fullName: 'Balasubramaniam V',
    mobileNumber: '9842100019',
    email: 'bala.v@chitflow.demo',
    address: '90, Town Hall',
    city: 'Coimbatore',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Shanthi Bala',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100109',
    notes: 'Stationery superstore.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0020',
    fullName: 'Loganathan Perumal',
    mobileNumber: '9842100020',
    email: 'logu.p@chitflow.demo',
    address: '16, Perundurai Road',
    city: 'Erode',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Thilagavathi L',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100110',
    notes: 'Textile yarn trader.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0021',
    fullName: 'Muthukumar Swamy',
    mobileNumber: '9842100021',
    email: 'muthu.s@chitflow.demo',
    address: '10, VOC Nagar',
    city: 'Dindigul',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Radha Muthu',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100111',
    notes: 'Lock hardware and leather dealer.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0022',
    fullName: 'Jayaprakash Narayanan',
    mobileNumber: '9842100022',
    email: 'jp.narayan@chitflow.demo',
    address: '44, Ramanathapuram',
    city: 'Coimbatore',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Kokila JP',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100112',
    notes: 'Solar energy installer.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0023',
    fullName: 'Chandrasekar Iyer',
    mobileNumber: '9842100023',
    email: 'sekar.iyer@chitflow.demo',
    address: '5, Subramaniapuram',
    city: 'Madurai',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Mahalakshmi C',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100113',
    notes: 'Catering & event management.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0024',
    fullName: 'Thirunavukkarasu K',
    mobileNumber: '9842100024',
    email: 'thiru.k@chitflow.demo',
    address: '81, Dharapuram Road',
    city: 'Tirupur',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Vanitha Thiru',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100114',
    notes: 'Cardboard carton factory owner.',
    status: 'ACTIVE',
  },
  {
    id: 'MEM-0025',
    fullName: 'Velmurugan Duraisamy',
    mobileNumber: '9842100025',
    email: 'velu.d@chitflow.demo',
    address: '18, Saravanampatti',
    city: 'Coimbatore',
    joiningDate: '2026-01-10',
    assignedGroupIds: ['GRP-2026-001'],
    nomineeName: 'Amudha Velu',
    nomineeRelationship: 'Spouse',
    nomineeMobile: '9842100115',
    notes: 'Automobile spare parts retail chain.',
    status: 'ACTIVE',
  },
];

// Helper to generate seed installments and payments
export const generateSeedData = () => {
  const installments = [];
  const transactions = [];
  const receipts = [];
  const payouts = [];

  // Group 1: Diwali Special Chit 2026 (Started Jan 2026, 25 months, ₹20,000 / month)
  // Current time is Nov 2026. Months 1 to 10 (Jan to Oct) are past. Month 11 (Nov 2026) is current. Month 12+ upcoming.
  const g1 = initialGroups[0];
  const members = initialMembers; // 25 members

  // Generate 25 installments x 25 members = 625 installment records
  for (let m = 1; m <= 25; m++) {
    const monthIndex = m - 1;
    // Calculate year and month
    const yr = 2026 + Math.floor(monthIndex / 12);
    const mo = (monthIndex % 12) + 1;
    const moStr = mo < 10 ? `0${mo}` : `${mo}`;
    const dueDate = `${yr}-${moStr}-10`;
    const monthLabel = `${yr}-${moStr}`;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const instId = `INS-G1-M${m < 10 ? '0' + m : m}-${member.id}`;

      let paidAmount = 0;
      let status = 'UPCOMING';
      let paymentDate = null;

      // Months 1 to 9 (Jan - Sep 2026) were paid by almost everyone
      if (m <= 9) {
        paidAmount = 20000;
        status = 'PAID';
        const day = 8 + (i % 3);
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        paymentDate = `${yr}-${moStr}-${dayStr}`;
      } else if (m === 10) {
        // Oct 2026
        if (i < 20) {
          paidAmount = 20000;
          status = 'PAID';
          paymentDate = `2026-10-09`;
        } else if (i === 20 || i === 21) {
          paidAmount = 10000; // Partial payment
          status = 'PARTIALLY_PAID';
          paymentDate = `2026-10-10`;
        } else {
          paidAmount = 0;
          status = 'OVERDUE';
        }
      } else if (m === 11) {
        // Nov 2026 (current month - due on 10th Nov, now is 12 Nov)
        if (i < 12) {
          paidAmount = 20000;
          status = 'PAID';
          paymentDate = `2026-11-09`;
        } else if (i < 16) {
          paidAmount = 8000;
          status = 'PARTIALLY_PAID';
          paymentDate = `2026-11-10`;
        } else if (i < 20) {
          paidAmount = 0;
          status = 'PENDING';
        } else {
          paidAmount = 0;
          status = 'OVERDUE';
        }
      } else {
        // Month 12+
        status = 'UPCOMING';
      }

      installments.push({
        id: instId,
        groupId: g1.id,
        memberId: member.id,
        installmentNumber: m,
        month: monthLabel,
        dueDate,
        expectedAmount: 20000,
        paidAmount,
        remainingAmount: 20000 - paidAmount,
        paymentDate,
        status,
      });

      // If paid or partially paid, create realistic transactions & receipts
      if (paidAmount > 0) {
        const txId = `TXN-G1-${m}-${member.id}`;
        const rcptNo = `CF-2026-${String(receipts.length + 1).padStart(5, '0')}`;
        const pMethod = i % 3 === 0 ? 'UPI' : i % 3 === 1 ? 'BANK_TRANSFER' : 'CASH';

        transactions.push({
          id: txId,
          receiptNumber: rcptNo,
          groupId: g1.id,
          memberId: member.id,
          installmentId: instId,
          installmentNumber: m,
          amount: paidAmount,
          expectedAmount: 20000,
          previousPaid: 0,
          remainingBalance: 20000 - paidAmount,
          paymentDate: paymentDate || dueDate,
          paymentMethod: pMethod,
          referenceNumber: pMethod === 'UPI' ? `UPI7740291${i}${m}` : pMethod === 'BANK_TRANSFER' ? `NEFT98234${i}${m}` : 'CASH-REC',
          notes: m === 10 && paidAmount < 20000 ? 'Part payment received' : 'Regular installment payment',
          createdAt: new Date(`${paymentDate || dueDate}T11:00:00.000Z`).toISOString(),
        });

        receipts.push({
          id: `RCPT-${receipts.length + 1}`,
          receiptNumber: rcptNo,
          transactionId: txId,
          groupId: g1.id,
          groupName: g1.name,
          memberId: member.id,
          memberName: member.fullName,
          memberMobile: member.mobileNumber,
          installmentNumber: m,
          month: monthLabel,
          expectedAmount: 20000,
          previousPaid: 0,
          amountReceived: paidAmount,
          remainingBalance: 20000 - paidAmount,
          paymentDate: paymentDate || dueDate,
          paymentMethod: pMethod,
          referenceNumber: pMethod === 'UPI' ? `UPI7740291${i}${m}` : pMethod === 'BANK_TRANSFER' ? `NEFT98234${i}${m}` : 'CASH-COUNTER',
          status: paidAmount === 20000 ? 'PAID' : 'PARTIALLY_PAID',
          createdAt: new Date(`${paymentDate || dueDate}T11:00:00.000Z`).toISOString(),
        });
      }
    }
  }

  // Generate 10 Payout / Auction records for G1 (Months 1 to 10 completed draws)
  for (let m = 1; m <= 10; m++) {
    const winnerMember = members[m - 1]; // Unique member won each month
    const gross = 500000;
    // Discount bid between ₹60,000 to ₹1,00,000
    const discount = 90000 - m * 3000;
    const commission = 25000; // 5% foreman commission
    const netPayout = gross - discount;
    const pDate = `2026-${m < 10 ? '0' + m : m}-15`;

    payouts.push({
      id: `PO-2026-${String(m).padStart(3, '0')}`,
      groupId: g1.id,
      groupName: g1.name,
      memberId: winnerMember.id,
      memberName: winnerMember.fullName,
      installmentNumber: m,
      grossAmount: gross,
      discountBidAmount: discount,
      companyCommissionPercent: 5,
      companyCommissionAmount: commission,
      netPayoutAmount: netPayout,
      dividendPerMember: Math.round((discount - commission) / 25),
      payoutDate: pDate,
      paymentMethod: 'BANK_TRANSFER',
      referenceNumber: `NEFT-PAYOUT-${m}99182`,
      status: 'COMPLETED',
      notes: `Auction winner for Month ${m}. Bid discount ₹${discount.toLocaleString('en-IN')}`,
      createdAt: `${pDate}T16:00:00.000Z`,
    });
  }

  // Pre-seed some for Group 2 (Monthly Savings Chit - started Mar 2026, 20 months, 20 members)
  // Let members 0 to 19 be part of Group 2
  const g2 = initialGroups[1];
  for (let m = 1; m <= 20; m++) {
    const monthIndex = m - 1;
    const dateObj = new Date(2026, 2 + monthIndex, 5); // Start March
    const yr = dateObj.getFullYear();
    const mo = dateObj.getMonth() + 1;
    const moStr = mo < 10 ? `0${mo}` : `${mo}`;
    const dueDate = `${yr}-${moStr}-05`;
    const monthLabel = `${yr}-${moStr}`;

    for (let i = 0; i < 20; i++) {
      const member = members[i];
      const instId = `INS-G2-M${m < 10 ? '0' + m : m}-${member.id}`;
      let paid = 0;
      let status = 'UPCOMING';

      if (m <= 8) {
        paid = 10000;
        status = 'PAID';
      } else if (m === 9) {
        // Nov 2026
        paid = i < 15 ? 10000 : 0;
        status = i < 15 ? 'PAID' : 'OVERDUE';
      }

      installments.push({
        id: instId,
        groupId: g2.id,
        memberId: member.id,
        installmentNumber: m,
        month: monthLabel,
        dueDate,
        expectedAmount: 10000,
        paidAmount: paid,
        remainingAmount: 10000 - paid,
        paymentDate: paid > 0 ? `${yr}-${moStr}-04` : null,
        status,
      });

      if (paid > 0 && receipts.length < 80) {
        const txId = `TXN-G2-${m}-${member.id}`;
        const rcptNo = `CF-2026-${String(receipts.length + 1).padStart(5, '0')}`;
        transactions.push({
          id: txId,
          receiptNumber: rcptNo,
          groupId: g2.id,
          memberId: member.id,
          installmentId: instId,
          installmentNumber: m,
          amount: paid,
          expectedAmount: 10000,
          previousPaid: 0,
          remainingBalance: 0,
          paymentDate: `${yr}-${moStr}-04`,
          paymentMethod: 'UPI',
          referenceNumber: `UPI-SAV-${m}-${i}`,
          notes: 'Monthly savings contribution',
          createdAt: `${yr}-${moStr}-04T10:00:00.000Z`,
        });

        receipts.push({
          id: `RCPT-${receipts.length + 1}`,
          receiptNumber: rcptNo,
          transactionId: txId,
          groupId: g2.id,
          groupName: g2.name,
          memberId: member.id,
          memberName: member.fullName,
          memberMobile: member.mobileNumber,
          installmentNumber: m,
          month: monthLabel,
          expectedAmount: 10000,
          previousPaid: 0,
          amountReceived: paid,
          remainingBalance: 0,
          paymentDate: `${yr}-${moStr}-04`,
          paymentMethod: 'UPI',
          referenceNumber: `UPI-SAV-${m}-${i}`,
          status: 'PAID',
          createdAt: `${yr}-${moStr}-04T10:00:00.000Z`,
        });
      }
    }
  }

  return {
    installments,
    transactions,
    receipts,
    payouts,
  };
};

export const initialNotifications = [
  {
    id: 'NOTIF-1',
    type: 'OVERDUE',
    title: '5 Overdue Installments for Nov 2026',
    message: 'Members in Diwali Special Chit have unpaid dues past the grace period.',
    timestamp: '2026-11-12T09:00:00.000Z',
    read: false,
    link: '/collections',
  },
  {
    id: 'NOTIF-2',
    type: 'PAYMENT',
    title: 'Payment Received: ₹20,000',
    message: 'Rajesh Kumar paid Month 11 installment via UPI reference UPI7740291011.',
    timestamp: '2026-11-11T16:30:00.000Z',
    read: false,
    link: '/receipts',
  },
  {
    id: 'NOTIF-3',
    type: 'AUCTION',
    title: 'Upcoming Auction: Month 11 Draw',
    message: 'Diwali Special Chit auction is scheduled for 15th Nov 2026 at 4:00 PM.',
    timestamp: '2026-11-10T11:00:00.000Z',
    read: true,
    link: '/payouts',
  },
  {
    id: 'NOTIF-4',
    type: 'MEMBER',
    title: 'New Member Onboarded',
    message: 'Velmurugan Duraisamy was successfully registered and assigned to Diwali Special Chit.',
    timestamp: '2026-11-08T14:20:00.000Z',
    read: true,
    link: '/members',
  },
];

export const initialSettings = {
  companyName: 'ChitFlow Financial Solutions Pvt Ltd',
  registrationNumber: 'CIN: U65990TZ2025PTC028491',
  tagline: 'Trusted Chit Fund & Community Financial Management',
  address: '3rd Floor, Express Towers, Avinashi Road',
  city: 'Coimbatore, Tamil Nadu 641018',
  phone: '+91 422 2489000',
  email: 'admin@chitflow.in',
  currency: 'INR',
  currencySymbol: '₹',
  dateFormat: 'dd/MM/yyyy',
  adminName: 'Luca Admin',
  adminEmail: 'luca@chitflow.in',
  adminPhone: '+91 98420 12345',
  theme: 'light',
  commissionRate: 5,
};
