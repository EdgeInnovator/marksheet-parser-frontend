import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { StatCardsDemo } from '../../components/StatCards';
import { getCokie } from '../utils/utils';

export default function StatCardsDemoPage() {
  const userData = JSON.parse(getCokie("ACTIVE_USER"));
  const userId = userData?.id;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <StatCardsDemo userId={userId} />
      </main>
      
      <Footer />
    </div>
  );
}
