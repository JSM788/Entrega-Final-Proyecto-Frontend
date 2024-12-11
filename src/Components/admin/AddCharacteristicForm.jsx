import { useState } from "react";

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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="featureName"
        value={formValues.featureName}
        onChange={handleInputChange}
        placeholder="Nombre de la característica"
        className="border p-2 rounded"
        required
      />
      <textarea
        name="featureDescription"
        value={formValues.featureDescription}
        onChange={handleInputChange}
        placeholder="Descripción de la característica"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="featureImageUrl"
        value={formValues.featureImageUrl}
        onChange={handleInputChange}
        placeholder="URL de la imagen"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Crear
      </button>
    </form>
  );
};
