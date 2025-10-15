import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Shield, FileText, ArrowRight, Users, Award, User, Building, Church, X, Heart, Briefcase } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import ApiService from '../services/apiService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showGazetteTypeModal, setShowGazetteTypeModal] = useState(false);
  const [gazettePlans, setGazettePlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const { services: gazetteServices, loading, error } = useServices();

  const getServiceIcon = (serviceName: string) => { 
    const name = serviceName.toLowerCase();
    
    if (name.includes('marriage') || name.includes('officer')) {
      return Heart;
    } else if (name.includes('company') || name.includes('incorporation') || name.includes('school') || name.includes('hospital')) {
      return Building;
    } else if (name.includes('name') || name.includes('birth')) {
      return User;
    } else if (name.includes('worship') || name.includes('religious')) {
      return Church;
    } else if (name.includes('business') || name.includes('license')) {
      return Briefcase;
    }
    
    return FileText;
  };

  const handleServiceClick = async (service: any) => {
    console.log('Home - handleServiceClick called with service:', service);
    console.log('Home - service.id:', service.id);
    setSelectedService(service);
    setShowGazetteTypeModal(true);
    
    // Fetch gazette plans for this service
    setLoadingPlans(true);
    try {
      const response = await ApiService.getGazetteTypes(service.id, "0");
      console.log('Home - getGazetteTypes response:', response);
      console.log('Home - response.success:', response.success);
      console.log('Home - response.data:', response.data);
      console.log('Home - response.data.SearchDetail:', response.data?.SearchDetail);
      
      if (response.success && response.data && response.data.SearchDetail) {
        console.log('Home - Setting gazette plans:', response.data.SearchDetail);
        console.log('Home - Number of plans:', response.data.SearchDetail.length);
        setGazettePlans(response.data.SearchDetail);
      } else {
        console.error('Home - Failed to fetch gazette types:', response.error);
        console.error('Home - Response structure:', JSON.stringify(response, null, 2));
        setGazettePlans([]);
      }
    } catch (error) {
      console.error('Home - Error fetching gazette plans:', error);
      setGazettePlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const closeModal = () => {
    setShowGazetteTypeModal(false);
    setSelectedService(null);
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Ghana E-Gazette
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 font-light">
              Your Digital Gateway to Government Services
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 lg:mb-12 text-blue-200/90 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              Experience seamless government services with our modern digital platform. 
              Apply for certificates, licenses, and official documents with just a few clicks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-12 sm:mb-14 lg:mb-16">
              <Link
                to="/auth"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Explore Services
              </button>
            </div>
            
            
            
            </div>
            
            {/* Hero Illustration */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/mobile-screenshot-hp2.png"
                  alt="Ghana Electronic Gazette Digital Services" 
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-xl h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] object-cover rounded-2xl"
                />
                
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        {/* <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div> */}
      </section>


      {/* Services Section */}
      <section id="services-section" className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Gazette Services
              <span className="block text-blue-600">Tailored to Your Needs</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive range of official gazette publication services, 
              each designed to meet specific legal and administrative requirements with professional excellence.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading services: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {gazetteServices.map((service, index) => {
                const IconComponent = getServiceIcon(service.name);
                
                return (
                  <div 
                    key={service.id} 
                    className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 border border-gray-100 overflow-hidden cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleServiceClick(service)}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-4 sm:p-6 lg:p-8">
                      {/* Service Icon */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-inner">
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
                        </div>
                      </div>
                      
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-700 transition-colors text-center leading-tight">
                        {service.name}
                      </h3>
                      
                      {/* Service Description */}
                      <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-center text-xs sm:text-sm line-clamp-3">
                        {service.description || `Professional ${service.name.toLowerCase()} service`}
                      </p>
                      
                      {/* Apply Button */}
                      <div className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-2xl">
                        Apply Now
                        <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
          )}
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Gazette Services
              <span className="block text-blue-600">Tailored to Your Needs</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive range of official gazette publication services, 
              each designed to meet specific legal and administrative requirements with professional excellence.
            </p>
          </div> */}
          
          {/* Service Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-14 lg:mb-16">
            
          </div>

          {/* CTA Section */}
          <div className="bg-blue-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-sm sm:text-base lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Explore our comprehensive range of gazette services and find the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 justify-center text-center">
              <button
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg  hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                View All Services
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
                    <Link 
                to="/auth"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                    >
                Get Started
                    </Link>
                  </div>
          </div>
        </div>
      </section>

            

      {/* Statistics Section */}
        <section className="bg-blue-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-1 sm:mb-2">50,000+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-100">Gazette Publications Issued</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-1 sm:mb-2">98%</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-100">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-1 sm:mb-2">5-7</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-100">Days Average Processing</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-100">Online Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-blue-400 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 animate-float">
            <FileText className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white/20" />
          </div>
          <div className="absolute top-16 sm:top-32 right-8 sm:right-20 animate-float" style={{animationDelay: '2s'}}>
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white/20" />
          </div>
          <div className="absolute bottom-10 sm:bottom-20 left-8 sm:left-20 animate-float" style={{animationDelay: '4s'}}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white/20" />
          </div>
          <div className="absolute bottom-16 sm:bottom-32 right-4 sm:right-10 animate-float" style={{animationDelay: '1s'}}>
            <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white/20" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Join 50,000+ Satisfied Customers
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Your Experience?
              </span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust Ghana E-Gazette for their official gazette needs. Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/dashboard"
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <FileText className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Services</span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div className="text-white/80">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">50K+</div>
                <div className="text-xs sm:text-sm">Happy Customers</div>
              </div>
              <div className="text-white/80">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">99.9%</div>
                <div className="text-xs sm:text-sm">Uptime</div>
              </div>
              <div className="text-white/80">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm">Support</div>
              </div>
              <div className="text-white/80">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">5★</div>
                <div className="text-xs sm:text-sm">Rating</div>
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
                <img src="/ghanaPublish-logo.png" className='w-16 h-16' alt="" />
              </div>
              <p className="text-gray-400">
                Official digital gazette services from Ghana E-Gazette.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Gazette Publications</li>
                <li>Name Changes</li>
                <li>Marriage Publications</li>
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
                <p>Ghana E-Gazette</p>
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

      {/* Gazette Type Selection Modal */}
      {showGazetteTypeModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Select Gazette Plan</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Choose your preferred gazette plan and processing option.</p>
            </div>

            <div className="p-6">
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading plans...</p>
                </div>
              ) : gazettePlans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No gazette plans available for this service</div>
                  <button
                    onClick={() => {
                      setShowGazetteTypeModal(false);
                      setSelectedService(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Back to Services
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    // Group plans by PaymentPlan
                    const groupedPlans = gazettePlans.reduce((groups, plan) => {
                      const planType = plan.PaymentPlan;
                      if (!groups[planType]) {
                        groups[planType] = [];
                      }
                      groups[planType].push(plan);
                      return groups;
                    }, {} as Record<string, any[]>);

                    // Define the order and colors for plan types
                    const planOrder = ['PREMIUM PLUS', 'PREMIUM GAZETTE', 'REGULAR GAZETTE'] as const;
                      
                    return planOrder.map((planType) => {
                      const plans = groupedPlans[planType];
                      if (!plans || plans.length === 0) return null;

                      return (
                        <div key={planType} className="space-y-3">
                          <div className={`bg-blue-600 text-white px-4 py-2 rounded-lg`}>
                            <h3 className="font-bold text-lg">{planType}</h3>
                            <p className="text-sm opacity-90">
                              {planType === 'PREMIUM PLUS' && 'Fastest processing with premium features'}
                              {planType === 'PREMIUM GAZETTE' && 'Balanced processing with enhanced features'}
                              {planType === 'REGULAR GAZETTE' && 'Standard processing with essential features'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plans.map((plan: any) => (
                              <div
                                key={plan.FeeID}
                                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => {
                                  setShowGazetteTypeModal(false);
                                  navigate(`/application/${selectedService.id}?plan=${plan.FeeID}`);
                                }}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                                      {plan.GazetteName}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Processing Time:</span>
                                      <span className="text-xs font-semibold text-gray-700">{plan.ProcessDays} days</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Fee:</span>
                                      <span className="text-xs font-bold text-green-600">₵{plan.GazetteFee.toLocaleString()}</span>
                                    </div>
                                  </div>
                                  
                                  {plan.GazetteDetails && (
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {plan.GazetteDetails}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;