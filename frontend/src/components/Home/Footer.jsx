import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 mt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            About BashaLagbe
          </h2>
          <p className="text-white text-sm leading-6 max-w-sm">
            Bangladesh's leading online platform for finding rental properties.
            Connect tenants with property owners easily.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm text-white">
            <li>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>
            </li>
            <li>
              <Link to="/dashboard/browse" className="hover:text-blue-600">
                Browse Properties
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-white">
            <li>Email: info@bashalagbe.com</li>
            <li>Phone: +880 1234-567890</li>
            <li>Address: Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-white mt-12 pt-6 text-center text-sm text-white">
        © 2026 BashaLagbe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
