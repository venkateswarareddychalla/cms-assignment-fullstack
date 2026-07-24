"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AppContextType {
  pages: any[];
  fetchPages: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/content' || 'http://localhost:5000/api/v1/content');
      setPages(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <AppContext.Provider value={{ pages, fetchPages, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
