import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { fetchInfiniteDataProducts } from './queries';

const ProductsInfinite = () => {
  const {
    data: productData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(fetchInfiniteDataProducts());
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerTarget = loadMoreRef.current;

    if (!observerTarget || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const products = productData?.pages.flatMap((page) => page.products);
  return (
    <>
      <h2>Products loaded with Axios</h2>

      <div>
        {products?.map((product: any) => (
          <div key={product.id}>{product.title}</div>
        ))}
      </div>
      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </>
  );
};

export default ProductsInfinite;
