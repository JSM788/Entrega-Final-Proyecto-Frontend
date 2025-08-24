import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  IconButton,
  Button,
} from "@material-tailwind/react";
import useIsMobile from "../../../shared/hooks/useIsMobile";
import MobileMessage from "../../../shared/ui/MobileMessage";
import { useEffect, useState } from "react";
import { useContextGlobal } from "../../../app/store/GlobalContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import AddCategoryForm from "./AddCategoryForm";
import EditCategoryForm from "./EditCategoryForm"; // Importar el nuevo componente

const TABLE_HEAD = ["ID", "Título", "Descripción", "Acciones"];

export const AdminCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Estado para la categoría en edición
  const { state } = useContextGlobal();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // --- FETCH FUNCTIONS ---
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/categories`, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedCategories = data.map((category) => ({
          id: category.categoryId,
          title: category.categoryName,
          description: category.categoryDescription || "Sin descripción",
          imageUrl: category.categoryImageUrl || "https://via.placeholder.com/50",
        }));
        setCategoriesList(formattedCategories);
      } else {
        console.error("Error al obtener las categorías:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [state.accessToken]);

  // --- HANDLER FUNCTIONS ---
  const handleAddCategory = (newCategory) => {
    fetch(`${baseUrl}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`,
      },
      body: JSON.stringify({
        categoryName: newCategory.title,
        categoryDescription: newCategory.description,
        categoryImageUrl: newCategory.imageUrl,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories(); // Re-fetch para obtener la lista actualizada con el nuevo ID
        setShowAddForm(false);
        Swal.fire({
          icon: "success",
          title: "Categoría agregada",
          text: `La categoría "${newCategory.title}" ha sido agregada.`,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al agregar la categoría.",
          showConfirmButton: false,
          timer: 2000,
        });
      });
  };

  const handleUpdateCategory = (updatedCategory) => {
    console.log("handleUpdateCategory - updatedCategory (from form):", updatedCategory);
    fetch(`${baseUrl}/api/categories/${updatedCategory.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`,
      },
      body: JSON.stringify({
        categoryName: updatedCategory.title,
        categoryDescription: updatedCategory.description,
        categoryImageUrl: updatedCategory.imageUrl,
      }),
    })
      .then((response) => {
        console.log("handleUpdateCategory - Fetch response:", response);
        return response.json();
      })
      .then((backendResponse) => {
        console.log("handleUpdateCategory - backendResponse (from backend):", backendResponse);

        const formattedReturnedCategory = {
          id: backendResponse.categoryId,
          title: backendResponse.categoryName,
          description: backendResponse.categoryDescription || "Sin descripción",
          imageUrl: backendResponse.categoryImageUrl || "https://via.placeholder.com/50",
        };

        setCategoriesList((prevCategories) => {
          console.log("handleUpdateCategory - prevCategories (before update):", prevCategories);
          const newCategoriesList = prevCategories.map((cat) => {
            const isMatch = Number(cat.id) === Number(formattedReturnedCategory.id);
            console.log(`Comparing cat.id: ${cat.id} (${typeof cat.id}) with formattedReturnedCategory.id: ${formattedReturnedCategory.id} (${typeof formattedReturnedCategory.id}). Match: ${isMatch}`);
            return isMatch
              ? formattedReturnedCategory
              : cat;
          });
          console.log("handleUpdateCategory - newCategoriesList (after map):", newCategoriesList);
          return newCategoriesList;
        });
        setEditingCategory(null); // Salir del modo edición
        Swal.fire({
          icon: "success",
          title: "Categoría actualizada",
          text: `La categoría "${formattedReturnedCategory.title}" ha sido actualizada.`,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("handleUpdateCategory - Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al actualizar la categoría.",
          showConfirmButton: false,
          timer: 2000,
        });
      });
  };

  const handleDeleteCategory = async (id, title) => {
    const result = await Swal.fire({
      title: `Eliminar la categoría`,
      html: `
        <p>Estás a punto de eliminar la categoría <strong>"${title}"</strong>.</p>
        <p>Esto podría eliminar todos los productos asociados a esta categoría.</p>
        <p>¿Estás seguro de que deseas continuar?</p>
      `,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#32CEB1",
      cancelButtonColor: "#D9534F",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });
        if (response.ok) {
          fetchCategories(); // Re-fetch para actualizar la lista
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: `La categoría "${title}" ha sido eliminada.`,
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          throw new Error("Error al eliminar la categoría.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar la categoría.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowAddForm(false); // Ocultar el form de agregar si estuviera abierto
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  // --- RENDER LOGIC ---
  let content;
  if (editingCategory) {
    content = (
      <EditCategoryForm
        editingCategory={editingCategory}
        onUpdateCategory={handleUpdateCategory}
        onCancel={handleCancelEdit}
      />
    );
  } else if (showAddForm) {
    content = <AddCategoryForm onAddCategory={handleAddCategory} />;
  } else {
    content = (
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h2 className="text-lg font-semibold">Lista de Categorías</h2>
          <p className="text-sm font-normal text-gray-600">
            Información sobre todas las categorías
          </p>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {loading ? (
            <div className="text-center p-4"><h2>Cargando...</h2></div>
          ) : (
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
                {categoriesList.map((category, index) => {
                  const isLast = index === categoriesList.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={category.id}>
                      <td className={classes}><p className="font-normal">{index + 1}</p></td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={category.imageUrl} alt="" size="sm" className="rounded-full border border-aquaTeal" />
                          <p className="font-normal">{category.title}</p>
                        </div>
                      </td>
                      <td className={classes}><p className="font-normal">{category.description}</p></td>
                      <td className={classes}>
                        <Tooltip content="Editar categoría">
                          <IconButton variant="text" onClick={() => handleEditClick(category)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar categoría">
                          <IconButton variant="text" onClick={() => handleDeleteCategory(category.id, category.title)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col px-10">
      <div className="flex justify-between items-center mb-4">
        <div><h1 className="text-2xl font-bold">Categorías</h1></div>
        {!editingCategory && (
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="filled" className="bg-[#32CEB1]">
                {showAddForm ? "Cancelar" : "Agregar Categoría"}
            </Button>
        )}
      </div>
      {content}
    </div>
  );
};