import React from 'react';

// Role-specific components
const StudentStats = () => (
  <>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">12</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">MY SHEETS</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">3.8</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">AVG GPA</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">156</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">SUBJECTS</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">8</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">THIS SEM</p>
    </div>
  </>
);

const TeacherStats = () => (
  <>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">24</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">TOTAL SHEETS</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">2,847</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">STUDENTS PARSED</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">18</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">EXPORTS</p>
    </div>
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-[32px] font-bold">6</p>
      <p className="text-[11px] font-bold tracking-wide mt-2">THIS MONTH</p>
    </div>
  </>
);

const StudentCharts = () => (
  <>
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
        MY GRADES / SUBJECT
      </div>
      <div className="p-6 h-60 flex items-center justify-center text-gray-500">
        (Bar Chart Placeholder)
      </div>
    </div>
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
        GPA TREND
      </div>
      <div className="p-6 h-60 flex items-center justify-center text-gray-500">
        (Line Chart Placeholder)
      </div>
    </div>
  </>
);

const TeacherCharts = () => (
  <>
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
        SHEETS UPLOADED / MONTH
      </div>
      <div className="p-6 h-60 flex items-center justify-center text-gray-500">
        (Bar Chart Placeholder)
      </div>
    </div>
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
        STUDENTS PARSED / MONTH
      </div>
      <div className="p-6 h-60 flex items-center justify-center text-gray-500">
        (Line Chart Placeholder)
      </div>
    </div>
  </>
);

const StudentTable = () => (
  <div className="col-span-2 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
      MY RESULTS
    </div>
    <table className="w-full text-[12px]">
      <thead className="border-b-[3px] border-black">
        <tr className="text-left">
          <th className="p-4">SUBJECT</th>
          <th>SEMESTER</th>
          <th>GRADE</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-400">
          <td className="p-4">Physics</td>
          <td>Fall 2024</td>
          <td>A</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PASSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Chemistry</td>
          <td>Fall 2024</td>
          <td>B+</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PASSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
        <tr>
          <td className="p-4">Mathematics</td>
          <td>Fall 2024</td>
          <td>A-</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PASSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TeacherTable = () => (
  <div className="col-span-2 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
      RECENT MARKSHEETS
    </div>
    <table className="w-full text-[12px]">
      <thead className="border-b-[3px] border-black">
        <tr className="text-left">
          <th className="p-4">FILE</th>
          <th>STUDENTS</th>
          <th>DATE</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-400">
          <td className="p-4">Physics_2024_Sem1.pdf</td>
          <td>120</td>
          <td>2024-12-01</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PARSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Chemistry_2024_Mid.pdf</td>
          <td>98</td>
          <td>2024-11-28</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PARSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Math_2024_Final.pdf</td>
          <td>145</td>
          <td>2024-11-15</td>
          <td>
            <span className="bg-yellow-400 px-3 py-1 border border-black text-[10px] font-bold">PROCESSING</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
        <tr>
          <td className="p-4">English_2024_Sem2.pdf</td>
          <td>87</td>
          <td>2024-10-30</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PARSED</span>
          </td>
          <td>👁 ⬇ 🗑</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function Dashboard({ userRole = 'student' }) {
  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      {/* Navbar */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <nav className="space-x-8 text-[12px] font-semibold">
          <a href="#" className="underline text-black no-underline">DASHBOARD</a>
          <a href="#" className="text-black no-underline">HISTORY</a>
          <a href="#" className="text-black no-underline">SETTINGS</a>
          <a href="#" className="text-black no-underline">Logout ↪</a>
        </nav>
      </header>

      <main className="flex-1 px-[60px] py-[40px]">
        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[120px] leading-[0.9] font-extrabold m-0 max-[900px]:text-[72px]">
            DASH <br />BOARD<span>.</span>
          </h1>
          <p className="text-[24px] font-bold mt-4">
            {userRole === 'student' ? 'TRACK MY PROGRESS.' : 'ANALYZE SMARTER.'}
          </p>
          <div className="mt-10 flex gap-4">
            <span className="w-1 bg-black" />
            <p className="max-w-[360px] text-[16px] leading-[1.6]">
              {userRole === 'student' 
                ? 'View your grades, track academic progress, and download your marksheet records.'
                : 'Track your marksheets, monitor parsing progress, and export structured data efficiently.'
              }
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-4 gap-8 mb-10">
          {userRole === 'student' ? <StudentStats /> : <TeacherStats />}
        </section>

        {/* Upload + Table */}
        <section className="grid grid-cols-3 gap-8 mb-10">
          <div className="bg-white text-black p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center text-center">
            <div className="text-5xl mb-4 text-[#b9f36a]">
              ⬆
            </div>
            <h3 className="font-bold tracking-widest text-[14px]">
              UPLOAD MARKSHEET
            </h3>
            <p className="text-[11px] mt-2">
              Upload your marksheet to get detailed reports and analysis
            </p>
            <button className="mt-6 bg-[#b9f36a] text-black px-6 py-3 font-bold border-[2px] border-black">
              CHOOSE FILE ↗
            </button>
          </div>

          {userRole === 'student' ? <StudentTable /> : <TeacherTable />}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-2 gap-8 mb-10">
          {userRole === 'student' ? <StudentCharts /> : <TeacherCharts />}
        </section>

        <section className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
              {userRole === 'student' ? 'SUBJECT PERFORMANCE' : 'SUBJECT PERFORMANCE'}
            </div>
            <div className="p-6 h-60 flex items-center justify-center text-gray-500">
              (Radar Chart Placeholder)
            </div>
          </div>

          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
              {userRole === 'student' ? 'GRADE DISTRIBUTION' : 'PARSED VS FAILED'}
            </div>
            <div className="p-6 h-60 flex items-center justify-center text-gray-500">
              (Area Chart Placeholder)
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex justify-between px-[60px] py-[30px] border-t-[3px] border-black text-[11px] font-semibold">
        <div> 2024 MARKSHEET PARSER</div>
        <div>
          <a href="#" className="text-black no-underline">PRIVACY</a>
          <span className="mx-4">·</span>
          <a href="#" className="text-black no-underline">TERMS</a>
          <span className="mx-4">·</span>
          <a href="#" className="text-black no-underline">HELP</a>
        </div>
      </footer>
    </div>
  );
}