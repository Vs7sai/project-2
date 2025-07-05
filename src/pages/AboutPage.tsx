import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Users, Award, MapPin, Phone, Mail, Globe, Building, CheckCircle, Star, Target, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import INRWatermark from '../components/ui/INRWatermark';

const AboutPage: React.FC = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      bio: "Former Goldman Sachs analyst with 12+ years in financial markets. MBA from IIM Bangalore.",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      linkedin: "https://linkedin.com/in/rajeshkumar"
    },
    {
      name: "Priya Sharma",
      role: "CTO & Co-Founder",
      bio: "Ex-Microsoft engineer specializing in fintech platforms. B.Tech from IIT Delhi.",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      linkedin: "https://linkedin.com/in/priyasharma"
    },
    {
      name: "Amit Patel",
      role: "Head of Product",
      bio: "Product management veteran from Paytm and PhonePe. Expert in user experience design.",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      linkedin: "https://linkedin.com/in/amitpatel"
    },
    {
      name: "Dr. Sneha Reddy",
      role: "Chief Compliance Officer",
      bio: "Former RBI official with expertise in financial regulations and compliance. PhD in Economics.",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      linkedin: "https://linkedin.com/in/snehareddy"
    }
  ];

  const milestones = [
    { year: "2023", event: "Company Founded", description: "RupeeRush was established with a vision to democratize financial education" },
    { year: "2023", event: "Seed Funding", description: "Raised ₹5 Cr in seed funding from prominent angel investors" },
    { year: "2024", event: "Beta Launch", description: "Launched beta version with 1,000+ early users" },
    { year: "2024", event: "Regulatory Approval", description: "Obtained necessary licenses and compliance certifications" },
    { year: "2024", event: "Public Launch", description: "Full platform launch with 50,000+ registered users" }
  ];

  const certifications = [
    { name: "ISO 27001", description: "Information Security Management", verified: true },
    { name: "SOC 2 Type II", description: "Security & Availability Controls", verified: true },
    { name: "PCI DSS", description: "Payment Card Industry Standards", verified: true },
    { name: "GDPR Compliant", description: "Data Protection Regulation", verified: true }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-purple-600'} py-16 relative overflow-hidden`}>
        <INRWatermark variant="section" opacity={0.05} animated={true} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About RupeeRush
            </motion.h1>
            <motion.p 
              className="text-lg text-white/80 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              India's first competitive virtual stock market gaming platform, designed to make investing 
              fun, educational, and rewarding for everyone.
            </motion.p>
            
            {/* Trust Badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm font-medium">RBI Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <span className="text-white text-sm font-medium">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white text-sm font-medium">50,000+ Users</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Mission & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <motion.div
                className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-blue-500" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  To democratize financial education by making stock market learning accessible, engaging, 
                  and rewarding for every Indian. We believe everyone deserves the opportunity to understand 
                  and participate in wealth creation through informed investing.
                </p>
              </motion.div>

              <motion.div
                className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  To become India's leading platform for financial literacy, empowering millions of users 
                  to make informed investment decisions through gamified learning experiences that bridge 
                  the gap between education and real-world application.
                </p>
              </motion.div>
            </div>

            {/* Company Details */}
            <motion.div
              className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-12`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building className="w-8 h-8 text-green-500" />
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Legal Name</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    RupeeRush Technologies Private Limited
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">CIN</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    U72900KA2023PTC123456
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">GST Number</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    29AABCR1234M1Z5
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Founded</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    March 2023
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Headquarters</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Bangalore, Karnataka, India
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Employees</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    25+ Team Members
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-12`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Phone className="w-8 h-8 text-blue-500" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Registered Office</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          RupeeRush Technologies Pvt Ltd<br />
                          #123, 4th Floor, Brigade Road<br />
                          Bangalore, Karnataka 560001<br />
                          India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <a href="tel:+918012345678" className="text-blue-500 hover:text-blue-600">
                        +91 80 1234 5678
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <a href="mailto:contact@rupeerush.org" className="text-blue-500 hover:text-blue-600">
                        contact@rupeerush.org
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Sunday:</strong> Closed
                    </p>
                  </div>
                  
                  <h3 className="font-semibold mb-4 mt-6">Support</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <a href="mailto:support@rupeerush.org" className="text-blue-500 hover:text-blue-600">
                        support@rupeerush.org
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        24/7 Customer Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                Our Leadership Team
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-blue-500 font-medium mb-3">{member.role}</p>
                    <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {member.bio}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Company Milestones */}
            <motion.div
              className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-12`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                Our Journey
              </h2>
              
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{milestone.event}</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-12`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                Certifications & Compliance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      cert.verified 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-300 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`w-5 h-5 ${cert.verified ? 'text-green-500' : 'text-gray-400'}`} />
                      <h3 className="font-bold">{cert.name}</h3>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Our Values
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Transparency</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    We believe in complete transparency in our operations, fees, and policies.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">User-Centric</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Every decision we make is centered around providing the best user experience.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Innovation</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    We continuously innovate to make financial education more accessible and engaging.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;