import z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./signup.css";
import {api} from "../config/axiosSetup";
import { useNavigate, NavLink } from "react-router-dom";
import { setCokie, getCokie } from "../utils/utils";

export default function Signup() {
  const navigate = useNavigate();
  const signupEndpoint ="/auth/signup";
  const RoleSchema = z.enum(["student","staff"]);
  //creating the schema for signup form using zod
  const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: RoleSchema,
  });

  const {
    register,handleSubmit,formState:{errors},reset
  } = useForm({
    resolver:zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    try {
    
      const response = await api({
        url: signupEndpoint,
        method: 'POST',
        data: data
      })
      if(response.status === 201){
        // Store access token in cookie for 48 hours
        if(response.data && response.data.access_token) {
          setCokie('access_token', response.data.access_token, 2); // 2 days = 48 hours
        }
        
        // Fetch user role from /auth/me endpoint
        try {
          const userResponse = await api({
            url: '/auth/me',
            method: 'GET'
          });
          
          if(userResponse.status === 200 && userResponse.data) {
            // Store user data in ACTIVE_USER cookie
            setCokie('ACTIVE_USER', JSON.stringify(userResponse.data), 2);
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Still proceed to dashboard even if user data fetch fails
        }
        
        toast.success('Signup successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Clear form fields after successful submission
        reset();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Show error toast
      toast.error('Signup failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      {/* Header */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <NavLink
          to="/login"
          className="text-[12px] font-semibold no-underline text-black"
        >
          LOGIN ↗
        </NavLink>
      </header>

      {/* Main */}
      <main className="flex-1 flex px-[60px] py-[40px] max-[900px]:flex-col">
        {/* Main */}
    
        {/* Left */}
        <section className="flex-1">
          <h1 className="text-[120px] leading-[0.9] font-extrabold m-0 max-[900px]:text-[72px]">
            SIGN <br /> UP<span>.</span>
          </h1>

          <p className="text-[24px] font-bold mt-4">PARSE SMARTER.</p>
          <div className="mt-10 flex gap-4">
            <span className="w-1 bg-black" />
            <p className="max-w-[360px] text-[16px] leading-[1.6]">
              Create your account to upload marksheets, analyze results, and
              export structured data.
            </p>
          </div>
        </section>

        {/* Right */}
        <section className="flex-1 flex justify-center items-center max-[900px]:mt-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white border-[3px] border-black p-10 w-[420px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-[11px] font-bold tracking-wide mb-2">
              NAME
            </label>
            <input
              {...register("name")}
              placeholder="you"
              className={`w-full p-[14px] border-[3px] ${
                errors.name ? 'border-red-500' : 'border-black'
              } text-[14px] mb-2 placeholder:text-[#999]`}
            />
            {errors.name && (
              <p className="text-red-500 text-[11px] mb-6">
                {errors.name.message}
              </p>
            )}
            <label className="block text-[11px] font-bold tracking-wide mb-2">
              ROLE
            </label>
            <select {...register("role")}  className={`w-full p-[14px] border-[3px] ${
                errors.role ? 'border-red-500' : 'border-black'
              } text-[14px] mb-2 placeholder:text-[#999]`}>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-[11px] mb-6">
                {errors.role.message}
              </p>
            )}
            <label className="block text-[11px] font-bold tracking-wide mb-2">
              EMAIL ADDRESS
            </label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full p-[14px] border-[3px] ${
                errors.email ? 'border-red-500' : 'border-black'
              } text-[14px] mb-2 placeholder:text-[#999]`}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mb-6">
                {errors.email.message}
              </p>
            )}

            <label className="block text-[11px] font-bold tracking-wide mb-2">
              PASSWORD
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="•••••••"
              className={`w-full p-[14px] border-[3px] ${
                errors.password ? 'border-red-500' : 'border-black'
              } text-[14px] mb-2 placeholder:text-[#999]`}
            />
            {errors.password && (
              <p className="text-red-500 text-[11px] mb-6">
                {errors.password.message}
              </p>
            )}

            <button className="w-full p-[18px] bg-black text-[#b9f36a] font-bold cursor-pointer">
              SUBMIT ↗
            </button>

            {/* Divider */}
            <div className="h-[2px] bg-black my-[30px]" />

            <p className="text-center text-[12px] font-semibold">
              ALREADY HAVE AN ACCOUNT?{" "}
              <NavLink to="/login" className="underline">
                LOGIN
              </NavLink>
            </p>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-[60px] py-[30px] border-t-[3px] border-black  text-[11px] font-semibold flex justify-between">
        <div>© 2026 MARKSHEET PARSER</div>
        <div>
          <a href="">
            About Us
          </a>
        </div>
      </footer>
    </div>
  );
}
