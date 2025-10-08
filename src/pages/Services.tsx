import React from 'react';
import { Link } from 'react-router-dom';
import { gazetteServices } from '../data/mockData';
import { ArrowRight, FileText, Building, Heart, User, Briefcase, Church } from 'lucide-react';

const Services: React.FC = () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'premium-plus': return 'from-blue-600 to-cyan-600';
      case 'premium-gazette': return 'from-purple-600 to-pink-600';
      case 'regular-gazette': return 'from-green-600 to-emerald-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'premium-plus': return 'PREMIUM PLUS';
      case 'premium-gazette': return 'PREMIUM GAZETTE';
      case 'regular-gazette': return 'REGULAR GAZETTE';
      default: return 'STANDARD';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            {gazetteServices.map((service) => {
              const IconComponent = getServiceIcon(service.icon);
              return (
                <div 
                  key={service.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Service Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-violet-600" />
                    </div>
                    
                    {/* Service Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors">
                      {service.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
                        {service.category}
                      </span>
                    </div>
                    
                    {/* Price and Processing Time */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">Price:</span>
                        <span className="font-bold text-violet-600 text-lg">
                          GHS {service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">Processing:</span>
                        <span className="text-sm font-semibold text-blue-700">{service.processingTime}</span>
                      </div>
                    </div>
                    
                    {/* Required Documents Preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Required Documents:</h4>
                      <ul className="space-y-1">
                        {service.requiredDocuments.slice(0, 3).map((doc, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span className="text-sm text-gray-600">{doc}</span>
                          </li>
                        ))}
                        {service.requiredDocuments.length > 3 && (
                          <li className="text-sm text-violet-600 font-medium">
                            +{service.requiredDocuments.length - 3} more documents
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Apply Button */}
                    <Link 
                      to={`/application/${service.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
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
    </div>
  );
};

export default Services;
