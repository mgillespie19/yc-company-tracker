'use client';

import { useState } from 'react';
import { YCCompany } from '@/lib/types';
import { Card } from './ui/card';
import { Globe, Users, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanyListProps {
  companies: YCCompany[];
}

const COMPANIES_PER_PAGE = 12;

export default function CompanyList({ companies }: CompanyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const uniqueIndustries = Array.from(new Set(companies.map(c => c.industry))).sort();
  
  const filteredCompanies = selectedIndustry
    ? (selectedIndustry === 'all' ? companies : companies.filter(c => c.industry === selectedIndustry))
    : companies;
    
  const totalPages = Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE);
  
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const displayedCompanies = filteredCompanies.slice(startIndex, startIndex + COMPANIES_PER_PAGE);

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
          <SelectTrigger className="w-[280px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Filter by industry" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {uniqueIndustries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <p className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} companies
          {selectedIndustry !== 'all' && ` in ${selectedIndustry}`}
        </p>
      </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCompanies.map((company) => (
          <Card key={company.id} className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {company.small_logo_thumb_url ? (
                <img
                  src={company.small_logo_thumb_url}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-2xl font-bold">{company.name[0]}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
          </div>

          <p className="text-sm">{company.one_liner}</p>

          <div className="flex items-center gap-4 mt-auto text-sm text-muted-foreground">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
            {company.team_size && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {company.team_size} team members
              </span>
            )}
          </div>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}