// Stat Cards component
import { StatCardsContainer } from "../../components/StatCards";

const StudentStats = ({ activeUser }) => (
  <>
    {/* Stat Cards */}
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-[24px] sm:text-[32px] font-bold">PERFORMANCE OVERVIEW</h2>
      </div>
      <StatCardsContainer userId={activeUser} route={1} />
    </section>
  </>
);

export default StudentStats;