'use client';

import { Users, Briefcase, Building2, LineChart } from 'lucide-react';
import { Card } from './ui/card';
import { BatchStats } from '@/lib/types';

interface StatsOverviewProps {
  stats: BatchStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'text-primary',
    },
    {
      title: 'Active Companies',
      value: stats.activeCompanies,
      icon: LineChart,
      color: 'text-chart-2',
    },
    {
      title: 'Avg Team Size',
      value: stats.avgTeamSize || 'N/A',
      icon: Users,
      color: 'text-chart-3',
    },
    {
      title: 'Hiring',
      value: stats.hiringCount,
      icon: Briefcase,
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-full bg-opacity-10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value.toString()}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}