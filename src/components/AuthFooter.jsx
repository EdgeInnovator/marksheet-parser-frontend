import { NavLink } from "react-router-dom";

const AuthFooter = () => {
  return (
    <footer className="px-[20px] sm:px-[40px] lg:px-[60px] py-[20px] sm:py-[30px] border-t-[3px] border-black text-[10px] sm:text-[11px] font-semibold flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
      <div>© 2026 MARKSHEET PARSER</div>
      <div>
        <NavLink to="/about-us" className="no-underline text-black">
          About Us
        </NavLink>
      </div>
    </footer>
  );
};

export default AuthFooter;
