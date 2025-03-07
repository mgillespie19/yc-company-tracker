'use client';

import { useYCStore } from '@/lib/store';
import { useEffect, ReactNode } from 'react';
import { fetchBatchData } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// These are the batches available from the YC API
const BATCHES = [
  'X25', 'W25', 'W24', 'S24', 'F24', 'W23', 'S23', 'W22', 'S22',
  'W21', 'S21', 'W20', 'S20', 'S19', 'W19', 'W18', 'S18', 'S17',
  'W17', 'W16', 'S16', 'W15', 'S15', 'W14', 'S14', 'W13', 'S13',
  'W12', 'S12', 'S11', 'W11', 'S10', 'W10', 'S09', 'W09', 'S08',
  'W08', 'S07', 'W07', 'S06', 'W06', 'S05', 'IK12'
];

interface BatchSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  excludeBatches?: string[];
  className?: string;
  children?: ReactNode;
}

export function BatchSelector({ 
  value, 
  onValueChange, 
  excludeBatches = [], 
  className,
  children
}: BatchSelectorProps) {
  const { 
    selectedBatch, 
    setSelectedBatch, 
    setBatchData, 
    batchData 
  } = useYCStore();

  const currentValue = value ?? selectedBatch;
  const handleChange = onValueChange ?? setSelectedBatch;

  useEffect(() => {
    async function loadBatchData() {
      if (!batchData[currentValue]) {
        const data = await fetchBatchData(currentValue);
        setBatchData({ ...batchData, [currentValue]: data });
      }
    }
    if (currentValue) {
      loadBatchData();
    }
  }, [currentValue, setBatchData, batchData]);

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        {children || <SelectValue />}
      </SelectTrigger>
      <SelectContent>
        {BATCHES.filter(batch => !excludeBatches.includes(batch)).map((batch) => (
          <SelectItem key={batch} value={batch}>
            {batch.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function MainBatchSelector() {
  return (
    <BatchSelector />
  );
}