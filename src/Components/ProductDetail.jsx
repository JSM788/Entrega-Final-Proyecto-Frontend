import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
// import productos from "../productos.json";
// import { useEffect, useState } from "react";
import { useContextGlobal } from "../Components/utils/global.context";

const ProductDetail = () => {
  const { state } = useContextGlobal(); // Acceder al estado global
  const { id } = useParams();
  // const [product, setProduct] = useState(null);
  // const [activeImage, setActiveImage] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const productFound = productos.find((item) => item.id === parseInt(id));
  //   setProduct(productFound);
  //   setActiveImage(productFound?.images[0] || null); // Imagen inicial
  // }, [id]);
  // Filtrar el producto específico desde el array vehicles en el contexto global
  const product = state.vehicles.find((vehicle) => vehicle.id === id);

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="w-full min-h-screen">
      <header className="lg:max-w-[1337px] lg:m-auto flex items-center p-4 w-full">
        <Button
          size="sm"
          variant="text"
          className="flex items-center justify-end"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6 text-deepTeal" />
        </Button>
        <div className="flex flex-col items-start ml-12">
          <h4 className="text-lg	text-customBlack">Carro eléctrico</h4>
          <h3 className="text-2xl text-black font-semibold text-left flex-grow">
            {product.nombreVehiculo}
          </h3>
        </div>
      </header>
      <main className="container lg:max-w-[1440px] lg:m-auto mt-8">
        <section className="flex content-start gap-20 lg:gap-60 lg:flex-row  flex-col">
          {/* Product Information */}
          <div className="max-w-[792px] bg-mintTeal py-6 pr-0 2xl:pl-[171px] pl-[115px] rounded-l-none rounded-r-3xl flex flex-col lg:flex-row">
            <div className="text-lg text-start pr-[115px] lg:pr-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.45 15.5C10.85 15.9 11.3667 16.0958 12 16.0875C12.6333 16.0792 13.1 15.85 13.4 15.4L19 7L10.6 12.6C10.15 12.9 9.9125 13.3583 9.8875 13.975C9.8625 14.5917 10.05 15.1 10.45 15.5ZM12 4C12.9833 4 13.9292 4.1375 14.8375 4.4125C15.7458 4.6875 16.6 5.1 17.4 5.65L15.5 6.85C14.95 6.56667 14.3792 6.35417 13.7875 6.2125C13.1958 6.07083 12.6 6 12 6C9.78333 6 7.89583 6.77917 6.3375 8.3375C4.77917 9.89583 4 11.7833 4 14C4 14.7 4.09583 15.3917 4.2875 16.075C4.47917 16.7583 4.75 17.4 5.1 18H18.9C19.2833 17.3667 19.5625 16.7083 19.7375 16.025C19.9125 15.3417 20 14.6333 20 13.9C20 13.3 19.9292 12.7167 19.7875 12.15C19.6458 11.5833 19.4333 11.0333 19.15 10.5L20.35 8.6C20.85 9.38333 21.2458 10.2167 21.5375 11.1C21.8292 11.9833 21.9833 12.9 22 13.85C22.0167 14.8 21.9083 15.7083 21.675 16.575C21.4417 17.4417 21.1 18.2667 20.65 19.05C20.4667 19.35 20.2167 19.5833 19.9 19.75C19.5833 19.9167 19.25 20 18.9 20H5.1C4.75 20 4.41667 19.9167 4.1 19.75C3.78333 19.5833 3.53333 19.35 3.35 19.05C2.91667 18.3 2.58333 17.5042 2.35 16.6625C2.11667 15.8208 2 14.9333 2 14C2 12.6167 2.2625 11.3208 2.7875 10.1125C3.3125 8.90417 4.02917 7.84583 4.9375 6.9375C5.84583 6.02917 6.90833 5.3125 8.125 4.7875C9.34167 4.2625 10.6333 4 12 4Z"
                  fill="#595858"
                />
              </svg>
              <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                <strong className="text-black text-[32px]">
                  {product.kilometraje}
                </strong>
                <span className="text-lg text-black"> km/h</span> <br />
                velocidad máxima
              </p>
              <hr className="border-t border-customGray3 my-1" />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.3 20L16.3 10.25H12.8V4L7.8 13.75H11.3V20ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20Z"
                  fill="#595958"
                />
              </svg>
              <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                <strong className="text-black text-[32px]">
                  {product.duracionKmCarga}
                </strong>
                <span className="text-lg text-black"> w</span>
                <br />
                potencia máxima del motor
              </p>
              <hr className="border-t border-customGray3 my-1" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.3 16.7L16.7 15.3L13 11.6V7H11V12.4L15.3 16.7ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20Z"
                  fill="#595958"
                />
              </svg>
              <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                <strong className="text-black text-[32px]">
                  {product.tiempoCarga}
                </strong>
                <span className="text-lg text-black"> horas</span>
                <br />
                carga de 0% a 100%
              </p>
            </div>
            {/* Imagen principal del producto */}
            {/* <img
              src={activeImage}
              alt={product.nombreVehiculo}
              className="w-full lg:h-64 object-cover relative right-12 lg:right-[-80px] top-3 lg:top-[15%]"
            /> */}
            {/* Product Image */}
            <div className="flex justify-center items-center">
              <img
                src={product.img}
                alt={product.nombreVehiculo}
                className="rounded-3xl max-w-[444px] shadow-md"
              />
            </div>
          </div>

          {/* Price and Plan */}
          <div className="bg-customGray2 p-6 rounded-2xl shadow-md w-full lg:w-[338px] h-[447px]">
            <h3 className="text-lg font-semibold text-start">
              PRECIOS Y PLANES
            </h3>
            <p className="text-base mt-2 text-start font-semibold">
              Carro eléctrico
              <span className="text-deepTeal"> {product.nombreVehiculo}</span>
            </p>
            <div className="mt-4 space-y-2">
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">
                    Alquiler por hora
                  </span>
                  <br />
                  <span className="text-lg">${product.precio}/</span>
                  <span className="font-semibold text-[11px]">por hora</span>
                </span>
              </label>
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">Alquiler diario</span>
                  <br /> <span className="text-lg"> $70/</span>
                  <span className="font-semibold text-[11px]"> por día</span>
                </span>
              </label>
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">
                    Suscripción mensual
                  </span>
                  <br /> <span className="text-lg">$300/</span>
                  <span className="font-semibold text-[11px]"> por mes</span>
                </span>
              </label>
              <label className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                <input type="radio" name="price" className="mt-4 ml-4" />
                <span className="py-[10px] m-0 text-start">
                  <span className="text-sm font-semibold">
                    Suscripción anual
                  </span>
                  <br /> <span className="text-lg">$700/</span>
                  <span className="font-semibold text-[11px]"> anual</span>
                </span>
              </label>
            </div>
            <button className="bg-aquaTeal text-white px-4 py-2 mt-1 rounded-md w-full">
              ALQUILAR
            </button>
          </div>
        </section>

        {/* Carousel */}
        {/* <section className="mt-8 overflow-x-auto md:overflow-hidden">
          <div className="flex md:justify-center gap-4  md:flex-nowrap">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.nombreVehiculo} - imagen ${index + 1}`}
                className={`h-24 w-32 object-cover cursor-pointer rounded-lg border ${
                  activeImage === image ? "border-aquaTeal" : "border-customGrayTransparent opacity-50"
                }`}
                onClick={() => setActiveImage(image)}
              />
            ))}
          </div>
        </section> */}

        {/* Characteristics */}
        <section className="my-8 bg-customGray h-[314px] py-4 pl-8 w-screen lg:w-auto">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Características:
          </h3>
          <div className="flex overflow-x-auto whitespace-nowrap space-x-4">
            <div className="flex items-center min-w-[479px]">
              <img
                src={product.img}
                alt={product.nombreVehiculo}
                className="w-[223px] h-[174px] object-cover rounded-lg"
              />
              <div className="bg-mintTeal rounded-l-none rounded-r-lg min-w-[280px] text-start p-7">
                <p className="mt-2 font-medium text-lg text-black">
                  Color de vehiculo
                </p>
                <p className="text-[11px] text-black">
                  {product.colorVehiculo}
                </p>
              </div>
            </div>
            <div className="flex items-center  min-w-[479px]">
              <img
                src={product.img}
                alt={product.nombreVehiculo}
                className="w-[223px] h-[174px] object-cover rounded-lg"
              />
              <div className="bg-mintTeal rounded-l-none rounded-r-lg min-w-[280px] text-start p-7">
                <p className="mt-2 font-medium text-lg text-black">
                  N° de Puertas
                </p>
                <p className="text-[11px] text-black">{product.noPuertas}</p>
              </div>
            </div>
            <div className="flex items-center  min-w-[479px] last:!mr-8">
              <img
                src={product.img}
                alt={product.nombreVehiculo}
                className="w-[223px] h-[174px] object-cover rounded-lg"
              />
              <div className="bg-mintTeal rounded-l-none rounded-r-lg min-w-[280px] text-start p-7">
                <p className="mt-2 font-medium text-lg text-black">
                  N° de Pasajeros
                </p>
                <p className="text-[11px] text-black">{product.noPasajeros}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
