import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Mail, Phone, MapPin, Shield, Award, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '/about#contact' },
        { name: 'Press', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '#' },
        { name: 'Help Center', href: '#' },
        { name: 'FAQs', href: '#' },
        { name: 'Trading Guide', href: '/research' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Trading Disclaimers', href: '/disclaimers' },
        { name: 'Compliance', href: '/compliance' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Twitter size={20} />, href: 'https://twitter.com/rupeerush' },
    { icon: <Facebook size={20} />, href: 'https://facebook.com/rupeerush' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com/rupeerush' },
  ];

  const trustBadges = [
    { icon: <Shield size={16} />, text: 'RBI Compliant' },
    { icon: <CheckCircle size={16} />, text: 'ISO 27001 Certified' },
    { icon: <Award size={16} />, text: 'SOC 2 Type II' },
  ];

  return (
    <footer className={`border-t ${theme === 'dark' ? 'bg-gray-900 border-orange-500/20' : 'bg-white border-orange-200'}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              RupeeRush is India's most vibrant fantasy trading platform where you can compete with others
              using virtual money and win real rupees based on your trading skills.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' 
                      ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {badge.icon}
                  {badge.text}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-orange-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-orange-100'
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className={`transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-orange-400'
                            : 'text-gray-600 hover:text-orange-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className={`transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-orange-400'
                            : 'text-gray-600 hover:text-orange-600'
                        }`}
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Company Information */}
        <div className={`border-t mt-8 pt-8 ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-orange-500" />
                Registered Office
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                RupeeRush Technologies Pvt Ltd<br />
                #123, 4th Floor, Brigade Road<br />
                Bangalore, Karnataka 560001, India
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Phone size={16} className="text-orange-500" />
                Contact Information
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Phone: <a href="tel:+918012345678" className="text-orange-500 hover:text-orange-600">+91 80 1234 5678</a><br />
                Email: <a href="mailto:contact@rupeerush.org" className="text-orange-500 hover:text-orange-600">contact@rupeerush.org</a><br />
                Support: <a href="mailto:support@rupeerush.org" className="text-orange-500 hover:text-orange-600">support@rupeerush.org</a>
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Legal Information</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                CIN: U72900KA2023PTC123456<br />
                GST: 29AABCR1234M1Z5<br />
                Founded: March 2023
              </p>
            </div>
          </div>
        </div>

        <div className={`border-t pt-8 ${theme === 'dark' ? 'border-orange-500/20' : 'border-orange-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} RupeeRush Technologies Private Limited. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                to="/terms"
                className={`text-sm transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-orange-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className={`text-sm transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-orange-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                Privacy
              </Link>
              <Link
                to="/disclaimers"
                className={`text-sm transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-orange-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                Disclaimers
              </Link>
              <Link
                to="/compliance"
                className={`text-sm transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-orange-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;