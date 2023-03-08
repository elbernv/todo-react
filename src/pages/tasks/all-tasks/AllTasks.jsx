import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { format } from 'date-fns';

import './AllTasks.css';
import { CustomPagination } from '../../../components/Pagination/Pagination';
import { PaginationContext } from '../../../context/PaginationContext';

export const getAllTasksRequests = async (
  { limit = 7, page = 1, orderBy = 'id', orderByType = 'asc' } = {
    limit,
    page,
    orderBy,
    orderByType,
  },
) => {
  const searchParams = new URLSearchParams({
    limit,
    page,
    orderBy,
    orderByType,
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/tasks?${searchParams.toString()}`,
  );

  return response.json();
};

export function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { paginationData, setPaginationData } = useContext(PaginationContext);

  const getAllTasks = async ({ page = 1 } = { page }) => {
    const tasks = await getAllTasksRequests({ page });
    setTasks(tasks.data);
    setPaginationData(tasks.meta);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllTasks({});
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy hh:mm:ss a');
  };

  const tdStatus = (finishedAt) => {
    let label = '';
    let bgColor = '';

    if (finishedAt) {
      label = 'Terminada';
      bgColor = 'bg-success';
    } else {
      label = 'Pendiente';
      bgColor = 'bg-warning';
    }

    return (
      <div
        className={`border rounded p-1 rounded text-white opacity-75 ${bgColor}`}
      >
        {label}
      </div>
    );
  };

  const tdStatusClassName = (finishedAt) => {
    return (finishedAt && 'tr tr-finished') || 'tr tr-in-progress';
  };

  const openTaskById = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="d-flex flex-column">
      <h1 className="my-3 px-4">Lista de Tareas</h1>
      <div className="d-flex flex-column align-items-center justify-content-center p-4">
        <Table striped="columns" bordered hover>
          <thead>
            <tr>
              <th className="th">id</th>
              <th className="th">Nombre</th>
              <th className="th">Descripción</th>
              <th className="th">Fecha de Creación</th>
              <th className="th">Fecha de Actualización</th>
              <th className="th">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr
                className="tr"
                onClick={() => {
                  openTaskById(task.id);
                }}
                key={task.id}
              >
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{formatDate(task.createdAt)}</td>
                <td>{formatDate(task.updatedAt)}</td>
                <td className={tdStatusClassName(task.finishedAt)}>
                  {tdStatus(task.finishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CustomPagination fetchFunction={getAllTasks} />
      </div>
    </div>
  );
}
