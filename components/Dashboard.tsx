'use client';

import { useEffect } from 'react';
import { YCCompany } from '@/lib/types';
import { useYCStore } from '@/lib/store';
import { calculateBatchStats, fetchBatchData } from '@/lib/api';
import BatchSelector from './BatchSelector';
import StatsOverview from './StatsOverview';
import CompanyList from './CompanyList';
import TopCompanies from './TopCompanies';
import IndustryChart from './IndustryChart';
import IndustryTrends from './IndustryTrends';
import { Card } from './ui/card';
import { calculateIndustryTrends } from '@/lib/api';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';
import { BackgroundBeamsDemo } from './ui/background-beams-demo';

interface DashboardProps {
  initialBatch: YCCompany[];
  topCompanies: YCCompany[];
}

export default function Dashboard({ initialBatch, topCompanies }: DashboardProps) {
  const { 
    // Single batch selection (for batch analytics)
    setBatchData, 
    selectedBatch, 
    batchData,
    // Multi-batch selection (for graph - completely separate)
    comparedBatches,
    graphBatchData,
    setGraphBatchData
  } = useYCStore();

  // Initialize single batch data
  useEffect(() => {
    setBatchData({ [selectedBatch]: initialBatch });
  }, [initialBatch, setBatchData, selectedBatch]);

  // Load data for the main batch selector
  useEffect(() => {
    async function loadBatchData() {
      if (!batchData[selectedBatch]) {
        try {
          const data = await fetchBatchData(selectedBatch);
          setBatchData(prevData => ({
            ...prevData,
            [selectedBatch]: data
          }));
        } catch (error) {
          console.error(`Error fetching data for selected batch ${selectedBatch}:`, error);
        }
      }
    }
    loadBatchData();
  }, [selectedBatch, setBatchData]);

  // Load data for graph comparison (completely separate)
  useEffect(() => {
    async function loadComparedBatches() {
      for (const batch of comparedBatches) {
        if (!graphBatchData[batch]) {
          try {
            const data = await fetchBatchData(batch);
            // Use a functional update to avoid stale state issues
            setGraphBatchData(prevData => ({
              ...prevData,
              [batch]: data
            }));
          } catch (error) {
            console.error(`Error fetching data for graph batch ${batch}:`, error);
          }
        }
      }
    }
    loadComparedBatches();
  }, [comparedBatches, graphBatchData, setGraphBatchData]);

  const currentBatchData = batchData[selectedBatch] || initialBatch;
  const stats = calculateBatchStats(currentBatchData);
  const industryTrends = calculateIndustryTrends(graphBatchData); // Use graphBatchData instead of batchData

  return (
    <div className="container mx-auto py-8 px-4">
      <BackgroundBeamsDemo className="mb-12 border-b border-muted">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            YC Analytics Dashboard
          </h1>
          <p className="text-center max-w-2xl mx-auto">
            YC's past, present, and future{' '}
            <span className="font-bold bg-gradient-to-r from-[#ff4b1f] to-[#ff9068] bg-clip-text text-transparent">
              at a glance
            </span>
          </p>
        </div>
      </BackgroundBeamsDemo>

      <div className="flex flex-col gap-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Batch Analytics</h2>
            <BatchSelector />
          </div>
          
          <StatsOverview stats={stats} />

          <div className="w-full">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Industry Breakdown</h2>
              <IndustryChart data={stats.industryBreakdown} />
            </Card>
            
            <div className="mt-8">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Companies in {selectedBatch}</h2>
                <CompanyList companies={currentBatchData} />
              </Card>
            </div>
          </div>
        </div>

        <div className="py-12">
          <h2 className="text-2xl font-semibold mb-8">Top YC Companies</h2>
          <InfiniteMovingCards
            items={topCompanies.map(company => ({
              name: company.name,
              description: company.one_liner,
              logo: company.small_logo_thumb_url,
              website: company.website,
              teamSize: company.team_size,
              stage: company.stage,
            }))}
            speed="slow"
            className="py-4"
          />
        </div>

        <div className="space-y-8 mt-8">
          <h2 className="text-2xl font-semibold">Multi-Batch Analytics</h2>
          {industryTrends.length > 0 ? (
            <IndustryTrends 
              trends={industryTrends} 
              batchData={graphBatchData} // Pass graphBatchData explicitly
            />
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                Loading batch data for comparison...
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}