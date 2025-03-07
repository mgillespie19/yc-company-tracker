'use client';

import { useState } from 'react';
import { YCCompany } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface TopCompaniesProps {
  companies: YCCompany[];
}

const COMPANIES_PER_PAGE = 10;

export default function TopCompanies({ companies }: TopCompaniesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(companies.length / COMPANIES_PER_PAGE);
  
  const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
  const displayedCompanies = companies.slice(startIndex, startIndex + COMPANIES_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="space-y-4 min-h-[400px]">
        {displayedCompanies.map((company, index) => (
          <div
            key={company.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-none w-8 text-amber-500 font-semibold flex items-center justify-center">
              {index === 0 ? (
                <Trophy className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-none">
              {company.small_logo_thumb_url ? (
                <img
                  src={company.small_logo_thumb_url}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-lg font-bold">
                  {company.name[0]}
                </span>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-medium truncate">{company.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {company.one_liner}
              </p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {startIndex + 1}-{Math.min(startIndex + COMPANIES_PER_PAGE, companies.length)} of {companies.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}