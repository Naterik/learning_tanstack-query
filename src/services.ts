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

const dummyProductApi = async ({ limit = 10, skip = 0 }) => {
  const res = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  return res.data;
};

const addDummyProductApi = async (productData: any) => {
  const res = await axios.post(`https://dummyjson.com/products/add`, productData);
  return res.data;
};

const updateDummyProductApi = async (productId: number, productData: any) => {
  const res = await axios.put(`https://dummyjson.com/products/${productId}`, productData);
  return res.data;
};

const deleteDummyProductApi = async (productId: number) => {
  const res = await axios.delete(`https://dummyjson.com/products/${productId}`);
  return res.data;
};

export {
  addDummyProductApi,
  deleteDummyProductApi,
  dummyProductApi,
  paginateApi,
  updateDummyProductApi,
};
