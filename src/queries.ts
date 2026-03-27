import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { dummyApi, paginateApi } from './services';

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

const fetchInfiniteDataProducts = () => {
  return infiniteQueryOptions({
    queryKey: ['infiniteProducts'],
    queryFn: ({ pageParam }) => dummyApi({ limit: 10, skip: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};

const fetchDataProducts = () => {
  return queryOptions({
    queryKey: ['products'],
    queryFn: () => dummyApi({ limit: 10, skip: 0 }),
    placeholderData: () => {},
  });
};

export { fetchDataProducts, fetchInfiniteDataPost, fetchInfiniteDataProducts };
