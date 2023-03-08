import { createContext, useState } from 'react';

export const PaginationContext = createContext();

export function PaginationContextProvider({ children }) {
  const [paginationData, setPaginationData] = useState({
    firstPageUrl: '',
    lastPageUrl: '',
    limit: 0,
    nextPageUrl: '',
    page: 1,
    previousPageUrl: null,
    totalItems: 0,
    totalPages: 0,
  });

  return (
    <PaginationContext.Provider value={{ paginationData, setPaginationData }}>
      {children}
    </PaginationContext.Provider>
  );
}
