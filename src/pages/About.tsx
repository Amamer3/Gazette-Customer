import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Clock, Shield, FileText, Phone, Mail, MapPin, Heart, Building, User, Briefcase, Church } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
            <Award className="w-4 h-4 mr-2" />
            About Ghana Publishing Company
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            About Ghana Publishing Company
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for official gazette publications and government services since 1965
          </p>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our History & Legacy
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Ghana Publishing Company (formerly called Ghana Publishing Corporation) was incorporated on March 9, 1965 under Legislative Instrument No. 413, and subsequently amended by L.I. 672 of December 11, 1970 to take over the functions of the former Government Printing Department and the Administration of the Government Free Textbook Schemes.
                </p>
                <p>
                  The Assembly Press was converted into a Limited Liability Company under the Statutory Corporations (Conversion to Companies) Act 461, 1993, and re-named Ghana Publishing Company Limited in 2007.
                </p>
                <p>
                  We exist primarily to print and publish very high quality books and stationery for Educational Institutions, Government Departments and the General Public at competitive prices.
                </p>
                <p className="font-semibold text-violet-700 text-lg">
                  We aim at nothing but the best in all our Services. As a Printing and Publishing Company, our values drive us to offer World Class Services to our clients and the General Public.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1965</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Company Founded</h4>
                    <p className="text-gray-600 text-sm">Incorporated under Legislative Instrument No. 413</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1970</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Expanded Mandate</h4>
                    <p className="text-gray-600 text-sm">Amended by L.I. 672 to include Government Free Textbook Schemes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1993</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Corporate Conversion</h4>
                    <p className="text-gray-600 text-sm">Converted to Limited Liability Company under Act 461</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2007</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Modern Era</h4>
                    <p className="text-gray-600 text-sm">Re-named Ghana Publishing Company Limited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Committed to excellence in publishing and government services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide world-class printing and publishing services for Educational Institutions, Government Departments, and the General Public at competitive prices, while maintaining the highest standards of quality and service excellence.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading publishing company in Ghana, recognized for innovation, reliability, and commitment to serving the nation's educational and governmental needs through digital transformation and traditional excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our E-Gazette Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital solutions for all your official gazette needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Marriage Officer Appointments',
                description: 'Official appointment of marriage officers for religious institutions',
                color: 'from-pink-500 to-rose-500'
              },
              {
                icon: Building,
                title: 'Company Name Changes',
                description: 'Official change of name for registered companies and institutions',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: User,
                title: 'Personal Name Changes',
                description: 'Official name change or date of birth correction services',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Briefcase,
                title: 'Company Incorporation',
                description: 'Official incorporation and commencement of business companies',
                color: 'from-purple-500 to-violet-500'
              },
              {
                icon: Church,
                title: 'Worship Place Licensing',
                description: 'Licensing of public places of worship for marriage ceremonies',
                color: 'from-orange-500 to-amber-500'
              },
              {
                icon: FileText,
                title: 'Document Services',
                description: 'Comprehensive document processing and verification services',
                color: 'from-indigo-500 to-blue-500'
              }
            ].map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ghana Publishing Company?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Decades of experience and commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Processing</h3>
              <p className="text-gray-600">
                Quick turnaround times with efficient processing systems and dedicated support teams
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h3>
              <p className="text-gray-600">
                Bank-level security with encrypted data transmission and secure document handling
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600">
                Professional guidance from experienced staff who understand government processes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team for any questions or support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+233 XXX XXX XXX</p>
              <p className="text-gray-600">+233 XXX XXX XXX</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@egazette.gov.gh</p>
              <p className="text-gray-600">support@egazette.gov.gh</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">Ghana Publishing Company Ltd</p>
              <p className="text-gray-600">Accra, Ghana</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the convenience of our digital gazette services. Join thousands of satisfied customers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Get Started 
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button
              onClick={() => window.location.href = '/#services-section'}
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              View Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
