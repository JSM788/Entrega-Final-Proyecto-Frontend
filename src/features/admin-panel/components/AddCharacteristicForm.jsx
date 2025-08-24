import { useState } from "react";
import { Card, CardBody } from "@material-tailwind/react";

export const AddCharacteristicForm = ({ onAddCharacteristic }) => {
  const [formValues, setFormValues] = useState({
    featureName: "",
    featureDescription: "",
    featureImageUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCharacteristic(formValues); // Llama a la función pasada como prop
    setFormValues({ featureName: "", featureDescription: "", featureImageUrl: "" }); // Limpia el formulario
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg border-gray-200 w-full">
      <CardBody>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Agregar Característica
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Detalles de la Característica
            </legend>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nombre de la Característica
              </label>
              <input
                type="text"
                name="featureName"
                value={formValues.featureName}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la característica"
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Descripción de la Característica
              </label>
              <textarea
                name="featureDescription"
                value={formValues.featureDescription}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción de la característica"
                className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                URL de la Imagen
              </label>
              <input
                type="text"
                name="featureImageUrl"
                value={formValues.featureImageUrl}
                onChange={handleInputChange}
                placeholder="Ingrese la URL de la imagen de la característica"
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>
          </fieldset>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2A606E] text-white px-6 py-3 rounded-md shadow-md transition-all"
            >
              Crear Característica
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};