import React from 'react';
import { NavLink } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      {/* Navbar */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <nav className="space-x-8 text-[12px] font-semibold">
          <NavLink to="/dashboard" className="text-black no-underline">DASHBOARD</NavLink>
          <NavLink to="/about-us" className="underline text-black no-underline">ABOUT US</NavLink>
          <NavLink to="#" className="text-black no-underline">HISTORY</NavLink>
          <NavLink to="#" className="text-black no-underline">SETTINGS</NavLink>
          <NavLink to="/logout" className="text-black no-underline">Logout</NavLink>
        </nav>
      </header>

      <main className="flex-1 px-[60px] py-[40px]">
        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[120px] leading-[0.9] font-extrabold m-0 max-[900px]:text-[72px]">
            ABOUT <br />US<span>.</span>
          </h1>
          <p className="text-[24px] font-bold mt-4">MEET THE TEAM.</p>
          <div className="mt-10 flex gap-4">
            <span className="w-1 bg-black" />
            <p className="max-w-[360px] text-[16px] leading-[1.6]">
              We're a team of passionate developers dedicated to revolutionizing academic record management through intelligent parsing technology.
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="grid grid-cols-4 gap-8 mb-10">
          {/* Team Member 1 */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/src/assets/teamPhoto.jpg" 
              alt="Soumya Dedhia" 
              className="w-full h-48 object-cover mb-4 border-2 border-black"
            />
            <h3 className="text-[18px] font-bold mb-2">Soumya Dedhia</h3>
            <p className="text-[12px] text-gray-600 mb-3">Forever Student of Technology</p>
            <p className="text-[11px] leading-[1.5]">
              Final Year Diploma in Computer Engineering Student.
            </p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/src/assets/teamPhoto.jpg" 
              alt="Rutraj Vishwamitre" 
              className="w-full h-48 object-cover mb-4 border-2 border-black"
            />
            <h3 className="text-[18px] font-bold mb-2">Rutraj Vishwamitre</h3>
            <p className="text-[12px] text-gray-600 mb-3">Backend Parsing Technology</p>
            <p className="text-[11px] leading-[1.5]">
              implemented parsing logic and integration of parser with frontend.
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/src/assets/teamPhoto.jpg" 
              alt="Ayush Gurav" 
              className="w-full h-48 object-cover mb-4 border-2 border-black"
            />
            <h3 className="text-[18px] font-bold mb-2">Ayush Gurav</h3>
            <p className="text-[12px] text-gray-600 mb-3">Backend Developer</p>
            <p className="text-[11px] leading-[1.5]">
              Implemented backend logic and integration of parser with frontend.
            </p>
          </div>
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/src/assets/teamPhoto.jpg" 
              alt="Alark Mahatre" 
              className="w-full h-48 object-cover mb-4 border-2 border-black"
            />
            <h3 className="text-[18px] font-bold mb-2">Alark Mahatre</h3>
            <p className="text-[12px] text-gray-600 mb-3">Student</p>
            <p className="text-[11px] leading-[1.5]">
              Documentation 
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
              OUR MISSION
            </div>
            <div className="p-6">
              <p className="text-[14px] leading-[1.6]">
                To simplify academic record management through intelligent parsing technology, 
                making it easier for students and educators to track, analyze, and share 
                academic achievements seamlessly.
              </p>
            </div>
          </div>

          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
              OUR VISION
            </div>
            <div className="p-6">
              <p className="text-[14px] leading-[1.6]">
                To become the leading platform for academic data management, 
                empowering educational institutions worldwide with cutting-edge 
                parsing and analytics capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        
      </main>

      {/* Footer */}
      <footer className="flex justify-between px-[60px] py-[30px] border-t-[3px] border-black text-[11px] font-semibold">
              <div> 2026 MARKSHEET PARSER</div>
              <div>
                <NavLink to="/about-us" className="text-black no-underline">ABOUT US</NavLink>
              </div>
            </footer>
    </div>
  );
}
