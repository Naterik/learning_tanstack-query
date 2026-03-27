import axios from 'axios';
import { useEffect, useState } from 'react';

const InfiniteScroll = () => {
  const [data, setData] = useState([]);
  const paginateApi = async () => {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10`);
    return res.data;
  };
  const showData = async () => {
    const res = await paginateApi();
    setData(res);
  };
  useEffect(() => {
    showData();
    console.log('data :>> ', data);
  }, []);
  return <div>InfiniteScroll</div>;
};

export default InfiniteScroll;
