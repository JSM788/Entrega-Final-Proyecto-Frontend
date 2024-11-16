import { Card, CardHeader, CardBody, Avatar, Tooltip, IconButton } from "@material-tailwind/react";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";
import { useEffect, useState } from "react";
import { useContextGlobal } from "../utils/global.context";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const TABLE_HEAD = ["ID", "Título", "Descripción", "Acciones"];
const fakeCategories = [
  {
    id: 1,
    title: "Scooter",
    description: "Categoría relacionada con gadgets y software.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    title: "Motos",
    description: "Recursos y cursos educativos.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    title: "Autos",
    description: "Todo sobre deportes y actividades físicas.",
    imageUrl: "https://via.placeholder.com/50",
  },
];

export const AdminCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const { state } = useContextGlobal();

  useEffect(() => {
    console.log("Categorias en el contexto global:", fakeCategories);//pintarlos del GET API
    setCategoriesList(fakeCategories || []);
  }, [fakeCategories]);

  const handleDeleteCategories = async (id, title) => {
    const result = await Swal.fire({
      title: `¿Eliminar la categoría "${title}"?`,
      html: `
        <p>Estás a punto de eliminar la categoría <strong>"${title}"</strong>.</p>
        <p>Esto podría eliminar todos los productos asociados a esta categoría.</p>
        <p>¿Estás seguro de que deseas continuar?</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#32CEB1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/categories/${id}`,//reemplazar API
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
            confirmButtonColor: "#32CEB1",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la categoría.",
            confirmButtonColor: "#32CEB1",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar la categoría.",
          confirmButtonColor: "#32CEB1",
        });
        console.error("Error en la solicitud:", error);
      }
    }
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="font-semibold">Lista de Categorías</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todas las categorías
          </h2>
        </CardHeader>

        <CardBody className="overflow-auto px-0">
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
                        <Tooltip content="Eliminar favorito">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              handleDeleteCategories(category.id, category.title)
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
        </CardBody>
      </Card>
    </div>
  );
};
