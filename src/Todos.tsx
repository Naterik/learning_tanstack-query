import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import loadingImage from './assets/hero.png';

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

type NewTodo = Omit<Todo, 'id'>;

const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
  return response.data;
};

const postTodo = async (newTodo: NewTodo): Promise<Todo> => {
  const response = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', newTodo);
  return response.data;
};

const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
};

const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put<Todo>(
    `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
    todo
  );
  return response.data;
};

const Todos = () => {
  const queryClient = useQueryClient();
  //   const toDo = useRef<HTMLInputElement>(null);
  const [valueTodo, setValueTodo] = useState('');
  const { data: todos, isPending, isError } = useQuery({ queryKey: ['todos'], queryFn: getTodos });
  const mutation = useMutation({
    mutationFn: (toDoNew: NewTodo) => postTodo(toDoNew),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (data = []) => {
        return [newTodo, ...data];
      });
      setValueTodo('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Todo[]>(['todos'], (data = []) => {
        return data.filter((todo) => todo.id !== id);
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (todo: Todo) => updateTodo(todo),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (data = []) => {
        return data.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
      });
    },
  });

  return (
    <div>
      {isPending ? <img src={loadingImage} alt="Loading..." /> : isError ? 'Error occurred' : null}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New Todo"
          value={valueTodo}
          onChange={(e) => setValueTodo(e.target.value)}
        />
        <button
          onClick={() => {
            const title = valueTodo.trim();
            if (!title) {
              return;
            }
            mutation.mutate({ title, completed: false, userId: 1 });
          }}
        >
          Add Todo
        </button>
      </div>
      <div></div>
      {todos?.slice(0, 10).map((todo) => {
        return (
          <>
            <li key={todo.id}>{todo.title}</li>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                updateMutation.mutate({ ...todo, completed: !todo.completed });
              }}
              readOnly
            />
            <button
              onClick={() => {
                deleteMutation.mutate(todo.id);
              }}
            >
              Delete Todo
            </button>
          </>
        );
      })}
    </div>
  );
};

export default Todos;
