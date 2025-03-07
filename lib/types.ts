export interface YCCompany {
  id: number;
  name: string;
  slug: string;
  small_logo_thumb_url: string;
  website: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  top_company: boolean;
  isHiring: boolean;
  batch: string;
  status: string;
  industries: string[];
  regions: string[];
  stage: string;
}

export interface BatchData {
  [batchId: string]: YCCompany[];
}

export interface IndustryBreakdown {
  name: string;
  value: number;
}

export interface IndustryTrend {
  batch: string;
  industries: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface BatchStats {
  totalCompanies: number;
  activeCompanies: number;
  avgTeamSize: number;
  hiringCount: number;
  industryBreakdown: IndustryBreakdown[];
}