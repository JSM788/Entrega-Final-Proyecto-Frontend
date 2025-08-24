import { useState, useEffect } from "react";
import { Input, Textarea, Card, CardBody } from "@material-tailwind/react";
import axios from "axios";
import Swal from 'sweetalert2';

const EditCharacteristicForm = ({ onUpdateCharacteristic, editingCharacteristic, onCancel }) => {
  const [characteristic, setCharacteristic] = useState({
    featureName: "",
    featureDescription: "",
    featureImageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    featureName: "",
    featureDescription: "",
    featureImageUrl: "",
  });

  useEffect(() => {
    if (editingCharacteristic) {
      setCharacteristic({
        featureName: editingCharacteristic.featureName,
        featureDescription: editingCharacteristic.featureDescription,
        featureImageUrl: editingCharacteristic.featureImageUrl,
        featureId: editingCharacteristic.featureId,
      });
    } else {
        onCancel();
    }
  }, [editingCharacteristic, onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      featureName: characteristic.featureName.length < 3 ? "El nombre debe tener al menos 3 caracteres." : "",
      featureDescription: characteristic.featureDescription.length < 3 ? "La descripción debe tener al menos 3 caracteres." : "",
      featureImageUrl: !characteristic.featureImageUrl.startsWith("http") ? "La URL de la imagen debe comenzar con http." : "",
    };
    setError(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    setLoading(true);
    console.log('Sending update request for characteristicId:', editingCharacteristic.featureId, 'with data:', characteristic);
    try {
      await axios.put(`http://localhost:8080/api/characteristics/${characteristic.featureId}`, {
        featureName: characteristic.featureName,
        featureDescription: characteristic.featureDescription,
        featureImageUrl: characteristic.featureImageUrl,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Característica actualizada exitosamente!',
        showConfirmButton: false,
        timer: 1500
      });
      onUpdateCharacteristic(characteristic);
      onCancel();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Error al actualizar la característica.',
        showConfirmButton: false,
        timer: 1500
      });
      console.error('Error updating characteristic:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacteristic((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg border-gray-200">
      <CardBody>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Editar Característica
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <Input
              label="Nombre"
              name="featureName"
              value={characteristic.featureName}
              onChange={handleChange}
            />
            {error.featureName && <p className="text-red-500 text-sm mt-1">{error.featureName}</p>}
          </div>
          <div className="mb-4">
            <Textarea
              label="Descripción"
              name="featureDescription"
              value={characteristic.featureDescription}
              onChange={handleChange}
            />
            {error.featureDescription && <p className="text-red-500 text-sm mt-1">{error.featureDescription}</p>}
          </div>
          <div className="mb-4">
            <Input
              label="URL de la Imagen"
              name="featureImageUrl"
              value={characteristic.featureImageUrl}
              onChange={handleChange}
            />
            {error.featureImageUrl && <p className="text-red-500 text-sm mt-1">{error.featureImageUrl}</p>}
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#2A606E] text-white px-6 py-3 rounded-md shadow-md transition-all"
            >
              Actualizar Característica
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditCharacteristicForm;