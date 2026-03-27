import { infiniteQueryOptions } from '@tanstack/react-query';
import { paginateApi } from './services';

const fetchInfiniteDataPost = () => {
  return infiniteQueryOptions({
    queryKey: ['infinitePosts'],
    queryFn: ({ pageParam }) => paginateApi(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      return lastPage.length > 0 ? lastPageParam + 1 : undefined;
    },
  });
};

export { fetchInfiniteDataPost };
