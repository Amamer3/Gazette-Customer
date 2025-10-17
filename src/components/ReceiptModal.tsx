import React, { useEffect, useRef } from 'react';
import { X, Download, FileText, Calendar, CreditCard, Hash, MapPin, Phone, Mail } from 'lucide-react';
import type { Order } from '../types/application';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  useEffect(() => {
    if (isOpen && order && qrCodeRef.current) {
      // Generate QR code data
      const qrData = `Ghana Publishing Company Limited\nReceipt: ${order.id}\nAmount: ${formatCurrency(order.amount, order.currency)}\nDate: ${formatDate(order.createdAt)}\nReference: ${order.paymentReference || 'N/A'}\nStatus: ${order.status.toUpperCase()}`;
      
      // Generate QR code using dynamic import
      import('qrcode').then((QRCode) => {
        QRCode.default.toCanvas(qrCodeRef.current, qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        }).catch((err: any) => {
          console.error('Error generating QR code:', err);
        });
      }).catch((err: any) => {
        console.error('Error loading QR code library:', err);
      });
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleDownload = async () => {
    try {
      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      // Get the receipt modal content
      const modalElement = document.querySelector('.bg-white.shadow-2xl.max-w-4xl') as HTMLElement;
      if (!modalElement) {
        console.error('Receipt modal element not found');
        return;
      }

      // Create canvas from the modal content
      const canvas = await html2canvas(modalElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`receipt-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to JSON download if PDF generation fails
      const receiptData = {
        orderId: order.id,
        serviceName: order.serviceName,
        amount: order.amount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        paymentReference: order.paymentReference,
        createdAt: order.createdAt,
        status: order.status
      };
      
      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${order.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Generate QR code data for display
  const qrCodeData = `Ghana Publishing Company Limited\nReceipt: ${order.id}\nAmount: ${formatCurrency(order.amount, order.currency)}\nDate: ${formatDate(order.createdAt)}\nReference: ${order.paymentReference || 'N/A'}\nStatus: ${order.status.toUpperCase()}`;

  return (
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-[70] p-4">
      <div className="bg-white shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="px-8 pb-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Company Logo */}
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/gpclogo.png" 
                alt="Ghana Publishing Company Limited Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            {/* Company Information */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ghana Publishing Company Limited</h1>
            <p className="text-gray-600 mb-4">Official Government Gazette Services</p>
            
            {/* Receipt Title */}
            <div className="border-t border-b border-gray-300 py-4">
              <h2 className="text-xl font-bold text-gray-900">PAYMENT RECEIPT</h2>
              <p className="text-sm text-gray-600 mt-1">Receipt #{order.id}</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-8 py-4 rounded-lg text-lg font-bold ${
              order.status === 'paid' ? 'bg-green-50 text-green-800 border-2 border-green-200' :
              order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-2 border-yellow-200' :
              order.status === 'failed' ? 'bg-red-50 text-red-800 border-2 border-red-200' :
              'bg-gray-50 text-gray-800 border-2 border-gray-200'
            }`}>
              {order.status === 'paid' && '✓ PAYMENT SUCCESSFUL'}
              {order.status === 'pending' && '⏳ PAYMENT PENDING'}
              {order.status === 'failed' && '✗ PAYMENT FAILED'}
              {order.status === 'refunded' && '↩ PAYMENT REFUNDED'}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Transaction Details */}
            <div className="space-y-6">
              {/* Service Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Service Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">{order.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(order.amount, order.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt ID:</span>
                    <span className="font-mono text-gray-900">{order.id}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Payment Details
                </h3>
                <div className="space-y-4">
                  {order.paymentMethod && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                      </div>
                    </div>
                  )}
                  {order.paymentReference && (
                    <div className="flex items-center space-x-3">
                      <Hash className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Payment Reference</p>
                        <p className="font-medium text-gray-900 font-mono">{order.paymentReference}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Verification QR Code
                </h3>
                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                  {/* Real QR Code */}
                  <canvas 
                    ref={qrCodeRef}
                    className="mx-auto mb-2"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  <p className="text-xs text-gray-500 font-mono">QR CODE</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code to verify the authenticity of this receipt
                </p>
                <div className="text-xs text-gray-500 bg-white rounded-lg p-3 font-mono border border-gray-200">
                  {qrCodeData}
                </div>
              </div>

              {/* Company Contact */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 pb-2 border-b border-blue-200">
                  Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">info@gpc.gov.gh</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">+233 302 123 456</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Accra, Ghana</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Important Information
            </h4>
            <ul className="text-yellow-800 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">•</span>
                <span>This is an official receipt from Ghana Publishing Company Limited</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">•</span>
                <span>Keep this receipt for your records and future reference</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">•</span>
                <span>Use the payment reference for any inquiries or support requests</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 font-bold">•</span>
                <span>Contact us using the information provided above for any questions</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p className="font-medium">Thank you for using Ghana Publishing Company services</p>
            <p className="mt-1">This receipt was generated on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
