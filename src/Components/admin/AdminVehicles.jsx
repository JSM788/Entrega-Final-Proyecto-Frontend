import { ChevronUpDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  IconButton,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useContextGlobal } from "../utils/global.context";
import Swal from "sweetalert2";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";
import AddVehicleForm from "./AddVehicleForm";

const TABLE_HEAD = ["ID", "Nombre", "Categoría", "Precio por hora", "Acciones"];

export const AdminVehicles = () => {
  const { state } = useContextGlobal();
  const [vehicleList, setVehicleList] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Controla si se muestra el formulario

  useEffect(() => {
    console.log("Productos en el contexto global:", state.vehicles);
    setVehicleList(state.vehicles || []);
  }, [state.vehicles]);

  const handleAddClick = () => {
    setIsAdding(!isAdding); // Alterna entre mostrar y ocultar el formulario
  };

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
          `http://localhost:8080/api/products/${productId}`,
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
            text: "El vehículo ha sido eliminado.",
            confirmButtonColor: "#32CEB1",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el vehículo.",
            confirmButtonColor: "#32CEB1",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el vehículo.",
          confirmButtonColor: "#32CEB1",
        });
        console.error("Error en la solicitud:", error);
      }
    }
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  return (
    <div className="flex flex-col px-10">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button
          variant="filled"
          className="bg-[#32CEB1]"
          onClick={handleAddClick}
        >
          {isAdding ? "Cancelar" : "Agregar Vehículo"}
        </Button>
      </div>

      {isAdding && (
        <AddVehicleForm
          vehicleList={vehicleList}
          setVehicleList={setVehicleList}
          state={state}
          setIsAdding={setIsAdding}
        />
      )}

      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <h1 className="text-lg font-semibold">Lista de Vehículos</h1>
          <p className="text-sm font-normal text-gray-600">
            Información sobre todos los vehículos
          </p>
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
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    </h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicleList.map(
                (
                  { productId, name, category, pricePerHour, images },
                  index
                ) => {
                  const isLast = index === vehicleList.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={productId}>
                      <td className={classes}>
                        <p className="font-normal">{index + 1}</p>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={images[0]?.url}
                            alt={name}
                            size="sm"
                            className="rounded-full border border-aquaTeal"
                          />
                          <p className="font-normal">{name}</p>
                        </div>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{category?.categoryName}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">${pricePerHour}/hora</p>
                      </td>
                      <td className={classes}>
                        <div className="flex space-x-2">
                          <Tooltip content="Editar vehículo">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Eliminar vehículo">
                            <IconButton
                              variant="text"
                              onClick={() => handleDeleteVehicle(productId)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography variant="small" color="blue-gray" className="font-normal">
              Page 1 of 10
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm">Previous</Button>
              <Button variant="outlined" size="sm">Next</Button>
            </div>
          </CardFooter> */}
      </Card>
    </div>
  );
};
