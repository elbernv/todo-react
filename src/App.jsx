import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from './pages/error-page/ErrorPage';
import Root from './pages/root/root';
import {
  AllTasks,
  NewTask,
  TaskById,
  getTaskById as TaskByIdLoader,
} from './pages/tasks/index';
import { AlertContextProvider } from './context/AlertContext';
import { ModalContextProvider } from './context/ModalContext';
import { PaginationContextProvider } from './context/PaginationContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'tasks',
        element: (
          <PaginationContextProvider>
            <AllTasks />
          </PaginationContextProvider>
        ),
      },
      {
        path: 'new-task',

        element: (
          <AlertContextProvider>
            <NewTask />
          </AlertContextProvider>
        ),
      },
      {
        path: 'tasks/:id',

        element: (
          <AlertContextProvider>
            <ModalContextProvider>
              <TaskById />
            </ModalContextProvider>
          </AlertContextProvider>
        ),
        loader: async ({ params }) => {
          return TaskByIdLoader(params.id);
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
