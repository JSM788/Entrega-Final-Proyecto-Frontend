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
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import { useContextGlobal } from "../utils/global.context";
import Swal from "sweetalert2";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";
import AddVehicleForm from "./AddVehicleForm";

const TABLE_HEAD = ["ID", "Nombre", "Categoría", "Precio por hora", "Acciones"];

export const AdminVehicles = () => {
  const { state } = useContextGlobal();
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      console.log("Productos en el contexto global:", state.vehicles);
      setVehicleList(state.vehicles || []);
      setLoading(false);
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categories", {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchVehicles();
    fetchCategories();
  }, [state.vehicles, state.accessToken]);

  // Usar useMemo para memorizar el mapa de categorías
  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.categoryId] = cat.categoryName;
      return acc;
    }, {});
  }, [categories]); // Solo se recalcula cuando las categorías cambian

  const handleAddClick = () => {
    setIsAdding(!isAdding);
  };

  const handleDeleteVehicle = async (productId, name) => {
    const result = await Swal.fire({
      title: "Eliminar el vehículo",
      html: `¿Desea eliminar <strong>${name}</strong> de tu lista de vehículos?`,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#32CEB1",
      cancelButtonColor: "#D9534F",
      confirmButtonText: "Confirmar",
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
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          throw new Error("No se pudo eliminar el vehículo.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el vehículo.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  const updateCategory = async (vehicleId, newCategoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${vehicleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryId: newCategoryId }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Actualizada!",
          text: "La categoría del vehículo ha sido actualizada.",
          showConfirmButton: false,
          timer: 2000,
        });
        setVehicleList((prev) =>
          prev.map((vehicle) =>
            vehicle.productId === vehicleId
              ? { ...vehicle, categoryId: newCategoryId }
              : vehicle
          )
        );
      } else {
        throw new Error("Error al actualizar la categoría.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la categoría.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;

  if (loading || categories.length === 0) {
    return <div>Cargando...</div>; // O cualquier otro indicador de carga
  }

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
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
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
                          <Select
                            value={String(category?.categoryId)}
                            onChange={(value) =>
                              updateCategory(productId, value)
                            }
                          >
                            {categories.map(({ categoryId, categoryName }) => (
                              <Option
                                key={categoryId}
                                value={String(categoryId)}
                              >
                                {categoryName}
                              </Option>
                            ))}
                          </Select>
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
                                onClick={() =>
                                  handleDeleteVehicle(productId, name)
                                }
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
          )}
        </CardBody>
      </Card>
    </div>
  );
};
