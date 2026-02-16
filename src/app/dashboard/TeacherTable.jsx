import { Download, Eye, Trash } from 'lucide-react';

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
export default TeacherTable;