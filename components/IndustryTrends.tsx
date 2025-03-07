import { IndustryTrend, YCCompany } from '@/lib/types';
import { useYCStore } from '@/lib/store';
import { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';
import { BatchSelector } from '@/components/BatchSelector';
import { memo } from 'react';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

const CustomXAxis = memo(function CustomXAxis(props: any) {
  return (
    <XAxis
      {...props}
      stroke="hsl(var(--foreground))"
      tick={{ fill: 'hsl(var(--foreground))' }}
    />
  );
});

const CustomYAxis = memo(function CustomYAxis(props: any) {
  return (
    <YAxis
      {...props}
      stroke="hsl(var(--foreground))"
      tick={{ fill: 'hsl(var(--foreground))' }}
      unit="%"
    />
  );
});

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius)',
  },
  itemStyle: {
    color: 'hsl(var(--foreground))',
  },
  labelStyle: {
    color: 'hsl(var(--foreground))',
    fontWeight: 'bold',
  },
};

interface IndustryTrendsProps {
  trends: IndustryTrend[];
  batchData?: { [key: string]: YCCompany[] }; // Optional batch data for direct access
}

export default function IndustryTrends({ trends, batchData }: IndustryTrendsProps) {
  // Use store for UI interactions only, not for data dependencies
  const { comparedBatches, addBatchToCompare, removeBatchFromCompare } = useYCStore();
  const [batchMapping, setBatchMapping] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const mapping: {[key: string]: string} = {};
    comparedBatches.forEach((batch, index) => {
      mapping[index.toString()] = batch;
    });
    setBatchMapping(mapping);
  }, [comparedBatches]);
  
  const { filteredTrends, topIndustries, chartData } = useMemo(() => {
    const filtered = trends.filter(trend => comparedBatches.includes(trend.batch));
    const industries = new Set<string>();
    
    filtered.forEach(trend => {
      trend.industries.forEach(industry => {
        industries.add(industry.name);
      });
    });

    // Define batch order for sorting (most recent first)
    const batchOrder = ['X25', 'W25', 'W24', 'S24', 'F24', 'W23', 'S23', 'W22', 'S22',
      'W21', 'S21', 'W20', 'S20', 'S19', 'W19', 'W18', 'S18', 'S17',
      'W17', 'W16', 'S16', 'W15', 'S15', 'W14', 'S14', 'W13', 'S13',
      'W12', 'S12', 'S11', 'W11', 'S10', 'W10', 'S09', 'W09', 'S08',
      'W08', 'S07', 'W07', 'S06', 'W06', 'S05', 'IK12'];

    // Create data objects for each trend
    let data = filtered.map(trend => ({
      batch: trend.batch,
      ...Object.fromEntries(
        Array.from(industries).map(industry => [
          industry,
          trend.industries.find(i => i.name === industry)?.percentage || 0
        ])
      )
    }));
    
    // Sort data by the predefined batch order
    data = data.sort((a, b) => {
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

    return {
      filteredTrends: filtered,
      topIndustries: industries,
      chartData: data,
    };
  }, [trends, comparedBatches]);

  return (
    <Card className="p-4 sm:p-6">
      {/* Responsive header that stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Top Industries Over Time</h2>
        
        {/* Scrollable filter container for mobile */}
        <div className="relative">
          <div className="flex items-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide max-w-full">
            <div className="flex items-center gap-2 sm:gap-4 flex-nowrap">
              {comparedBatches.map((batch) => (
                <div key={batch} className="flex items-center gap-1 sm:gap-2 flex-shrink-0 bg-muted/30 px-2 py-1 rounded-md">
                  <span className="font-medium text-sm sm:text-base">{batch}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    onClick={() => removeBatchFromCompare(batch)}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center flex-shrink-0">
                <BatchSelector
                  value=""
                  onValueChange={addBatchToCompare}
                  excludeBatches={comparedBatches}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </BatchSelector>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <CustomXAxis 
              dataKey="batch" 
              tickFormatter={(value: any) => `YC ${value}`} 
            />
            <CustomYAxis />
            <Tooltip
              formatter={(value: number, name: string, props: any) => {
                // Get the batch from the payload
                const batchName = props.payload.batch;
                
                const trend = filteredTrends.find(t => t.batch === batchName);
                const industry = trend?.industries.find(i => i.name === name);
                const color = COLORS[Array.from(topIndustries).indexOf(name) % COLORS.length];
                return [
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{industry?.count || 0} companies ({value.toFixed(1)}%)</span>
                  </div>
                ];
              }}
              labelFormatter={(label, payload) => {
                // Direct access to payload batch (most reliable method)
                if (payload && payload.length > 0 && payload[0].payload && payload[0].payload.batch) {
                  const batchName = payload[0].payload.batch;
                  return `YC ${batchName}`;
                }
                
                // Try to find the batch in the chartData by matching the dataKey value
                const matchingDataPoint = chartData.find(item => item.batch === label);
                if (matchingDataPoint) {
                  return `YC ${matchingDataPoint.batch}`;
                }
                
                // Use the mapping as fallback
                if (batchMapping[label]) {
                  return `YC ${batchMapping[label]}`;
                }
                
                // Last resort - use the index if we can determine it
                const index = chartData.findIndex(item => item.batch === label);
                if (index !== -1) {
                  return `YC ${chartData[index].batch}`;
                }
                
                // Ultimate fallback
                return `YC ${label}`;
              }}
              {...tooltipStyle}
            />
            <Legend
              wrapperStyle={{
                color: 'hsl(var(--foreground))',
              }}
            />
            {Array.from(topIndustries).map((industry, index) => (
              <Line
                key={industry}
                type="monotone"
                dataKey={industry}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                name={industry}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ScrollArea className="h-[200px] mt-6">
        <div className="space-y-4">
          {filteredTrends.map(trend => (
            <div key={trend.batch} className="flex items-center gap-4">
              <div className="w-24 font-medium">YC {trend.batch}</div>
              <div className="flex-1 space-y-2">
                {trend.industries.map((industry, index) => (
                  <div
                    key={industry.name}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{industry.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({industry.count} companies, {industry.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}