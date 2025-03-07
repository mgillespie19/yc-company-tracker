'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IndustryBreakdown } from '@/lib/types';
import { BarChart3 } from 'lucide-react';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const TOP_INDUSTRIES_COUNT = 8;

interface IndustryChartProps {
  data: IndustryBreakdown[];
}

export default function IndustryChart({ data }: IndustryChartProps) {
  const topIndustries = data.slice(0, TOP_INDUSTRIES_COUNT);
  const otherIndustries = data.slice(TOP_INDUSTRIES_COUNT);
  
  const chartData = otherIndustries.length > 0
    ? [...topIndustries, {
        name: 'Other',
        value: otherIndustries.reduce((sum, industry) => sum + industry.value, 0)
      }]
    : topIndustries;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {data.length > TOP_INDUSTRIES_COUNT && (
          <p className="text-center">
            Showing top {TOP_INDUSTRIES_COUNT} industries out of {data.length} total
          </p>
        )}
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="industries">
          <AccordionTrigger className="flex gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed Industry Breakdown
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2 pt-2">
                {data.map((industry, index) => (
                  <div
                    key={industry.name}
                    className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>{industry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{industry.value}</span>
                      <span className="text-sm text-muted-foreground">
                        ({((industry.value / data.reduce((sum, ind) => sum + ind.value, 0)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}