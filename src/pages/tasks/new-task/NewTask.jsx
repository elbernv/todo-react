import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import { CustomAlert } from '../../../components/Alert/Alert';
import { AlertContext } from '../../../context/AlertContext';

import './NewTask.css';

export function NewTask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setShow: showAlert, setAlertInfo } = useContext(AlertContext);
  const navigate = useNavigate();

  const sendPostRequests = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } catch (error) {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);

    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.image.length) {
      formData.append('image', data.image[0]);
    }

    const response = await sendPostRequests(formData);

    if (response) {
      navigate('/tasks');
      return;
    }

    setAlertInfo({
      message: 'Error al guardar la tarea',
      variant: 'error',
      closeInSecods: 5,
    });
    showAlert(true);
  };

  return (
    <div className="h-95 d-flex flex-column">
      <h1 className="my-3 px-4">Crear Nueva Tarea</h1>
      <CustomAlert />
      <div className="form-container d-flex border border-dark rounded align-items-center justify-content-center p-4 w-50 m-auto h-75">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Nombre de la tarea</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ingresa el nombre de la tarea"
              {...register('name', { required: true })}
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">
              Este campo es requerido
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="description"
              placeholder="Ingresa la descripción"
              {...register('description')}
            />
            <Form.Control.Feedback type="invalid">
              Este campo es requerido
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicImage">
            <Form.Label>Imágen</Form.Label>
            <Form.Control type="file" size="sm" {...register('image')} />
            <Form.Control.Feedback type="invalid">
              Este campo es requerido
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </div>
    </div>
  );
}
