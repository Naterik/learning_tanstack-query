import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { fetchInfiniteDataPost } from './queries';
import { type Post } from './services';

const InfiniteScroll = () => {
  const { data, hasNextPage, isLoading, isError, error, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(fetchInfiniteDataPost());

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const postsData = data?.pages.flatMap((page) => page) ?? [];

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
      { rootMargin: '300px' }
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
      <h2>Posts loaded with Axios</h2>
      <ul>
        {postsData.map((post: Post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <div ref={loadMoreRef} style={{ height: '1px' }} />

      <hr />
      <button onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </button>
    </div>
  );
};

export default InfiniteScroll;
