import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { fetchInfiniteDataProducts, PRODUCTS_QUERY_KEY } from './queries/products';
import { addDummyProductApi, updateDummyProductApi } from './services';

const MyProduct = () => {
  const {
    data: productData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(fetchInfiniteDataProducts());
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputIdRef = useRef<HTMLInputElement>(null);
  const inputIdDeleteRef = useRef<HTMLInputElement>(null);
  const inputUpdateRef = useRef<HTMLInputElement>(null);
  const { mutate: addMutationProduct } = useMutation({
    mutationFn: (newProduct: string) => {
      return addDummyProductApi({ title: newProduct });
    },
    onSuccess: async () => {
      alert('Product added successfully');
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    onError: () => {
      alert('Failed to add product');
    },
  });

  const { mutate: updateMutationProduct } = useMutation({
    mutationFn: ({ productId, newTitle }: { productId: number; newTitle: string }) => {
      return updateDummyProductApi(productId, { title: newTitle });
    },
    onSuccess() {
      alert('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      if (inputIdRef.current) {
        inputIdRef.current.value = '';
      }
      if (inputUpdateRef.current) {
        inputUpdateRef.current.value = '';
      }
    },
    onError() {
      alert('Failed to update product');
    },
  });
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (productId: number) => {
      return updateDummyProductApi(productId, { title: '' });
    },
    onSuccess() {
      alert('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      if (inputIdDeleteRef.current) {
        inputIdDeleteRef.current.value = '';
      }
    },
    onError() {
      alert('Failed to delete product');
    },
  });

  const handleUpdateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newIdRef = inputIdRef.current?.value;
    const newsProduct = inputUpdateRef.current?.value;
    if (newsProduct) {
      updateMutationProduct({ productId: parseInt(newIdRef || '0'), newTitle: newsProduct });
    }
  };

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
      { rootMargin: '200px' }
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>{error.message}</div>;

  const products = productData?.pages.flatMap((page) => page.products);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newsProduct = inputRef.current?.value;
    if (newsProduct) {
      addMutationProduct(newsProduct);
    }
  };

  return (
    <>
      <form onSubmit={handleAddProduct}>
        <input type="text" ref={inputRef}></input>
        <button type="submit">Add Product</button>
      </form>
      <form onSubmit={handleUpdateProduct}>
        <input type="text" ref={inputIdRef} placeholder="Product ID" />
        <input type="text" ref={inputUpdateRef} placeholder="New Product Name" />
        <button type="submit">Update Product</button>
      </form>
      <div>
        <input type="text" ref={inputIdDeleteRef} placeholder="Product ID to Delete" />
        <button
          onClick={() => {
            const productId = parseInt(inputIdDeleteRef.current?.value || '0');
            if (!isNaN(productId)) {
              deleteMutation(productId);
            }
          }}
        >
          Delete Product
        </button>
      </div>

      <h2>Products loaded with Axios</h2>

      <div>
        {products?.map((product: any) => (
          <div key={product.id}>{product.title}</div>
        ))}
      </div>
      <div ref={loadMoreRef} style={{ height: '1px' }} />
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more products'}
      </button>
    </>
  );
};

export default MyProduct;
