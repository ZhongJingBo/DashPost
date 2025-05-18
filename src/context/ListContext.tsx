import React, { createContext, useContext, useState, useCallback } from 'react';
import { getListService } from '../service';

interface ListContextType {
  list: any[];
  refreshList: () => Promise<void>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<any[]>([]);

  const refreshList = useCallback(async () => {
    try {
      const res = await getListService();
      if (res.data.code === 200) {
        setList(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch list:', error);
    }
  }, []);

  return (
    <ListContext.Provider value={{ list, refreshList }}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
} 