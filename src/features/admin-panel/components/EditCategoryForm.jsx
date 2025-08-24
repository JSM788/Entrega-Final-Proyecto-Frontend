import { useState, useEffect } from "react";
import { Input, Textarea, Card, CardBody } from "@material-tailwind/react";

const EditCategoryForm = ({ onUpdateCategory, editingCategory, onCancel }) => {
  const [category, setCategory] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (editingCategory) {
      setCategory({
        title: editingCategory.title,
        description: editingCategory.description,
        imageUrl: editingCategory.imageUrl,
        id: editingCategory.id,
      });
    } else {
        onCancel();
    }
  }, [editingCategory, onCancel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      title: category.title.length < 3 ? "El título debe tener al menos 3 caracteres." : "",
      description: category.description.length < 3 ? "La descripción debe tener al menos 3 caracteres." : "",
      imageUrl: !category.imageUrl.startsWith("http") ? "La URL de la imagen debe comenzar con http." : "",
    };
    setError(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    onUpdateCategory({ ...editingCategory, ...category });
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg border-gray-200">
      <CardBody>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Editar Categoría
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <Input
              label="Título"
              value={category.title}
              onChange={(e) => setCategory({ ...category, title: e.target.value })}
            />
            {error.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
          </div>
          <div className="mb-4">
            <Textarea
              label="Descripción"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
            />
            {error.description && <p className="text-red-500 text-sm mt-1">{error.description}</p>}
          </div>
          <div className="mb-4">
            <Input
              label="URL de la Imagen"
              value={category.imageUrl}
              onChange={(e) => setCategory({ ...category, imageUrl: e.target.value })}
            />
            {error.imageUrl && <p className="text-red-500 text-sm mt-1">{error.imageUrl}</p>}
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
              Actualizar Categoría
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditCategoryForm;
