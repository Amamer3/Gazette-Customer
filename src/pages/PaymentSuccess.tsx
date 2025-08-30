import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Application, GazetteService } from '../types/index.js';

interface LocationState {
  application: Application;
  service: GazetteService;
}

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { application, service } = (location.state as LocationState) || {};

  if (!application || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Invalid Access</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Please access this page through the payment process.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 text-center">
          {/* Success Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Payment Successful!</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Your payment has been processed successfully. Your application has been submitted and is now being reviewed.
          </p>

          {/* Application Details */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Application Details</h2>
            <div className="space-y-2 sm:space-y-3 text-left">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Service:</span>
                <span className="font-medium text-xs sm:text-sm text-right">{service.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Application ID:</span>
                <span className="font-mono text-xs sm:text-sm">{application.id}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Payment Reference:</span>
                <span className="font-mono text-xs sm:text-sm">{application.paymentReference}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Amount Paid:</span>
                <span className="font-bold text-blue-600 text-xs sm:text-sm">GHS {service.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-xs sm:text-sm">Expected Completion:</span>
                <span className="text-xs sm:text-sm">{service.processingTime}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="text-left space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start">
                <span className="inline-flex w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">1</span>
                <span>Your application will be reviewed by our team within 1-2 business days.</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">2</span>
                <span>You'll receive email notifications about any status updates.</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">3</span>
                <span>Once approved, your certificate will be processed and made available for download.</span>
              </div>
              <div className="flex items-start">
                <span className="inline-flex w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">4</span>
                <span>You can track your application status anytime from your dashboard.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/applications')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-violet-600 text-white text-sm sm:text-base rounded-md hover:bg-violet-700 transition-colors"
            >
              Track Application
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@ghanagazette.gov.gh" className="text-blue-600 hover:text-blue-700">
                support@ghanagazette.gov.gh
              </a>{' '}
              or call{' '}
              <a href="tel:+233302123456" className="text-blue-600 hover:text-blue-700">
                +233 30 212 3456
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;