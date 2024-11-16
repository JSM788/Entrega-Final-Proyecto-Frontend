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

const TABLE_HEAD = ["ID", "Nombre", "Categoría", "Precio por hora", "Acciones"];

export const AdminVehicles = () => {
  const { state } = useContextGlobal();
  const [vehicleData, setVehicleData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    images: [{ url: "" }],
    maximum_speed: "",
    engine_power: "",
    number_passengers: "",
    charge_time: "",
    brand_name: "",
    manufacturing_country: "",
    rental_city: "",
    type_product: "",
    categoryId: "",
    characteristics: [],
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

  const handleAddImage = () => {
    setVehicleData({
      ...vehicleData,
      images: [...vehicleData.images, { url: "" }],
    });
  };

  const handleImageChange = (e, index) => {
    const newImages = [...vehicleData.images];
    newImages[index].url = e.target.value;
    setVehicleData({ ...vehicleData, images: newImages });
  };

  const handleAddCharacteristic = () => {
    setVehicleData({
      ...vehicleData,
      characteristics: [
        ...vehicleData.characteristics,
        {
          featureName: "",
          featureImageUrl: "",
          featureDescription: "",
        },
      ],
    });
  };

  const handleCharacteristicChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCharacteristics = [...vehicleData.characteristics];
    updatedCharacteristics[index][name] = value;
    setVehicleData({ ...vehicleData, characteristics: updatedCharacteristics });
  };

  const handleAddClick = () => {
    setIsAdding(!isAdding); // Alterna entre mostrar y ocultar el formulario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si ya existe un vehículo con el mismo nombre
    const vehicleExists = vehicleList.some(
      (vehicle) => vehicle.name.toLowerCase() === vehicleData.name.toLowerCase()
    );

    if (vehicleExists) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ya existe un vehículo con el mismo nombre.",
        confirmButtonColor: "#32CEB1",
      });
      return; // Si existe, no continuar con la creación del vehículo
    }

    const newVehicle = {
      name: vehicleData.name,
      type_product: vehicleData.type_product,
      description: vehicleData.description,
      price_per_hour: parseFloat(vehicleData.price),
      price_per_day: parseFloat(vehicleData.price) * 24,
      price_per_month: parseFloat(vehicleData.price) * 30,
      price_per_year: parseFloat(vehicleData.price) * 365,
      maximum_speed: parseFloat(vehicleData.maximum_speed),
      engine_power: parseFloat(vehicleData.engine_power),
      status: "available",
      number_passengers: parseInt(vehicleData.number_passengers),
      charge_time: parseInt(vehicleData.charge_time),
      brand_name: vehicleData.brand_name,
      manufacturing_country: vehicleData.manufacturing_country,
      rental_city: vehicleData.rental_city,
      categoryId: vehicleData.categoryId,
      images: vehicleData.images,
      characteristics: vehicleData.characteristics,
    };

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(newVehicle),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setVehicleList([...vehicleList, addedProduct]);
        Swal.fire({
          icon: "success",
          title: "¡Vehículo agregado!",
          text: "El vehículo se ha añadido exitosamente.",
          confirmButtonColor: "#32CEB1",
        });
        setVehicleData({
          name: "",
          category: "",
          price: "",
          description: "",
          images: [{ url: "" }],
          maximum_speed: "",
          engine_power: "",
          number_passengers: "",
          charge_time: "",
          brand_name: "",
          manufacturing_country: "",
          rental_city: "",
          type_product: "",
          categoryId: "",
          characteristics: [],
        });
        setIsAdding(false);
      } else {
        throw new Error("Error al agregar el producto");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el vehículo.",
        confirmButtonColor: "#32CEB1",
      });
      console.error("Error en la solicitud:", error);
    }
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
        <Card className="mb-4">
          <CardBody>
            <h2 className="text-lg font-medium mb-4">Agregar Vehículo</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Nombre del Vehículo
                </label>
                <input
                  name="name"
                  value={vehicleData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el nombre del vehículo"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Tipo de Producto
                </label>
                <input
                  name="type_product"
                  value={vehicleData.type_product}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el tipo"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Descripción
                </label>
                <input
                  name="description"
                  value={vehicleData.description}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese la descripción"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Precio por Hora
                </label>
                <input
                  name="price"
                  type="number"
                  value={vehicleData.price}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el precio por hora"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Velocidad Máxima
                </label>
                <input
                  name="maximum_speed"
                  type="number"
                  value={vehicleData.maximum_speed}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese la velocidad máxima"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Potencia del Motor
                </label>
                <input
                  name="engine_power"
                  type="number"
                  value={vehicleData.engine_power}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese la potencia del motor"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Número de Pasajeros
                </label>
                <input
                  name="number_passengers"
                  type="number"
                  value={vehicleData.number_passengers}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el número de pasajeros"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Tiempo de Carga
                </label>
                <input
                  name="charge_time"
                  type="number"
                  value={vehicleData.charge_time}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el tiempo de carga"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Marca
                </label>
                <input
                  name="brand_name"
                  value={vehicleData.brand_name}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese la marca"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  País de Fabricación
                </label>
                <input
                  name="manufacturing_country"
                  value={vehicleData.manufacturing_country}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese el país de fabricación"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Ciudad de Alquiler
                </label>
                <input
                  name="rental_city"
                  value={vehicleData.rental_city}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Ingrese la ciudad de alquiler"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Categoría
                </label>
                <select
                  name="categoryId"
                  value={vehicleData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="1">Autos</option>
                  <option value="2">Motos</option>
                  <option value="3">Scooter</option>
                  <option value="4">Bicicletas</option>
                </select>
              </div>

              <div>
                <hr />
                <label className="block mt-2 mb-1 text-sm font-bold text-gray-700">
                  Imágenes
                </label>
                {vehicleData.images.map((image, index) => (
                  <input
                    key={index}
                    name={`image-${index}`}
                    value={image.url}
                    onChange={(e) => handleImageChange(e, index)}
                    required={index === 0} // El primer campo es obligatorio
                    className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder={`URL de la imagen ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="border border-customBlack text-black font-semibold p-2 rounded-md w-3/6"
                >
                  Añadir Imagen
                </button>
              </div>

              {/* Mostrar características añadidas */}
              <hr />
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Características:
              </label>
              {vehicleData.characteristics.map((characteristic, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    name="featureName"
                    value={characteristic.featureName}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder="Nombre de la característica"
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    name="featureImageUrl"
                    value={characteristic.featureImageUrl}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder="URL de la imagen"
                    className="border border-gray-300 rounded-md p-2 w-1/2"
                  />
                  <input
                    name="featureDescription"
                    value={characteristic.featureDescription}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder="Descripción"
                    className="border border-gray-300 rounded-md p-2 w-1/2"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddCharacteristic}
                className="border border-customBlack text-black font-semibold p-2 rounded-md w-3/6 m-auto"
              >
                Añadir Característica
              </button>

              <button
                type="submit"
                className="bg-[#2A606E] text-white p-2 rounded-md"
              >
                Añadir Vehículo
              </button>
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
