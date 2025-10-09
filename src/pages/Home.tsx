import React from 'react';
import { Link } from 'react-router-dom';
import { gazettePricingServices } from '../services/mockData';
import { Clock, Shield, FileText, ArrowRight, Users, Award, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              {/* <Award className="w-4 h-4 mr-2" /> */}
              Official Government Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Ghana E-Gazette
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
              Your Digital Gateway to Government Services
            </p>
            <p className="text-lg mb-12 text-blue-200/90 max-w-3xl mx-auto leading-relaxed">
              Experience seamless government services with our modern digital platform. 
              Apply for certificates, licenses, and official documents with just a few clicks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/auth"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-violet-700 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-white/90">
                <div className="text-3xl font-bold mb-1">50K+</div>
                <div className="text-sm text-blue-200">Documents Issued</div>
              </div>
              <div className="text-white/90">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-blue-200">Satisfaction Rate</div>
              </div>
              <div className="text-white/90">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-blue-200">Online Support</div>
              </div>
              <div className="text-white/90">
                <div className="text-3xl font-bold mb-1">5-7</div>
                <div className="text-sm text-blue-200">Days Processing</div>
              </div>
            </div>
            
            </div>
            
            {/* Hero Illustration */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/image.png"
                  alt="Ghana E-Gazette Digital Services" 
                  className="max-w-md rounded-2xl lg:max-w-lg xl:max-w-xl h-96"
                />
                {/* Floating Animation Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>



          <div className="text-center pt-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Government Services
              <span className="block text-violet-600">Made Simple</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access all essential government documents and certificates through our streamlined digital platform
            </p>
          </div>







      {/* Services Section */}
      {/* <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              <FileText className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Government Services
              <span className="block text-violet-600">Made Simple</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access all essential government documents and certificates through our streamlined digital platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gazetteServices.map((service, index) => {
              
              const serviceImages = {
                'birth-certificate': birthCertificate,
                'name-change': nameChange,
                'marriage-certificate': marriageCertificate,
                'business-license': businessLicense
              };
              
              return (
                <div 
                  key={service.id} 
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                > */}
                  {/* Gradient Overlay */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-8"> */}
                    {/* Service Image */}
                    {/* <div className="w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={serviceImages[service.id as keyof typeof serviceImages]} 
                        alt={service.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p> */}
                    
                    {/* Price and Processing */}
                    {/* <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">Price:</span>
                        <span className="font-bold text-blue-600 text-lg">GHS {service.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">Processing:</span>
                        <span className="text-sm font-semibold text-violet-700">{service.processingTime}</span>
                      </div>
                    </div> */}
                    
                    {/* Apply Button */}
                    {/* <Link 
                      to={`/application/${service.id}`}
                      className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
      </section> */}

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              PREMIUM PLUS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our premium plus services for official gazette publications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {gazettePricingServices
              .filter(service => service.gazetteType === 'premium-plus')
              .map((service) => (
                <div 
                  key={service.id} 
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, rgba(255,0,255,0.1), rgba(0,255,255,0.1))',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-animation 5s ease infinite'
                  }}
                >
                  <div className="p-6">
                    <div className="bg-blue-600 text-white text-center py-2 px-4 rounded-lg mb-4">
                      <span className="text-sm font-semibold">PREMIUM Plus</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-violet-800 mb-3">
                      {service.name}
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {service.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                            <span className="text-sm text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
                      <div className="text-gray-700 font-semibold">GHC</div>
                      <div className="text-3xl font-bold text-blue-600">{service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                    
                    <Link 
                      to={`/application/${service.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              PREMIUM GAZETTE
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our premium gazette publication services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {gazettePricingServices
              .filter(service => service.gazetteType === 'premium-gazette')
              .map((service) => (
                <div 
                  key={service.id} 
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, rgba(255,0,255,0.05), rgba(0,255,255,0.05))',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-animation 5s ease infinite'
                  }}
                >
                  <div className="p-6">
                    <div className="bg-purple-600 text-white text-center py-2 px-4 rounded-lg mb-4">
                      <span className="text-sm font-semibold">PREMIUM Gazette Type</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-violet-800 mb-3">
                      {service.name}
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {service.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></span>
                            <span className="text-sm text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
                      <div className="text-gray-700 font-semibold">GHC</div>
                      <div className="text-3xl font-bold text-purple-600">{service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                    
                    <Link 
                      to={`/application/${service.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              REGULAR GAZETTE
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our standard gazette publication services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gazettePricingServices
              .filter(service => service.gazetteType === 'regular-gazette')
              .map((service) => (
                <div 
                  key={service.id} 
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg mb-4">
                      <span className="text-sm font-semibold">Gazette Type</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-blue-800 mb-3">
                      {service.name}
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {service.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                            <span className="text-sm text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
                      <div className="text-gray-700 font-semibold">GHC</div>
                      <div className="text-3xl font-bold text-blue-600">{service.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                    
                    <Link 
                      to={`/application/${service.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Features Illustration */}
          <div className="flex justify-center mb-12">
            <img 
              src="/image.png" 
              alt="Digital Government Services Features" 
              className="w-full max-w-2xl h-auto opacity-90 rounded-2xl"
            />
          </div>
          
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-violet-700 text-sm font-medium mb-6 shadow-lg">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {/* <Star className="w-4 h-4 mr-2" /> */}
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Built for
              <span className="block bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Experience government services like never before with our cutting-edge platform designed for speed, security, and simplicity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Clock className="w-10 h-10 text-violet-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-violet-700 transition-colors">
                Lightning Fast
              </h3>
              <p className="text-gray-100 leading-relaxed">
                Process documents in minutes, not days. Our AI-powered system ensures rapid verification and approval
              </p>
              <div className="mt-4 inline-flex items-center text-violet-600 font-semibold">
                <span className="text-2xl font-bold mr-2">3x</span>
                <span className="text-sm">Faster than traditional methods</span>
              </div>
            </div>
            
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-blue-700 transition-colors">
                Bank-Level Security
              </h3>
              <p className="text-gray-100 leading-relaxed">
                Your data is protected with military-grade encryption and multi-layer security protocols
              </p>
              <div className="mt-4 inline-flex items-center text-blue-600 font-semibold">
                <span className="text-2xl font-bold mr-2">256-bit</span>
                <span className="text-sm">SSL Encryption</span>
              </div>
            </div>
            
            <div className="group text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Users className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-indigo-700 transition-colors">
                Expert Support
              </h3>
              <p className="text-gray-100 leading-relaxed">
                Get instant help from our certified specialists available 24/7 via chat, phone, or email
              </p>
              <div className="mt-4 inline-flex items-center text-indigo-600 font-semibold">
                <span className="text-2xl font-bold mr-2">24/7</span>
                <span className="text-sm">Live Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
        <section className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-100 mb-2">50,000+</div>
              <div className="text-gray-100">Certificates Issued</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-100 mb-2">98%</div>
              <div className="text-gray-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-100 mb-2">5-7</div>
              <div className="text-gray-100">Days Average Processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-100 mb-2">24/7</div>
                <div className="text-gray-100">Online Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-blue-400 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 animate-float">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute top-32 right-20 animate-float" style={{animationDelay: '2s'}}>
            <Shield className="w-6 h-6 text-white/20" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{animationDelay: '4s'}}>
            <Clock className="w-7 h-7 text-white/20" />
          </div>
          <div className="absolute bottom-32 right-10 animate-float" style={{animationDelay: '1s'}}>
            <Users className="w-5 h-5 text-white/20" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              Join 50,000+ Satisfied Customers
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Your Experience?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust Ghana Publishing Company Ltd for their official gazette needs. Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="group inline-flex items-center px-8 py-4 bg-white text-violet-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25"
              >
                <span>Get Started Free</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/dashboard"
                className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <FileText className="mr-2 w-5 h-5" />
                <span>View Services</span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-white/80">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm">Support</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-white mb-2">5★</div>
                <div className="text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="https://ghanapublishing.gov.gh/wp-content/uploads/2025/03/gpclogo.png" className='w-38 h-14' alt="" />
              </div>
              <p className="text-gray-400">
                Official digital gazette services from Ghana Publishing Company Ltd.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Birth Certificates</li>
                <li>Name Changes</li>
                <li>Marriage Certificates</li>
                <li>Business Licenses</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Track Application</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Ghana Publishing Company Ltd</p>
                <p>Accra, Ghana</p>
                <p>+233 XXX XXX XXX</p>
                <p>info@egazette.gov.gh</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Ghana Publishing Company Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;