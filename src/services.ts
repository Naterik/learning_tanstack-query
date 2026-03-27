import axios from 'axios';
export type Post = {
  id: number;
  title: string;
};
const paginateApi = async (page = 1) => {
  const res = await axios.get<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
  );
  return res.data;
};

const dummyApi = async () => {
  const res = await axios.get('https://dummyjson.com/products?limit=10&skip=1');
  return res.data;
};

export { dummyApi, paginateApi };
