import { create } from 'zustand';
import { YCCompany, BatchData } from './types';

interface YCStore {
  // Single batch selection (for batch analytics)
  selectedBatch: string;
  batchData: BatchData;
  setSelectedBatch: (batch: string) => void;
  setBatchData: (data: BatchData | ((prev: BatchData) => BatchData)) => void;
  
  // Multi-batch selection (for graph - completely separate)
  comparedBatches: string[];
  graphBatchData: BatchData;
  addBatchToCompare: (batch: string) => void;
  removeBatchFromCompare: (batch: string) => void;
  setGraphBatchData: (data: BatchData | ((prev: BatchData) => BatchData)) => void;
}

export const useYCStore = create<YCStore>((set) => ({
  // Single batch selection (for batch analytics)
  selectedBatch: 'X25',
  batchData: {},
  setSelectedBatch: (batch) => set({ selectedBatch: batch }),
  setBatchData: (data) => set((state) => ({
    batchData: typeof data === 'function' ? data(state.batchData) : data
  })),
  
  // Multi-batch selection (for graph - completely separate)
  comparedBatches: ['X25', 'W25', 'W24', 'S24'],
  graphBatchData: {},
  addBatchToCompare: (batch) => set((state) => ({
    comparedBatches: Array.from(new Set([...state.comparedBatches, batch]))
  })),
  removeBatchFromCompare: (batch) => set((state) => ({
    comparedBatches: state.comparedBatches.filter((b) => b !== batch)
  })),
  setGraphBatchData: (data) => set((state) => ({
    graphBatchData: typeof data === 'function' ? data(state.graphBatchData) : data
  })),
}));