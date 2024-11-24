import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContextGlobal } from "../Components/utils/global.context";
import AvailabilityCalendar from "./AvailabilityCalendar";

const policies = [
  {
    title: "Cuidado del producto",
    description:
      "Mantenga el producto en un lugar seco y evite la exposición prolongada al sol para preservar su calidad.",
  },
  {
    title: "Precauciones de uso",
    description: "No utilizar el producto en condiciones extremas de temperatura para evitar daños.",
  },
  {
    title: "Garantía",
    description: "El producto tiene una garantía de 1 año que cubre defectos de fabricación.",
  },
];

const ProductDetail = () => {
  const { state } = useContextGlobal(); // Acceder al estado global
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false); // Estado para mostrar el calendario
  const navigate = useNavigate();

  // Filtrar el producto específico desde el array vehicles en el contexto global
  const product = state.vehicles.find((vehicle) => vehicle.productId === Number(id));

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0].url); // Primera imagen como activa
    }
}, [product]);

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="w-full min-h-screen">
      {/* Encabezado */}
      <header className="m-auto flex items-center py-4 px-7 w-full">
        <Button size="sm" variant="text" className="flex items-center justify-end" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-6 w-6 text-deepTeal" />
        </Button>
        <div className="flex flex-col items-start ml-0 sm:ml-12">
          <h4 className="text-lg text-customBlack">{product.category.categoryName.toUpperCase()}</h4>
          <h3 className="text-2xl text-black font-semibold text-left flex-grow">{product.name}</h3>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="m-auto mt-8">
        <section className="flex justify-between gap-5 xl:flex-row flex-col">
          {/* Información del producto */}
          <div className="max-w-[792px] bg-mintTeal py-6 pr-0 pl-0 sm:pl-[115px] rounded-l-none sm:rounded-r-3xl flex flex-col sm:flex-row">
            <div className="text-lg text-start w-full sm:w-auto pr-0 sm:pr-[115px] pb-12 sm:pb-0 xl:pr-0 flex sm:flex-col flex-row items-start sm:items-stretch justify-center sm:justify-around">
              {/* Característica: Velocidad máxima */}
              <div className="flex flex-col">
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.maximumSpeed}</strong>
                  <span className="text-lg text-black"> km/h</span>
                  <br />
                  velocidad máxima
                </p>
              </div>
              {/* Característica: Potencia del motor */}
              <div className="flex flex-col">
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.enginePower}</strong>
                  <span className="text-lg text-black"> w</span>
                  <br />
                  potencia máxima del motor
                </p>
              </div>
              {/* Característica: Tiempo de carga */}
              <div className="flex flex-col">
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.chargeTime}</strong>
                  <span className="text-lg text-black"> horas</span>
                  <br />
                  carga de 0% a 100%
                </p>
              </div>
            </div>

            {/* Imagen principal */}
            <div className="flex justify-center items-center">
              <img
                src={activeImage}
                alt={product.name}
                className="rounded-3xl w-[90%] sm:w-auto xl:w-[566px] shadow-md sm:ml-[15%]"
              />
            </div>
          </div>

          {/* Precio, plan y botón de reservar */}
          <div className="bg-customGray p-6 rounded-2xl shadow-md w-[80%] lg:w-[40%] m-auto xl:mx-0 xl:w-[338px] h-auto xl:mr-[8%]">
            <h3 className="text-lg font-semibold text-start">PRECIOS Y PLANES</h3>
            <div className="mt-4 space-y-2">
              {/* Opciones de precios dinámicas */}
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">Alquiler por hora</span>
                  <br />
                  <span className="text-lg">${product.pricePerHour}/</span>
                  <span className="font-semibold text-[11px]">por hora</span>
                </span>
              </label>
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">Alquiler diario</span>
                  <br />
                  <span className="text-lg">${product.pricePerDay}/</span>
                  <span className="font-semibold text-[11px]"> por día</span>
                </span>
              </label>
            </div>

            {/* Botón de reservar */}
            <div className="mt-8">
              <button
                onClick={() => setShowCalendar(true)} // Mostrar calendario al hacer clic
                className="bg-[#32ceb1] text-white px-4 py-2 rounded-md w-full">
                RESERVAR AHORA
              </button>
            </div>
          </div>
        </section>

        {/* Mostrar el calendario en un modal */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full">
              <AvailabilityCalendar productId={product.productId} Pasar ID del producto al calendario />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCalendar(false)} // Cerrar el modal
                  className="text-red-600 font-bold">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Carrusel de imágenes */}
        <section className="hidden lg:block mt-8 overflow-x-auto md:overflow-hidden">
          <div className="flex md:justify-center gap-4 md:flex-nowrap">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${product.name} - imagen ${index + 1}`}
                className={`h-24 w-32 object-cover cursor-pointer rounded-lg border ${
                  activeImage === image.url ? "border-aquaTeal" : "border-customGrayTransparent opacity-50"
                }`}
                onClick={() => setActiveImage(image.url)}
              />
            ))}
          </div>
        </section>

        {/* Políticas */}
        <section className="w-full bg-gray-100 p-6">
          <h3 className="text-2xl font-semibold my-4 text-black underline" style={{ textDecorationColor: "#6adcc7" }}>
            {" "}
            POLÍTICA DE USO:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <div key={index} className="bg-white p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{policy.title}</h3>
                <p className="text-gray-700">{policy.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
