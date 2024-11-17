import { useState } from "react";
import Swal from "sweetalert2";
import { Card, CardBody, Button } from "@material-tailwind/react";

const AddVehicleForm = ({
  vehicleList,
  setVehicleList,
  state,
  setIsAdding,
}) => {
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

  return (
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
  );
};

export default AddVehicleForm;
