import './App.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import imageReact from './assets/hero.png';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type NewPost = Omit<Post, 'id'>;

const getApi = async (): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  return response.data;
};

const postApi = async (newTodo: NewPost): Promise<Post> => {
  const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newTodo);
  return response.data;
};

function App() {
  const queryClient = useQueryClient();
  const { isPending, isError, data, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: getApi,
    staleTime: 1000 * 10,
  });

  const mutation = useMutation({
    mutationFn: postApi,
    onSuccess: (createdPost) => {
      // JSONPlaceholder does not persist created items, so update the cache locally.
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts = []) => [createdPost, ...oldPosts]);
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      <div>
        {isPending ? (
          <img src={imageReact} alt="Loading..." />
        ) : isError ? (
          'Error occurred'
        ) : (
          <ul>
            {data?.slice(0, 10).map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {mutation.isPending ? (
          'Adding todo...'
        ) : (
          <>
            {mutation.isError ? (
              <div>
                An error occurred:{' '}
                {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
              </div>
            ) : null}

            {mutation.isSuccess ? <div>Todo added!</div> : null}

            <button
              onClick={() => {
                mutation.mutate({
                  title: 'foo',
                  body: 'bar',
                  userId: Math.floor(Math.random() * 100) + 1,
                });
              }}
            >
              Create Todo
            </button>
          </>
        )}
      </div>
      <div>
        <button onClick={handleRefresh}>Refresh Todos</button>
      </div>
    </div>
  );
}

export default App;
