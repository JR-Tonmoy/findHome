import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-300 px-10 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-4 gap-10">
          {/* Column 1 */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">
              🏢 HouseRent BD
            </h2>

            <p className="text-sm leading-6">
              Find your perfect home easily. Connecting landlords and tenants
              across Bangladesh.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2">
             <li><Link to="/home">Home</Link></li> 
              <li><Link to="/browse Houses">Browse Houses</Link></li>
             <li><Link to="/post Property">Post Property</Link></li>
             <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Support</h3>

            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>

            <ul className="space-y-2">
              <li>📧 support@houserentbd.com</li>
              <li>📞 +880 1711-123456</li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          © 2026 HouseRent BD. All rights reserved.
        </div>
      </footer>
      );
    </div>
  );
};

export default Footer;
