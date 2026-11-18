import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export const receiptService = {
  generateReceiptNumber: (existingCount = 0) => {
    const year = new Date().getFullYear();
    const count = existingCount + 1;
    return `CF-${year}-${String(count).padStart(5, '0')}`;
  },

  /**
   * Generates PDF Receipt in multiple formats:
   * @param {Object} receipt - Receipt voucher data
   * @param {Object} companyDetails - Settings company information
   * @param {'standard' | '3inch' | '2inch'} format - Page format
   */
  downloadReceiptPDF: (receipt, companyDetails = {}, format = 'standard') => {
    if (format === '2inch' || format === '3inch') {
      return receiptService.downloadThermalReceiptPDF(receipt, companyDetails, format);
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    const primaryColor = [67, 56, 202]; // Deep Indigo
    const darkGray = [30, 41, 59];

    // Header styling
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 148, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CHITFLOW', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL PAYMENT RECEIPT', 14, 18);

    doc.setFontSize(10);
    doc.text(receipt.receiptNumber, 134, 12, { align: 'right' });
    doc.setFontSize(8);
    doc.text(formatDate(receipt.paymentDate), 134, 18, { align: 'right' });

    // Company & Member details
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(companyDetails.companyName || 'ChitFlow Financial Solutions Pvt Ltd', 14, 32);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(companyDetails.address || '3rd Floor, Express Towers, Avinashi Road, Coimbatore', 14, 37);
    doc.text(
      `Phone: ${companyDetails.phone || '+91 422 2489000'} | GST/CIN: ${companyDetails.registrationNumber || 'CIN: U65990TZ2025PTC028491'}`,
      14,
      41
    );

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 45, 134, 45);

    // Bill To
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIVED FROM:', 14, 52);
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(receipt.memberName, 14, 58);
    doc.setTextColor(...darkGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Member ID: ${receipt.memberId}`, 14, 63);
    doc.text(`Contact: ${receipt.memberMobile || 'N/A'}`, 14, 67);

    // Chit details (Right box)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('CHIT DETAILS:', 85, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Group: ${receipt.groupName}`, 85, 58);
    doc.text(`Installment: Month ${receipt.installmentNumber}`, 85, 63);
    doc.text(`Payment Mode: ${receipt.paymentMethod}`, 85, 67);
    doc.text(`Ref / Trx: ${receipt.referenceNumber || 'N/A'}`, 85, 71);

    // Table of financial breakdown
    autoTable(doc, {
      startY: 76,
      margin: { left: 14, right: 14 },
      head: [['Description', 'Expected Due', 'Previously Paid', 'Amount Received', 'Balance Due']],
      body: [
        [
          `Installment #${receipt.installmentNumber} (${receipt.month || 'Current'})`,
          formatCurrency(receipt.expectedAmount),
          formatCurrency(receipt.previousPaid || 0),
          formatCurrency(receipt.amountReceived),
          formatCurrency(receipt.remainingBalance),
        ],
      ],
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [51, 65, 85],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [15, 23, 42],
      },
      theme: 'grid',
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Status pill
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    if (receipt.remainingBalance === 0) {
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text('STATUS: FULLY PAID', 14, finalY);
    } else {
      doc.setTextColor(217, 119, 6); // Amber
      doc.text('STATUS: PARTIALLY PAID', 14, finalY);
    }

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('This is a computer-generated receipt issued by ChitFlow. No physical signature is required.', 14, finalY + 12);
    doc.text('Thank you for saving systematically with us!', 14, finalY + 16);

    doc.save(`${receipt.receiptNumber}_Standard_A5.pdf`);
  },

  /**
   * Generates Thermal POS Slip (2" 58mm or 3" 80mm roll format)
   */
  downloadThermalReceiptPDF: (receipt, companyDetails = {}, size = '3inch') => {
    // 2" = 58mm width, 3" = 80mm width
    const width = size === '2inch' ? 58 : 80;
    const height = size === '2inch' ? 140 : 160;
    const margin = size === '2inch' ? 3 : 5;
    const contentWidth = width - margin * 2;
    const centerX = width / 2;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [width, height],
    });

    let y = 7;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size === '2inch' ? 11 : 13);
    doc.text('CHITFLOW', centerX, y, { align: 'center' });
    y += 4;

    doc.setFontSize(size === '2inch' ? 7 : 8);
    doc.setFont('helvetica', 'normal');
    doc.text(companyDetails.companyName || 'ChitFlow Financial Solutions', centerX, y, { align: 'center' });
    y += 3.5;
    if (companyDetails.phone) {
      doc.setFontSize(size === '2inch' ? 6 : 7);
      doc.text(`Ph: ${companyDetails.phone}`, centerX, y, { align: 'center' });
      y += 3;
    }

    // Dashed divider
    doc.setFont('courier', 'normal');
    doc.setFontSize(size === '2inch' ? 7 : 8);
    const dividerText = '-'.repeat(size === '2inch' ? 32 : 44);
    doc.text(dividerText, centerX, y, { align: 'center' });
    y += 3.5;

    // Receipt Meta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size === '2inch' ? 7.5 : 8.5);
    doc.text(`RCPT: ${receipt.receiptNumber}`, margin, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size === '2inch' ? 6.5 : 7.5);
    doc.text(`Date: ${formatDate(receipt.paymentDate)}`, margin, y);
    y += 3.5;

    doc.text(dividerText, centerX, y, { align: 'center' });
    y += 3.5;

    // Member & Group
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size === '2inch' ? 7.5 : 8.5);
    doc.text(`Sub: ${receipt.memberName}`, margin, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size === '2inch' ? 6.5 : 7.5);
    doc.text(`ID: ${receipt.memberId} | Mob: ${receipt.memberMobile || '-'}`, margin, y);
    y += 3.5;
    doc.text(`Circle: ${receipt.groupName}`, margin, y);
    y += 3.5;
    doc.text(`Installment: Month #${receipt.installmentNumber}`, margin, y);
    y += 3.5;

    doc.text(dividerText, centerX, y, { align: 'center' });
    y += 4;

    // Amount Line items
    const printRow = (label, val, isBold = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(size === '2inch' ? 7 : 8);
      doc.text(label, margin, y);
      doc.text(val, width - margin, y, { align: 'right' });
      y += 3.8;
    };

    printRow('Expected Due:', formatCurrency(receipt.expectedAmount));
    if (receipt.previousPaid > 0) {
      printRow('Prev Paid:', formatCurrency(receipt.previousPaid));
    }

    doc.text(dividerText, centerX, y, { align: 'center' });
    y += 3.8;

    printRow('AMOUNT PAID:', formatCurrency(receipt.amountReceived), true);
    printRow('Balance Due:', formatCurrency(receipt.remainingBalance), true);

    y += 1;
    doc.text(dividerText, centerX, y, { align: 'center' });
    y += 3.8;

    // Payment method info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size === '2inch' ? 6.5 : 7);
    doc.text(`Mode: ${receipt.paymentMethod}`, margin, y);
    y += 3;
    if (receipt.referenceNumber) {
      doc.text(`Ref: ${receipt.referenceNumber}`, margin, y);
      y += 3.5;
    }

    // Status Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size === '2inch' ? 7.5 : 8.5);
    const statusText = receipt.remainingBalance === 0 ? '*** FULLY PAID ***' : '*** PARTIALLY PAID ***';
    doc.text(statusText, centerX, y, { align: 'center' });
    y += 4;

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(size === '2inch' ? 5.5 : 6.5);
    doc.text('Thank You For Saving With Us!', centerX, y, { align: 'center' });
    y += 3;
    doc.text('Computer Generated Voucher', centerX, y, { align: 'center' });

    doc.save(`${receipt.receiptNumber}_Thermal_${size.toUpperCase()}.pdf`);
  },
};
