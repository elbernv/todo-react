import { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import './TaskById.css';
import defaultImage from '../../../assets/default-placeholder-img.png';
import { CustomModal } from '../../../components/Modal/Modal';
import { ModalContext } from '../../../context/ModalContext';
import { AlertContext } from '../../../context/AlertContext';
import { CustomAlert } from '../../../components/Alert/Alert';

export const getTaskById = async (taskId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
  );

  return response.json();
};

export function TaskById() {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const [taskInfo, setTaskInfo] = useState({});
  const { handleClose, handleShow } = useContext(ModalContext);
  const { register, handleSubmit } = useForm();
  const { setShow: showAlert, setAlertInfo } = useContext(AlertContext);

  useEffect(() => {
    const fetchData = async () => {
      const taskInfo = await getTaskById(taskId);
      setTaskInfo(taskInfo);
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';

    return format(new Date(date), 'dd-MM-yyyy hh:mm:ss a');
  };

  const sendPatchRequests = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: 'PATCH',
          body: formData,
        },
      );
      return response.json();
    } catch (error) {
      return false;
    }
  };

  const markTaskAsCompleted = async () => {
    const formData = new FormData();
    formData.append('finishedAt', new Date().toISOString());

    const updatedTask = await sendPatchRequests(formData);

    setTaskInfo(updatedTask);
  };

  const markTaskAsNotCompleted = async () => {
    const formData = new FormData();
    formData.append('finishedAt', '');

    const updatedTask = await sendPatchRequests(formData);

    setTaskInfo(updatedTask);
  };

  const onUpdateSubmit = async (data) => {
    const formData = new FormData();

    if (data.name) {
      formData.append('name', data.name);
    }

    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.image.length) {
      formData.append('image', data.image[0]);
    }

    const response = await sendPatchRequests(formData);

    if (response) {
      setAlertInfo({
        message: 'Tarea Actualizada',
        variant: 'success',
        closeInSecods: 5,
      });
      showAlert(true);
      const taskInfo = await getTaskById(taskId);
      setTaskInfo(taskInfo);
      return;
    }

    setAlertInfo({
      message: 'Error al guardar la tarea',
      variant: 'error',
      closeInSecods: 5,
    });
    showAlert(true);
    return;
  };

  return (
    <div className="d-flex flex-column position-relative h-75">
      <CustomModal centered={true} backdrop={'static'}>
        <CustomAlert className="position-absolute top-0 start-50 modal-alert" />
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <Form id="update-form" onSubmit={handleSubmit(onUpdateSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre de la tarea</Form.Label>
              <Form.Control
                type="text"
                defaultValue={taskInfo.name}
                placeholder="Nombre de la tarea"
                {...register('name')}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripción de la tarea"
                defaultValue={taskInfo.description}
                {...register('description')}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Imágen</Form.Label>
              <Form.Control type="file" size="sm" {...register('image')} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" form="update-form" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </CustomModal>

      <h1 className="my-3 px-4">{taskInfo.name}</h1>

      <Button
        onClick={() => {
          navigate('/tasks');
        }}
        className="position-absolute go-back-btn"
        variant="secondary"
      >
        Volver
      </Button>

      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <Card className="d-flex card-container mt-4">
          <Card.Img
            style={{ objectFit: 'cover', height: '40%' }}
            variant="top"
            src={taskInfo.image || defaultImage}
          />
          <Card.Body>
            <Card.Title className="text-center">{taskInfo.name}</Card.Title>

            <div className="card-description my-4">
              <div>
                <span>Descripción :</span> <span>{taskInfo.description}</span>
              </div>
              <div>
                <span>Creación :</span>{' '}
                <span>{formatDate(taskInfo.createdAt)}</span>
              </div>
              <div>
                <span>Actualización :</span>{' '}
                <span>{formatDate(taskInfo.updatedAt)}</span>
              </div>
              <div>
                <span>Culminación :</span>{' '}
                <span>{formatDate(taskInfo.finishedAt) || 'Sin Terminar'}</span>
              </div>
            </div>

            <div className="position-absolute btn-container d-flex">
              {taskInfo.finishedAt && (
                <Button onClick={markTaskAsNotCompleted} variant="danger">
                  Marcar como "No Terminada"
                </Button>
              )}
              {!taskInfo.finishedAt && (
                <Button onClick={markTaskAsCompleted} variant="success">
                  Marcar como "Terminada"
                </Button>
              )}
              <Button
                onClick={() => {
                  handleShow();
                }}
                variant="primary text-white"
              >
                Editar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
