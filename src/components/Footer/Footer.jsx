import * as React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import Constants from '../Constants';
import ModalLoginSignUp from '../Modals/LoginSignUp/ModalLoginSignUp';

function Footer(props) {
  require('dotenv').config();

  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * Calculate the year for the copyright in the footer
   *
   * @returns
   */
  function getYear() {
    const date = new Date();
    const year = date.getFullYear();
    return year;
  }

  return (
    <div className="footer py-8 relative bg-field-500 lg:bg-field-200">

      {/* Mobile / Tablet Footer */}
      <div className="text-center max-w-lg mx-auto lg:hidden">
        <p className="font-semibold text-2xl">The Giving Tree</p>
        <p className="text-lg mb-6">Copyright &copy; {getYear()}</p>
        <div className="flex items-center justify-center">
          <Link to={Constants.PATHS.PRIVACY} 
          className="px-4 border-r border-black">Privacy</Link>
          <Link to={Constants.PATHS.TERMS} 
          className="px-4 border-r border-black">Terms of use</Link>
          <a href="mailto:team.givingtree@gmail.com"
          className="px-4">Email us</a>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden lg:grid grid-flow-row lg:grid-cols-4 gap-4 px-6
      max-w-screen-lg mx-auto">
        <div>
          <Link to="/about#about-us">
            <div className="uppercase mb-6">The Giving Tree</div>
          </Link>
          <Link to="/about#about-us">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              About Us
            </div>
          </Link>
          <Link to="/about#contact-us">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Contact Us
            </div>
          </Link>
          <Link to="/about#privacy-policy">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Privacy Policy
            </div>
          </Link>
          <Link to="/about">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Terms of use
            </div>
          </Link>
          <Link to="#">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Hotline: +1 415-964-4261
            </div>
          </Link>
        </div>
        <div>
          <Link to="/how-it-works">
            <div className="uppercase mb-6">How It Works</div>
          </Link>
          <Link to="/how-it-works#faqs">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              FAQs
            </div>
          </Link>
          <Link to="/how-it-works#how-to-provide-help">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              How to Help
            </div>
          </Link>
          <Link to="/how-it-works#how-to-request-help">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              How to Get Help
            </div>
          </Link>
        </div>
        <div>
          <Link to="/guidelines#health-and-safety">
            <div className="uppercase mb-6">Guidelines</div>
          </Link>
          <Link to="/guidelines#health-and-safety">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Health and Safety
            </div>
          </Link>
          <Link to="/guidelines#community">
            <div className="footer-text font-light mb-3 hover:text-green-600 transition duration-150">
              Community
            </div>
          </Link>
        </div>
        <div className="">
          <ModalLoginSignUp isOpen={isOpen} setIsOpen={setIsOpen} 
          type={`signup`}/>
          <p className="uppercase mb-6 mb-3">Get started</p>
          <button onClick={() => setIsOpen(true)}
            className="hover:bg-green-700 hover:text-white text-green-700 
            font-semibold py-1 px-8 rounded-md bg-white border border-green-500
            text-sm w-40 inline-block text-center">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
