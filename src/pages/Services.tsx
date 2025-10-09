import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gazetteServices } from '../data/mockData';
import { gazettePricingServices } from '../services/mockData';
import { ArrowRight, FileText, Building, Heart, User, Briefcase, Church, X, Star, Clock, Shield, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showGazetteTypeModal, setShowGazetteTypeModal] = useState(false);

  const getServiceIcon = (iconName: string) => {
    const icons = {
      'Heart': Heart,
      'Building': Building,
      'User': User,
      'Briefcase': Briefcase,
      'Church': Church,
      'FileText': FileText
    };
    return icons[iconName as keyof typeof icons] || FileText;
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setShowGazetteTypeModal(true);
  };

  const closeModal = () => {
    setShowGazetteTypeModal(false);
    setSelectedService(null);
  };

  // Map services to their corresponding gazette types
  const getServiceGazetteTypes = (serviceId: string) => {
    const serviceGazetteMapping: { [key: string]: string[] } = {
      'appointment-marriage-officers': ['marriage-officer'],
      'change-name-confirmation-date-birth': ['name-of-persons', 'date-of-birth', 'mrs-to-miss', 'miss-to-mrs'],
      'public-place-worship-marriage-license': ['public-place-of-worship'],
      'change-name-company-school-hospital': ['name-of-persons'],
      'incorporation-commencement-companies': ['name-of-persons']
    };
    
    return serviceGazetteMapping[serviceId] || [];
  };

  // Filter gazette pricing services based on selected service
  const getFilteredGazetteServices = (serviceId: string) => {
    const relevantCategories = getServiceGazetteTypes(serviceId);
    return gazettePricingServices.filter(service => 
      relevantCategories.includes(service.category)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .animate-slideUp {
            animation: slideUp 0.4s ease-out forwards;
          }
        `
      }} />
      {/* Header Section */}
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
            <FileText className="w-4 h-4 mr-2" />
            E-Gazette Services
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Select Gazette Application Type
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive range of official gazette services. 
            Each service is designed to meet specific legal and administrative requirements.
          </p>
        </div>
      </section>

      {/* About Ghana Publishing Company */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ghana Publishing Company
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-violet-700">Now We are one click away from you</span>
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  About Ghana Publishing Company
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Ghana Publishing Company (formerly called Ghana Publishing Corporation) was incorporated on March 9, 1965 under Legislative Instrument No. 413, and subsequently amended by L.I. 672 of December 11, 1970 to take over the functions of the former Government Printing Department and the Administration of the Government Free Textbook Schemes.
                  </p>
                  <p>
                    The Assembly Press was converted into a Limited Liability Company under the Statutory Corporations (Conversion to Companies) Act 461, 1993, and re-named Ghana Publishing Company Limited in 2007.
                  </p>
                  <p>
                    We exist primarily to print and publish very high quality books and stationery for Educational Institutions, Government Departments and the General Public at competitive prices.
                  </p>
                  <p className="font-semibold text-violet-700">
                    We aim at nothing but the best in all our Services. As a Printing and Publishing Company, our values drive us to offer World Class Services to our clients and the General Public.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Our E-Gazette Services</h4>
                <ul className="space-y-3">
                  {gazetteServices.map((service) => {
                    const IconComponent = getServiceIcon(service.icon);
                    return (
                      <li key={service.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{service.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the service that matches your needs. Each service includes comprehensive support and guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gazetteServices.map((service, index) => {
              const IconComponent = getServiceIcon(service.icon);
              return (
                <div 
                  key={service.id} 
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-100 overflow-hidden relative"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300"></div>
                  
                  <div className="relative p-8">
                    {/* Service Icon */}
                    <div className="relative mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-violet-100 via-violet-50 to-blue-100 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <IconComponent className="w-10 h-10 text-violet-600 group-hover:text-violet-700 transition-colors duration-300" />
                      </div>
                      {/* Icon Glow Effect */}
                      <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Service Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-violet-700 transition-colors duration-300 leading-tight">
                      {service.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                      {service.description}
                    </p>
                    
                    {/* Category Badge */}
                    <div className="mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-100 to-blue-100 text-violet-800 border border-violet-200">
                        <Star className="w-3 h-3 mr-1" />
                        {service.category}
                      </span>
                    </div>
                    
                    {/* Price and Processing Time */}
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-violet-600 font-bold text-sm">₵</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Price</span>
                        </div>
                        <span className="font-bold text-violet-600 text-xl">
                          GHS {service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Processing</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-700">{service.processingTime}</span>
                      </div>
                    </div>
                    
                    {/* Required Documents Preview */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-violet-600" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {service.requiredDocuments.slice(0, 3).map((doc, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{doc}</span>
                          </li>
                        ))}
                        {service.requiredDocuments.length > 3 && (
                          <li className="text-sm text-violet-600 font-semibold flex items-center">
                            <span className="w-4 h-4 bg-violet-100 rounded-full flex items-center justify-center mr-2 text-xs">+</span>
                            {service.requiredDocuments.length - 3} more documents
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Apply Button */}
                    <button 
                      onClick={() => handleServiceClick(service)}
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-violet-600 via-violet-500 to-blue-600 text-white rounded-2xl font-bold text-sm hover:from-violet-700 hover:via-violet-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group/btn"
                    >
                      <span className="relative z-10">Apply Now</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      {/* Button Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-blue-400 rounded-2xl blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process ensures quick and efficient service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Select Service',
                description: 'Choose the gazette service you need from our comprehensive list'
              },
              {
                step: '02',
                title: 'Fill Application',
                description: 'Complete the online application form with required information'
              },
              {
                step: '03',
                title: 'Upload Documents',
                description: 'Upload all required supporting documents securely'
              },
              {
                step: '04',
                title: 'Make Payment',
                description: 'Pay the service fee through our secure payment gateway'
              },
              {
                step: '05',
                title: 'Track Progress',
                description: 'Monitor your application status through your dashboard'
              },
              {
                step: '06',
                title: 'Receive Document',
                description: 'Get your official gazette publication delivered to you'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Ghana Publishing Company for their official gazette needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Gazette Type Selection Modal */}
      {showGazetteTypeModal && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {React.createElement(getServiceIcon(selectedService.icon), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Select Gazette Type
                    </h2>
                    <p className="text-white/90 text-sm">
                      {selectedService.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 group"
                >
                  <X className="w-5 h-5 text-white group-hover:text-white/80 transition-colors" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* All Gazette Types in a Single Row */}
              <div className="space-y-6">
                {/* PREMIUM PLUS */}
                {getFilteredGazetteServices(selectedService.id).some(service => service.gazetteType === 'premium-plus') && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-blue-800">PREMIUM PLUS</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredGazetteServices(selectedService.id)
                        .filter(service => service.gazetteType === 'premium-plus')
                        .map((service) => (
                        <div 
                          key={service.id} 
                          className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{service.name}</h4>
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              GHC {service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                            <Link 
                              to={`/application/${service.id}`}
                              onClick={closeModal}
                              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Select
                              <ArrowRight className="ml-1 w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREMIUM GAZETTE */}
                {getFilteredGazetteServices(selectedService.id).some(service => service.gazetteType === 'premium-gazette') && (
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-purple-800">PREMIUM GAZETTE</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredGazetteServices(selectedService.id)
                        .filter(service => service.gazetteType === 'premium-gazette')
                        .map((service) => (
                        <div 
                          key={service.id} 
                          className="bg-white rounded-lg p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{service.name}</h4>
                            <div className="text-2xl font-bold text-purple-600 mb-2">
                              GHC {service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                            <Link 
                              to={`/application/${service.id}`}
                              onClick={closeModal}
                              className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              Select
                              <ArrowRight className="ml-1 w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* REGULAR GAZETTE */}
                {getFilteredGazetteServices(selectedService.id).some(service => service.gazetteType === 'regular-gazette') && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-green-800">REGULAR GAZETTE</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredGazetteServices(selectedService.id)
                        .filter(service => service.gazetteType === 'regular-gazette')
                        .map((service) => (
                        <div 
                          key={service.id} 
                          className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{service.name}</h4>
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              GHC {service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                            <Link 
                              to={`/application/${service.id}`}
                              onClick={closeModal}
                              className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Select
                              <ArrowRight className="ml-1 w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
