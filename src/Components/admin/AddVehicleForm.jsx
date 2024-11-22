import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Card, CardBody } from "@material-tailwind/react";

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
    categoryId: "",
    characteristics: [],
    itemProducts: [
      {
        nro_serial: "",
        color: "",
        status: "",
        city: { idCity: "" },
      },
    ],
  });

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]); // Estado para las ciudades
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categories", {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("No se pudieron cargar las categorías");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar las categorías.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };

    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/cities");
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        } else {
          throw new Error("Error al cargar las ciudades");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar las ciudades.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };
    fetchCities();

    fetchCategories();
  }, [state.accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    // Validación de nombre
    if (!vehicleData.name || vehicleData.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    }

    // Validación de categoría
    if (!vehicleData.categoryId) {
      errors.categoryId = "Debe seleccionar una categoría válida";
    }

    // Validación de descripción
    if (!vehicleData.description || vehicleData.description.length < 3) {
      errors.description = "La descripción debe tener al menos 3 caracteres";
    }

    // Validación de precio
    if (!vehicleData.price || vehicleData.price < 1) {
      errors.price = "El precio no puede ser menor a 0";
    }

    // Validación de velocidad máxima
    if (!vehicleData.maximum_speed || vehicleData.maximum_speed < 1) {
      errors.maximum_speed = "La velocidad máxima no puede ser menor a 0";
    }

    // Validación de potencia del motor
    if (!vehicleData.engine_power || vehicleData.engine_power < 1) {
      errors.engine_power = "La potencia del motor no puede ser menor a 0";
    }

    // Validación de número de pasajeros
    if (!vehicleData.number_passengers || vehicleData.number_passengers < 1) {
      errors.number_passengers =
        "El número de pasajeros no puede ser menor a 0";
    }

    // Validación de tiempo de carga
    if (!vehicleData.charge_time || vehicleData.charge_time < 1) {
      errors.charge_time = "El tiempo de carga no puede ser menor a 0";
    }

    // Validación de marca
    if (!vehicleData.brand_name || vehicleData.brand_name.length < 3) {
      errors.brand_name = "La marca debe tener al menos 3 caracteres";
    }

    // Validación de imágenes
    vehicleData.images.forEach((image, index) => {
      if (!image.url.startsWith("http")) {
        errors[`image-${index}`] = `La URL de la imagen ${
          index + 1
        } debe empezar con http`;
      }
    });

    // Validación de ciudades
    vehicleData.itemProducts.forEach((item, index) => {
      if (!item.city || !item.city.idCity) {
        errors[
          `itemProduct-${index}-city`
        ] = `Debe seleccionar una ciudad para el ítem ${index + 1}`;
      }
      if (!item.nro_serial || item.nro_serial.length < 3) {
        errors[
          `itemProduct-${index}-nro_serial`
        ] = `El N° de serie del producto  ${
          index + 1
        } debe tener al menos 3 caracteres`;
      }
      if (!item.color || item.color.length < 3) {
        errors[
          `itemProduct-${index}-color`
        ] = `El color del producto  ${
          index + 1
        } debe tener al menos 3 caracteres`;
      }
    });

    // Validación de características
    vehicleData.characteristics.forEach((char, index) => {
      if (!char.featureName || char.featureName.length < 3) {
        errors[
          `characteristic-${index}-name`
        ] = `El nombre de la característica ${
          index + 1
        } debe tener al menos 3 caracteres`;
      }
      if (!char.featureImageUrl.startsWith("http")) {
        errors[`characteristic-${index}-url`] = `La URL de la imagen ${
          index + 1
        } debe empezar con http`;
      }
      if (!char.featureDescription || char.featureDescription.length < 10) {
        errors[
          `characteristic-${index}-description`
        ] = `La descripción de la característica ${
          index + 1
        } debe tener al menos 10 caracteres`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItemProduct = () => {
    setVehicleData({
      ...vehicleData,
      itemProducts: [
        ...vehicleData.itemProducts,
        {
          nro_serial: "",
          color: "",
          status: "",
          city: { idCity: "" },
        },
      ],
    });
  };

  const handleItemProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItemProducts = [...vehicleData.itemProducts];
    if (name === "idCity") {
      // Si el cambio es en la ciudad, actualiza el valor correspondiente
      updatedItemProducts[index].city[name] = value;
    } else {
      // Para otros campos, actualiza el valor directamente en el objeto
      updatedItemProducts[index][name] = value;
    }
    // Asegúrate de que status siempre sea "available"
    updatedItemProducts[index].status = "available";
    setVehicleData({ ...vehicleData, itemProducts: updatedItemProducts });
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

    if (!validateForm()) return; // Si la validación falla, no enviar el formulario

    // Verificar si ya existe un vehículo con el mismo nombre
    const vehicleExists = vehicleList.some(
      (vehicle) => vehicle.name.toLowerCase() === vehicleData.name.toLowerCase()
    );

    if (vehicleExists) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ya existe un vehículo con el mismo nombre.",
        showConfirmButton: false,
        timer: 2000,
      });
      return; // Si existe, no continuar con la creación del vehículo
    }

    const newVehicle = {
      name: vehicleData.name,
      description: vehicleData.description,
      price_per_hour: parseFloat(vehicleData.price),
      price_per_day: parseFloat(vehicleData.price) * 24,
      price_per_month: parseFloat(vehicleData.price) * 30,
      price_per_year: parseFloat(vehicleData.price) * 365,
      maximum_speed: parseFloat(vehicleData.maximum_speed),
      engine_power: parseFloat(vehicleData.engine_power),
      number_passengers: parseInt(vehicleData.number_passengers),
      charge_time: parseInt(vehicleData.charge_time),
      brand_name: vehicleData.brand_name,
      categoryId: vehicleData.categoryId,
      images: vehicleData.images,
      characteristics: vehicleData.characteristics,
      itemProducts: vehicleData.itemProducts,
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
          title: "¡Agregado!",
          text: "El vehículo se ha añadido exitosamente.",
          showConfirmButton: false,
          timer: 2000,
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
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg border-gray-200">
      <CardBody>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Agregar Vehículo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información general */}
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Información General
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Nombre del Vehículo <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={vehicleData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese el nombre del vehículo"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={vehicleData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.categoryId}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={vehicleData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                placeholder="Ingrese la descripción del vehículo"
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
          </fieldset>

          {/* Precios y especificaciones */}
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Precios y Especificaciones
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Precio por Hora ($) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  value={vehicleData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese el precio"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Velocidad Máxima (km/h){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="maximum_speed"
                  type="number"
                  value={vehicleData.maximum_speed}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese la velocidad máxima"
                />
                {formErrors.maximum_speed && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.maximum_speed}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Potencia del Motor <span className="text-red-500">*</span>
                </label>
                <input
                  name="engine_power"
                  type="number"
                  value={vehicleData.engine_power}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese la potencia del motor"
                />
                {formErrors.engine_power && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.engine_power}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Número de Pasajeros <span className="text-red-500">*</span>
                </label>
                <input
                  name="number_passengers"
                  type="number"
                  value={vehicleData.number_passengers}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese el número de pasajeros"
                />
                {formErrors.number_passengers && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.number_passengers}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Tiempo de Carga
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="charge_time"
                  type="number"
                  value={vehicleData.charge_time}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese el tiempo de carga"
                />
                {formErrors.charge_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.charge_time}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  name="brand_name"
                  value={vehicleData.brand_name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Ingrese la marca"
                />
                {formErrors.brand_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.brand_name}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Imágenes */}
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Imágenes del Vehículo
            </legend>
            {vehicleData.images.map((image, index) => (
              <div key={index}>
                <input
                  name={`image-${index}`}
                  value={image.url}
                  onChange={(e) => handleImageChange(e, index)}
                  required={index === 0} // El primer campo es obligatorio
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                  placeholder={`URL de la imagen ${index + 1}`}
                />
                {formErrors[`image-${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[`image-${index}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="border border-customBlack text-black font-semibold px-4 py-2 rounded-md"
            >
              Añadir Imagen
            </button>
          </fieldset>
          {/* Características */}
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Características del Vehículo
            </legend>
            {vehicleData.characteristics.map((characteristic, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <input
                    name="featureName"
                    value={characteristic.featureName}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder={`Nombre de la característica ${index + 1}`}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  {formErrors[`characteristic-${index}-name`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`characteristic-${index}-name`]}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    name="featureImageUrl"
                    value={characteristic.featureImageUrl}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder={`URL de la imagen ${index + 1}`}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  {formErrors[`characteristic-${index}-url`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`characteristic-${index}-url`]}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    name="featureDescription"
                    value={characteristic.featureDescription}
                    onChange={(e) => handleCharacteristicChange(e, index)}
                    placeholder={`Descripción ${index + 1}`}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  {formErrors[`characteristic-${index}-description`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`characteristic-${index}-description`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCharacteristic}
              className="border border-customBlack text-black font-semibold px-4 py-2 rounded-md"
            >
              Añadir Característica
            </button>
          </fieldset>
          {/* Item Products */}
          <fieldset className="border border-aquaTeal p-4 rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700">
              Item Products del Vehículo
            </legend>
            {vehicleData.itemProducts.map((item, index) => (
              <div key={index} className="mb-4 p-4 border border-[#2A606E] rounded-md">
                <h3 className="font-semibold mb-2">Producto {index + 1}</h3>
                <input
                  name="nro_serial"
                  value={item.nro_serial}
                  onChange={(e) => handleItemProductChange(e, index)}
                  placeholder={`Número de Serie del producto ${index + 1}`}
                  className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                 {formErrors[`itemProduct-${index}-nro_serial`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`itemProduct-${index}-nro_serial`]}
                    </p>
                  )}
                <input
                  name="color"
                  value={item.color}
                  onChange={(e) => handleItemProductChange(e, index)}
                  placeholder={`Color del producto ${index + 1}`}
                  className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                 {formErrors[`itemProduct-${index}-color`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`itemProduct-${index}-color`]}
                    </p>
                  )}
                <select
                  name="idCity"
                  value={item.city.idCity}
                  onChange={(e) => handleItemProductChange(e, index)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="" disabled>
                    Selecciona una ciudad para el producto {index + 1}
                  </option>
                  {cities.map((city) => (
                    <option key={city.idCity} value={city.idCity}>
                      {city.cityName}, {city.countryName}
                    </option>
                  ))}
                </select>
                {formErrors[`itemProduct-${index}-city`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`itemProduct-${index}-city`]}
                    </p>
                  )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItemProduct}
              className="border border-customBlack text-black font-semibold px-4 py-2 rounded-md"
            >
              Añadir Producto
            </button>
          </fieldset>

          {/* Botón de envío */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2A606E] text-white px-6 py-3 rounded-md shadow-md transition-all"
            >
              Añadir Vehículo
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddVehicleForm;
