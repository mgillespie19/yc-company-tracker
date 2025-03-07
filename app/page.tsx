import { Suspense } from 'react';
import { fetchBatchData, fetchTopCompanies } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import { YCCompany } from '@/lib/types';

async function getData() {
  const batchData = await fetchBatchData('x25');
  const topCompanies = await fetchTopCompanies();
  
  return {
    batchData,
    topCompanies: topCompanies.slice(0, 100),
  };
}

export default async function Home() {
  const { batchData, topCompanies } = await getData();

  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard initialBatch={batchData} topCompanies={topCompanies} />
      </Suspense>
    </main>
  );
}