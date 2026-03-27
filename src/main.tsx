import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import InfiniteScroll from './InfiniteScroll.tsx';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <InfiniteScroll />
    </QueryClientProvider>
  </StrictMode>
);
