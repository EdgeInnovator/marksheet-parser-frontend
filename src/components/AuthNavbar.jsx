import { NavLink } from "react-router-dom";

const AuthNavbar = ({ authType = "login" }) => {
  return (
    <header className="px-[20px] sm:px-[40px] lg:px-[60px] py-[20px] sm:py-[40px] flex justify-between items-center">
      <div className="flex items-center gap-3 font-bold">
        <span className="w-6 h-6 sm:w-8 h-8 bg-black block" />
        <span className="text-sm sm:text-base">M. PARSER</span>
      </div>
      <NavLink
        to={authType === "login" ? "/signup" : "/login"}
        className="text-[12px] font-semibold no-underline text-black sm:text-base"
      >
        {authType === "login" ? "SIGNUP ↗" : "LOGIN ↗"}
      </NavLink>
    </header>
  );
};

export default AuthNavbar;
