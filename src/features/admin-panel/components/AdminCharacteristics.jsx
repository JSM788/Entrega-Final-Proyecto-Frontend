import { Card, CardHeader, CardBody, Avatar, Tooltip, IconButton, Button } from '@material-tailwind/react';
import useIsMobile from '../../../shared/hooks/useIsMobile';
import MobileMessage from '../../../shared/ui/MobileMessage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { AddCharacteristicForm } from './AddCharacteristicForm';
import EditCharacteristicForm from './EditCharacteristicForm';


const TABLE_HEAD = ['#', 'Nombre', 'Descripción', 'Acciones'];

export const AdminCharacteristics = () => {
  const isMobile = useIsMobile();
  const [characteristics, setCharacteristics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCharacteristic, setEditingCharacteristic] = useState(null);

  const getCharacteristics = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/characteristics');
      console.log('Characteristics fetched:', response.data);
      setCharacteristics(response.data);
    } catch (error) {
      console.error('Error fetching characteristics:', error);
    }
  };

  const handleAddClick = () => {
    setShowForm((prev) => !prev);
  };

  const handleAddCharacteristic = async (newCharacteristic) => {
    console.log('New characteristic:', newCharacteristic);
    try {
      const response = await axios.post('http://localhost:8080/api/characteristics', newCharacteristic);
      setCharacteristics((prev) => [...prev, response.data]);
      setShowForm(false); // Oculta el formulario tras agregar
    } catch (error) {
      console.error('Error adding characteristic:', error);
    }
  };

  const handleEditClick = (characteristic) => {
    setEditingCharacteristic(characteristic);
    setShowForm(false); // Ocultar el form de agregar si estuviera abierto
  };

  const handleUpdateCharacteristic = async (updatedCharacteristic) => {
    try {
      setCharacteristics((prevCharacteristics) =>
        prevCharacteristics.map((char) =>
          char.featureId === updatedCharacteristic.featureId ? updatedCharacteristic : char
        )
      );
      setEditingCharacteristic(null); // Salir del modo edición
      Swal.fire({
        icon: 'success',
        title: 'Característica actualizada',
        text: `La característica "${updatedCharacteristic.featureName}" ha sido actualizada.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Error updating characteristic:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la característica.',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCharacteristic(null);
  };

  const deleteCharacteristic = async (featureId, featureName) => {
    const result = await Swal.fire({
      title: `Eliminar la característica`,
      html: `
        <p>Estás a punto de eliminar la característica <strong>"${featureName}"</strong>.</p>
        <p>¿Estás seguro de que deseas continuar?</p>
      `,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#32CEB1',
      cancelButtonColor: '#D9534F',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/characteristics/${featureId}`);
        setCharacteristics((prev) => prev.filter((char) => char.featureId !== featureId));
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `La característica "${featureName}" ha sido eliminada.`,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error('Error deleting characteristic:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la característica. Inténtalo de nuevo.',
        });
      }
    }
  };

  useEffect(() => {
    getCharacteristics();
  }, []);

  if (isMobile) return <MobileMessage />;

  let content;
  if (editingCharacteristic) {
    content = (
      <EditCharacteristicForm
        editingCharacteristic={editingCharacteristic}
        onUpdateCharacteristic={handleUpdateCharacteristic}
        onCancel={handleCancelEdit}
      />
    );
  } else if (showForm) {
    content = (
      <AddCharacteristicForm onAddCharacteristic={handleAddCharacteristic} />
    );
  } else {
    content = (
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h2 className="text-lg font-semibold">Lista de Características</h2>
          <p className="text-sm font-normal text-gray-600">Información sobre todas las características</p>
        </CardHeader>

        <CardBody className="overflow-auto px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <h3 className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      {head}
                    </h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {characteristics.map((characteristic, index) => {
                const isLast = index === characteristics.length - 1;
                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                return (
                  <tr key={characteristic.featureId}>
                    <td className={classes}>
                      <p className="font-normal">{index + 1}</p>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={characteristic.featureImageUrl}
                          alt={characteristic.featureName}
                          size="sm"
                          className="rounded-full border border-aquaTeal"
                        />
                        <p className="font-normal">{characteristic.featureName}</p>
                      </div>
                    </td>
                    <td className={classes}>
                      <p className="font-normal">{characteristic.featureDescription}</p>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Editar característica">
                        <IconButton variant="text" onClick={() => handleEditClick(characteristic)}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar característica">
                        <IconButton
                          variant="text"
                          onClick={() => deleteCharacteristic(characteristic.featureId, characteristic.featureName)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col px-10">
      <div className="w-full flex justify-between items-center mb-4">
        <div><h1 className="text-2xl font-bold">Características</h1></div>
        {!editingCharacteristic && (
          <Button onClick={() => setShowForm(!showForm)} variant="filled" className="bg-[#32CEB1]">
            {showForm ? 'Cancelar' : 'Agregar Característica'}
          </Button>
        )}
      </div>
      {content}
    </div>
  )
}
