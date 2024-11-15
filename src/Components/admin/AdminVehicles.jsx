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

const TABLE_HEAD = ["ID", "Nombre", "Categoría", "Precio por hora", "Acciones"];

// Hook personalizado para verificar si el dispositivo es móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajusta el tamaño según tus necesidades
    };

    // Chequear el tamaño inicial y añadir event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const AdminVehicles = () => {
  const { state } = useContextGlobal();
  const [vehicleData, setVehicleData] = useState({
    name: "",
    category: "",
    year: "",
    price: "",
    img: "",
  });

  const [vehicleList, setVehicleList] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Controla si se muestra el formulario

  useEffect(() => {
    console.log("Productos en el contexto global:", state.vehicles);
    setVehicleList(state.vehicles || []);
  }, [state.vehicles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleAddClick = () => {
    setIsAdding(!isAdding); // Alterna entre mostrar y ocultar el formulario
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVehicle = {
      id: `VH00${vehicleList.length + 1}`,
      ...vehicleData,
    };

    setVehicleList([...vehicleList, newVehicle]);
    Swal.fire({
      icon: "success",
      title: "¡Vehículo agregado!",
      text: "El vehículo se ha añadido exitosamente.",
      confirmButtonColor: "#32CEB1",
    });
    setVehicleData({ name: "", category: "", year: "", price: "", img: "" });
    setIsAdding(false); // Cierra el formulario al añadir
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

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Acceso no disponible
          </h2>
          <p className="text-gray-700">
            La página de administración no está disponible en dispositivos
            móviles.
          </p>
        </div>
      </div>
    );
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
        <Card className="mb-4">
          <CardBody>
            <h2 className="text-lg font-medium mb-4">Agregar Vehículo</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {["name", "category", "year", "price", "img"].map(
                (field, index) => (
                  <div key={index}>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace("img", "URL de Imagen")}
                    </label>
                    <input
                      name={field}
                      type={
                        field === "year" || field === "price"
                          ? "number"
                          : "text"
                      }
                      value={vehicleData[field]}
                      onChange={handleInputChange}
                      required
                      className="block w-full border border-gray-300 rounded-md p-2"
                      placeholder={`Ingrese ${
                        field === "img" ? "la URL de la imagen" : field
                      }`}
                    />
                  </div>
                )
              )}
              <Button type="submit" variant="filled" className="bg-[#32CEB1]">
                Guardar Vehículo
              </Button>
            </form>
          </CardBody>
        </Card>
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
                        <p className="font-normal">{productId}</p>
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
