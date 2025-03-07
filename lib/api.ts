import { YCCompany, BatchStats, IndustryBreakdown, IndustryTrend } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function fetchBatchData(batchId: string): Promise<YCCompany[]> {
  try {
    // Normalize batch ID format (ensure lowercase for API URL)
    const normalizedBatchId = batchId.toLowerCase();
    
    // Check if the batch is available in the API
    // The API serves batches from S05 to W25, plus X25, F24, IK12 and 'unspecified'
    const validBatches = [
      'w25', 'x25', 'w24', 's24', 'f24', 'w23', 's23', 'w22', 's22',
      'w21', 's21', 'w20', 's20', 's19', 'w19', 'w18', 's18', 's17',
      'w17', 'w16', 's16', 'w15', 's15', 'w14', 's14', 'w13', 's13',
      'w12', 's12', 's11', 'w11', 's10', 'w10', 's09', 'w09', 's08',
      'w08', 's07', 'w07', 's06', 'w06', 's05', 'ik12', 'unspecified'
    ];
    
    if (!validBatches.includes(normalizedBatchId)) {
      return [];
    }

    const response = await fetchWithRetry(
      `https://yc-oss.github.io/api/batches/${normalizedBatchId}.json`
    );

    const data = await response.json();
    
    // Ensure each company has the correct batch property
    return data.map((company: YCCompany) => ({
      ...company,
      batch: batchId // Ensure the batch property is set correctly
    }));
  } catch (error) {
    console.error(`Error fetching batch ${batchId}:`, error);
    return [];
  }
}

export async function fetchTopCompanies(): Promise<YCCompany[]> {
  try {
    const response = await fetchWithRetry('https://yc-oss.github.io/api/companies/top.json');
    return response.json();
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return [];
  }
}

export function calculateBatchStats(companies: YCCompany[]): BatchStats {
  const industryCount: { [key: string]: number } = {};
  let activeCount = 0;
  let totalTeamSize = 0;
  let companiesWithTeamSize = 0;
  let hiringCount = 0;

  companies.forEach((company) => {
    // Count industries
    company.industries?.forEach((industry) => {
      industryCount[industry] = (industryCount[industry] || 0) + 1;
    });

    // Count active companies
    if (company.status === 'Active') activeCount++;

    // Sum team sizes
    if (company.team_size) {
      totalTeamSize += company.team_size;
      companiesWithTeamSize++;
    }

    // Count hiring companies
    if (company.isHiring) hiringCount++;
  });

  const industryBreakdown: IndustryBreakdown[] = Object.entries(industryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalCompanies: companies.length,
    activeCompanies: activeCount,
    avgTeamSize: companiesWithTeamSize ? Math.round(totalTeamSize / companiesWithTeamSize) : 0,
    hiringCount,
    industryBreakdown,
  };
}

export function calculateIndustryTrends(batchData: { [key: string]: YCCompany[] }): IndustryTrend[] {
  return Object.entries(batchData)
    .filter(([_, companies]) => companies && companies.length > 0) // Skip empty batches
    .map(([batch, companies]) => {
      const industryCount: { [key: string]: number } = {};
      
      companies.forEach(company => {
        company.industries?.forEach(industry => {
          industryCount[industry] = (industryCount[industry] || 0) + 1;
        });
      });

      const industries = Object.entries(industryCount)
        .map(([name, count]) => ({
          name,
          count,
          percentage: (count / companies.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        batch,
        industries
      };
    })
    .sort((a, b) => {
      // Define batch order for sorting (most recent first)
      const batchOrder = ['X25', 'W25', 'W24', 'S24', 'F24', 'W23', 'S23', 'W22', 'S22',
        'W21', 'S21', 'W20', 'S20', 'S19', 'W19', 'W18', 'S18', 'S17',
        'W17', 'W16', 'S16', 'W15', 'S15', 'W14', 'S14', 'W13', 'S13',
        'W12', 'S12', 'S11', 'W11', 'S10', 'W10', 'S09', 'W09', 'S08',
        'W08', 'S07', 'W07', 'S06', 'W06', 'S05', 'IK12'];
      
      // Use the predefined order for sorting
      const indexA = batchOrder.indexOf(a.batch);
      const indexB = batchOrder.indexOf(b.batch);
      
      // If both batches are found in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB; // Lower index (more recent) comes first
      }
      
      // If only one batch is found, prioritize the one in the order array
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order array, sort alphabetically as fallback
      return a.batch.localeCompare(b.batch);
    });
}