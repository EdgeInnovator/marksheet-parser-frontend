import { NavLink } from "react-router-dom";

const Navbar = ({ userRole = "student" }) => {
  return (
    <header className="px-[20px] sm:px-[40px] py-[20px] sm:py-[40px] flex justify-between items-center">
      <div className="flex items-center gap-3 font-bold">
        <span className="w-6 h-6 sm:w-8 h-8 bg-black block" />
        <span className="text-sm sm:text-base">M. PARSER</span>
      </div>

      <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-[10px] sm:text-[12px] font-semibold">
        <NavLink to="/dashboard">DASHBOARD</NavLink>
        {userRole === "student" && (
          <NavLink to="/student-charts">CHARTS</NavLink>
        )}
        {userRole === "staff" && (
          <NavLink to="/teacher-analytics">ANALYTICS</NavLink>
        )}
        <NavLink to="/about-us">ABOUT US</NavLink>
        <NavLink to="/logout">LOGOUT</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
