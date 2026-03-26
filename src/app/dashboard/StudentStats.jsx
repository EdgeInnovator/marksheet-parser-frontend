// Stat Cards component
import { StatCardsContainer } from "../../components/StatCards";

const StudentStats = ({ activeUser }) => (
  <>
    {/* Stat Cards */}
    
      
        <h2 className="text-[24px] sm:text-[32px] font-bold">PERFORMANCE OVERVIEW</h2>
      
      <StatCardsContainer userId={activeUser} route={1} />
    
  </>
);

export default StudentStats;