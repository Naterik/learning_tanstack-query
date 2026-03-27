import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ProductsInfinite from './products.tsx';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <InfiniteScroll /> */}
      <ProductsInfinite />
    </QueryClientProvider>
  </StrictMode>
);
