import { useState } from "react";
import { Input, Textarea, Card, CardBody } from "@material-tailwind/react";

const AddCategoryForm = ({ onAddCategory }) => {
  const [newCategory, setNewCategory] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const handleAddCategory = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    const errors = {
      title:
        newCategory.title.length < 3
          ? "El título debe tener al menos 3 caracteres."
          : "",
      description:
        newCategory.description.length < 3
          ? "La descripción debe tener al menos 3 caracteres."
          : "",
      imageUrl: !newCategory.imageUrl.startsWith("http")
        ? "La URL de la imagen debe comenzar con http."
        : "",
    };

    setError(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return; // No enviar si hay errores
    }

    onAddCategory(newCategory); // Llamar a la función que recibe el padre para agregar la categoría
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg border-gray-200">
      <CardBody>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Agregar Categoría
        </h2>
        <form onSubmit={handleAddCategory} className="space-y-6">
          <div className="mb-4">
            <Input
              label="Título"
              value={newCategory.title}
              onChange={(e) =>
                setNewCategory({ ...newCategory, title: e.target.value })
              }
            />
            {error.title && (
              <p className="text-red-500 text-sm mt-1">{error.title}</p>
            )}
          </div>
          <div className="mb-4">
            <Textarea
              label="Descripción"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  description: e.target.value,
                })
              }
            />
            {error.description && (
              <p className="text-red-500 text-sm mt-1">{error.description}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              label="URL de la Imagen"
              value={newCategory.imageUrl}
              onChange={(e) =>
                setNewCategory({ ...newCategory, imageUrl: e.target.value })
              }
            />
            {error.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{error.imageUrl}</p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2A606E] text-white px-6 py-3 rounded-md shadow-md transition-all"
            >
              Guardar Categoría
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddCategoryForm;
