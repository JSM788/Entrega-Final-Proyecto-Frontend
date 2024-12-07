import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  IconButton,
  Button,
} from "@material-tailwind/react";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";
import { useEffect, useState } from "react";
import { useContextGlobal } from "../utils/global.context";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import AddCategoryForm from "./AddCategoryForm";

const TABLE_HEAD = ["ID", "Título", "Descripción", "Acciones"];

export const AdminCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { state } = useContextGlobal();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
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
            imageUrl:
              category.categoryImageUrl || "https://via.placeholder.com/50", // Imagen por defecto si no hay URL
          }));
          setCategoriesList(formattedCategories);
        } else {
          console.error(
            "Error al obtener las categorías:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCategories();
  }, [state.accessToken]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
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
      .then((addedCategory) => {
        setCategoriesList([
          ...categoriesList,
          {
            id: addedCategory.categoryId,
            title: addedCategory.categoryName,
            description: addedCategory.categoryDescription,
            imageUrl:
              addedCategory.categoryImageUrl ||
              "https://via.placeholder.com/50",
          },
        ]);
        setShowForm(false); // Cerrar formulario al agregar categoría
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

  const handleDeleteCategories = async (id, title) => {
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
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(
          `${baseUrl}/api/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
            },
          }
        );

        if (response.ok) {
          setCategoriesList(
            categoriesList.filter((category) => category.id !== id)
          );
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
        console.error("Error en la solicitud:", error);
      }
    }
  };

  const handleAddClick = () => {
    setShowForm(!showForm); // Alterna entre mostrar y ocultar el formulario
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  return (
    <div className="flex flex-col px-10">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button
          onClick={handleAddClick}
          variant="filled"
          className="bg-[#32CEB1]"
        >
          {showForm ? "Cancelar" : "Agregar Categoría"}
        </Button>
      </div>

      {showForm && <AddCategoryForm onAddCategory={handleAddCategory} />}

      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="font-semibold">Lista de Categorías</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todas las categorías
          </h2>
        </CardHeader>

        <CardBody className="overflow-auto px-0">
          {loading ? (
            <div className="text-center p-4">
              <h2>Cargando...</h2>
            </div>
          ) : (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
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
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={category.id}>
                      <td className={classes}>
                        <p className="font-normal">{index + 1}</p>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={category.imageUrl}
                            alt=""
                            size="sm"
                            className="rounded-full border border-aquaTeal"
                          />
                          <p className="font-normal">{category.title}</p>
                        </div>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{category.description}</p>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar categoría">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar categoría">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              handleDeleteCategories(
                                category.id,
                                category.title
                              )
                            }
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
          )}
        </CardBody>
      </Card>
    </div>
  );
};
