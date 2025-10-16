import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface DocumentConfirmationProps {
  service: any;
  selectedPlan: any;
  onBack: () => void;
}

const DocumentConfirmation: React.FC<DocumentConfirmationProps> = ({ 
  service, 
  selectedPlan, 
  onBack 
}) => {
  const navigate = useNavigate();
  const [hasAllDocuments, setHasAllDocuments] = useState(false);

  const getRequiredDocuments = () => {
    // Return documents based on service type
    if (service.id === 'change-name-confirmation-date-birth') {
      return [
        'Statutory Declaration',
        'Marriage Certificate', 
        'Ecowas Card (Ghana Card)'
      ];
    }
    
    // Default documents for other services
    return [
      'Valid ID Document',
      'Supporting Documentation',
      'Application Form'
    ];
  };

  const handleProceedToPayment = () => {
    if (hasAllDocuments) {
      console.log('DocumentConfirmation - Proceeding to payment with:', {
        serviceId: service.id,
        serviceName: service.name,
        planId: selectedPlan.FeeID,
        planName: selectedPlan.PaymentPlan
      });
      // Navigate to payment with service and plan info
      navigate(`/payment?service=${service.id}&plan=${selectedPlan.FeeID}`);
    } else {
      console.log('DocumentConfirmation - Cannot proceed: hasAllDocuments =', hasAllDocuments);
    }
  };

  const requiredDocuments = getRequiredDocuments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-sm text-gray-600">{selectedPlan.PaymentPlan} • ₵{selectedPlan.GazetteFee.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Requirements</h2>
            <p className="text-gray-600">
              Please confirm that you have all the required documents before proceeding to payment.
            </p>
          </div>

          {/* Required Documents List */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Required Documents for {service.name}
            </h3>
            <div className="space-y-3">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-blue-800 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="hasAllDocuments"
                checked={hasAllDocuments}
                onChange={(e) => setHasAllDocuments(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label htmlFor="hasAllDocuments" className="text-yellow-800 font-medium cursor-pointer">
                  I confirm that I have all the required documents listed above
                </label>
                <p className="text-yellow-700 text-sm mt-1">
                  Please ensure you have all documents ready before proceeding. Missing documents may delay your application processing.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-2">Important Notice</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• All documents must be original or certified copies</li>
                  <li>• Documents must be in good condition and clearly readable</li>
                  <li>• Processing time starts only after all documents are received</li>
                  <li>• Incomplete applications will be returned for correction</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </button>
            
            <button
              onClick={handleProceedToPayment}
              disabled={!hasAllDocuments}
              className="w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentConfirmation;
