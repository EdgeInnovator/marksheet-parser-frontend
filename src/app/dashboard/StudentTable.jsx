import { Download, Eye, Trash } from 'lucide-react';

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
export default StudentTable;
