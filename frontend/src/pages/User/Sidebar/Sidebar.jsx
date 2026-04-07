import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r fixed left-0 top-0">

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">
          🏠 BashaLagbe?
        </h1>
        <p className="text-sm text-gray-500">
          HOUSE RENT SOLUTION
        </p>
      </div>

      <ul className="p-4 space-y-2">

        <li>
          <NavLink
            to="/dashboard"
            className="block px-4 py-3 rounded-lg bg-blue-600 text-white"
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/browse"
            className="block px-4 py-3 rounded-lg hover:bg-gray-200"
          >
            Browse Houses
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/requests"
            className="block px-4 py-3 rounded-lg hover:bg-gray-200"
          >
            My Requests
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/saved"
            className="block px-4 py-3 rounded-lg hover:bg-gray-200"
          >
            Saved Houses
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/profile"
            className="block px-4 py-3 rounded-lg hover:bg-gray-200"
          >
            Profile
          </NavLink>
        </li>

      </ul>

    </div>
  );
};

export default Sidebar;