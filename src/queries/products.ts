import { infiniteQueryOptions } from '@tanstack/react-query';
import { dummyProductApi } from '../services';

const PRODUCTS_QUERY_KEY = ['infiniteProducts'] as const;

const fetchInfiniteDataProducts = () => {
  return infiniteQueryOptions({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: ({ pageParam }) => dummyProductApi({ limit: 10, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};

export { fetchInfiniteDataProducts, PRODUCTS_QUERY_KEY };
