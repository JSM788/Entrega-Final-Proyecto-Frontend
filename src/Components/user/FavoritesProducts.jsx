import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useContextGlobal } from "../../Components/utils/global.context.jsx";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["ID", "Título", "Descripción", "Acciones"];
const mockvehicleList = [
  {
    productId: 1,
    title: "Scooter",
    description: "Categoría relacionada con gadgets y software.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    productId: 2,
    title: "Motos",
    description: "Recursos y cursos educativos.",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    productId: 3,
    title: "Autos",
    description: "Todo sobre deportes y actividades físicas.",
    imageUrl: "https://via.placeholder.com/50",
  },
];

export const FavoritesProducts = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const { state } = useContextGlobal();

  useEffect(() => {
    console.log("Productos en el contexto global:", mockvehicleList);//pintarlos del GET API
    setVehicleList(mockvehicleList || []);
  }, [mockvehicleList]);

  const handleDeleteVehicle = async (productId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
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
          `http://localhost:8080/api/favorites/${productId}`,//reemplazar API
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
            },
          }
        );

        if (response.ok) {
          setVehicleList(
            vehicleList.filter((vehicle) => vehicle.productId !== productId)
          );
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: "El vehículo ha sido eliminado de favoritos.",
            confirmButtonColor: "#32CEB1",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el vehículo de favoritos.",
            confirmButtonColor: "#32CEB1",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el vehículo de favoritos.",
          confirmButtonColor: "#32CEB1",
        });
        console.error("Error en la solicitud:", error);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-10">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="font-semibold">Lista de Favoritos</h1>
          <h2 className="mt-1 font-normal">
            Información sobre todos los favoritos
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
              {vehicleList.map((vehicle, index) => {
                const isLast = index === vehicleList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={vehicle.productId}>
                    <td className={classes}>
                      <p className="font-normal">{index + 1}</p>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={vehicle.imageUrl}
                          alt=""
                          size="sm"
                          className="rounded-full border border-aquaTeal"
                        />
                        <p className="font-normal">{vehicle.title}</p>
                      </div>
                    </td>
                    <td className={classes}>
                      <p className="font-normal">{vehicle.description}</p>
                    </td>
                    <td className={classes}>
                      <div className="flex space-x-2">
                        <Tooltip content="Eliminar favorito">
                          <IconButton
                            variant="text"
                            onClick={() =>
                              handleDeleteVehicle(vehicle.productId)
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
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
