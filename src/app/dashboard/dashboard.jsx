import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { getCokie } from '../utils/utils';
import { Download, Eye, Trash } from 'lucide-react';

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
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Chemistry</td>
          <td>Fall 2024</td>
          <td>B+</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PASSED</span>
          </td>
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
        <tr>
          <td className="p-4">Mathematics</td>
          <td>Fall 2024</td>
          <td>A-</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PASSED</span>
          </td>
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
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
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Chemistry_2024_Mid.pdf</td>
          <td>98</td>
          <td>2024-11-28</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PARSED</span>
          </td>
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="p-4">Math_2024_Final.pdf</td>
          <td>145</td>
          <td>2024-11-15</td>
          <td>
            <span className="bg-yellow-400 px-3 py-1 border border-black text-[10px] font-bold">PROCESSING</span>
          </td>
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
        <tr>
          <td className="p-4">English_2024_Sem2.pdf</td>
          <td>87</td>
          <td>2024-10-30</td>
          <td>
            <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">PARSED</span>
          </td>
          <td>
            <div className="flex gap-2">
              <Eye size={16}/>
              <Download size={16}/>
              <Trash size={16}/>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function Dashboard({ userRole = 'student' }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    console.log('File selected for upload:', file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      const response = await api({
        url: '/marksheet/upload',
        method: 'POST',
        data: formData,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Marksheet uploaded successfully!', {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
        
        // Store uploaded file info and clear selected file
        setUploadedFile(selectedFile);
        setSelectedFile(null);
        
        // You can refresh the table data here if needed
        console.log('Upload response:', response.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleParse = async () => {
    if (!uploadedFile) {
      toast.error('No file to parse', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    setIsParsing(true);

    try {
      const response = await api({
        url: '/marksheet/generate',
        method: 'POST',
        data: {
          filename: uploadedFile.name
        }
      });

      if (response.status === 200) {
        console.log('Parse Results (JSON):', JSON.stringify(response.data, null, 2));
        
        toast.success('Marksheet parsed successfully!', {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
        
        // Clear uploaded file after parsing
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Parse failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      {/* Navbar */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <nav className="space-x-8 text-[12px] font-semibold">
          <NavLink to="/dashboard" className="underline text-black no-underline">DASHBOARD</NavLink>
          <NavLink to="#" className="text-black no-underline">HISTORY</NavLink>
          <NavLink to="#" className="text-black no-underline">SETTINGS</NavLink>
          <NavLink to="/logout" className="text-black no-underline">Logout ↪</NavLink>
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
            <FileUpload onFileSelect={handleFileSelect} disabled={isUploading || isParsing} />
            
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-6 w-full bg-black text-[#b9f36a] px-6 py-3 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'UPLOADING...' : 'UPLOAD MARKSHEET ↗'}
              </button>
            )}
            
            {uploadedFile && (
              <div className="mt-6 w-full">
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 text-[10px] mb-4">
                  ✓ File uploaded: {uploadedFile.name}
                </div>
                <button
                  onClick={handleParse}
                  disabled={isParsing}
                  className="w-full bg-blue-600 text-white px-6 py-3 font-bold border-[2px] border-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isParsing ? 'PARSING...' : 'PARSE MARKSHEET'}
                </button>
              </div>
            )}
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
          <NavLink to="#" className="text-black no-underline">PRIVACY</NavLink>
          <span className="mx-4">·</span>
          <NavLink to="#" className="text-black no-underline">TERMS</NavLink>
          <span className="mx-4">·</span>
          <NavLink to="#" className="text-black no-underline">HELP</NavLink>
        </div>
      </footer>
    </div>
  );
}