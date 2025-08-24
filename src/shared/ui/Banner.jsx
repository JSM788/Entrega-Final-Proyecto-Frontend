import { Carousel } from "@material-tailwind/react";

const baseUrl = import.meta.env.BASE_URL;
const BannerHome = () => {
  return (
    <div className="bg-gradient-to-b from-[#e4f0f0] to-[#99c0c0] h-auto w-full 
      flex flex-col items-center justify-center">
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black my-2 sm:my-4 md:my-6 text-center">
        Alquiler de vehículos eléctricos
      </h1>
      <Carousel
        className="rounded-xl"
        // prevArrow={""}
        // nextArrow={""}
        autoplay={true}
        autoplayDelay={5000}
        loop={true}
      >
        {/*CAROUSEL NUMERO 1*/}
        <div className="flex flex-wrap h-auto justify-center items-center px-2 sm:px-4 py-4 sm:py-8">
          {/* Imagen de carro */}
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
            <img
              src={`${baseUrl}Car-Brand.png`}
              alt="Car"
              className="w-3/4 sm:w-2/3 h-auto mx-auto sm:mr-6"
            />
          </div>
          {/*Descripción del auto*/}
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start mt-4 sm:mt-2 pb-6 sm:pb-9 pl-0 sm:pl-4">
            <p className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-2 pt-2 text-center sm:text-left w-full lg:w-3/4">
              Este vehículo combina estilo, confort y eficiencia. Ideal para desplazamientos urbanos y viajes largos, ofrece un rendimiento confiable y tecnología moderna para una experiencia de conducción segura y cómoda.
            </p>

            <div className="flex justify-center items-center w-full sm:w-auto space-x-4 sm:space-x-6 lg:space-x-10 
              mb-6 sm:mb-4 px-2 sm:px-4 py-1 text-black text-xs font-bold rounded-[10px] bg-[#B7ECE2] text-center">
              {/* Pasajeros */}
              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}perfil.png`} alt="" className="w-4 h-4" />
                <span>4</span>
              </div>

              {/* Transmisión */}
              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}car-icon.png`} alt="" className="w-4 h-4" />
                <span>Manual</span>
              </div>

              {/* Precio */}
              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}money-icon.png`} alt="" className="w-4 h-4" />
                <span>200</span>
              </div>
            </div>

            {/* <button className="hidden sm:block mt-4 w-full sm:w-[160px] md:w-[202px] h-[45px] md:h-[51px] bg-[#6adcc7] text-white 
              uppercase font-bold py-2 px-6 rounded-lg shadow-xl hover:bg-[#32ceb1] transition-all">
              Reserva ahora
            </button> */}
          </div>
        </div>

        {/*CAROUSEL NUMERO 2*/}
        <div className="flex flex-wrap h-auto justify-center items-center px-2 sm:px-4 py-4 sm:py-8">
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
            <img
              src={`${baseUrl}Car-Brand.png`}
              alt="Car"
              className="w-3/4 sm:w-2/3 h-auto mx-auto sm:mr-6"
            />
          </div>
          
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start mt-4 sm:mt-2 pb-6 sm:pb-9 pl-0 sm:pl-4">
            <p className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-2 pt-2 text-center sm:text-left w-full lg:w-3/4">
              Este vehículo combina estilo, confort y eficiencia. Ideal para desplazamientos urbanos y viajes largos, ofrece un rendimiento confiable y tecnología moderna para una experiencia de conducción segura y cómoda.
            </p>

            <div className="flex justify-center items-center w-full sm:w-auto space-x-4 sm:space-x-6 lg:space-x-10 
              mb-6 sm:mb-4 px-2 sm:px-4 py-1 text-black text-xs font-bold rounded-[10px] bg-[#B7ECE2] text-center">
              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}perfil.png`} alt="" className="w-4 h-4" />
                <span>4</span>
              </div>

              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}car-icon.png`} alt="" className="w-4 h-4" />
                <span>Manual</span>
              </div>

              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}money-icon.png`} alt="" className="w-4 h-4" />
                <span>200</span>
              </div>
            </div>

            {/* <button className="hidden sm:block mt-4 w-full sm:w-[160px] md:w-[202px] h-[45px] md:h-[51px] bg-[#6adcc7] text-white 
              uppercase font-bold py-2 px-6 rounded-lg shadow-xl hover:bg-[#32ceb1] transition-all">
              Reserva ahora
            </button> */}
          </div>
        </div>

        {/*CAROUSEL NUMERO 3*/}
        <div className="flex flex-wrap h-auto justify-center items-center px-2 sm:px-4 py-4 sm:py-8">
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
            <img
              src={`${baseUrl}Car-Brand.png`}
              alt="Car"
              className="w-3/4 sm:w-2/3 h-auto mx-auto sm:mr-6"
            />
          </div>
          
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start mt-4 sm:mt-2 pb-6 sm:pb-9 pl-0 sm:pl-4">
            <p className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-2 pt-2 text-center sm:text-left w-full lg:w-3/4">
              Este vehículo combina estilo, confort y eficiencia. Ideal para desplazamientos urbanos y viajes largos, ofrece un rendimiento confiable y tecnología moderna para una experiencia de conducción segura y cómoda.
            </p>

            <div className="flex justify-center items-center w-full sm:w-auto space-x-4 sm:space-x-6 lg:space-x-10 
              mb-6 sm:mb-4 px-2 sm:px-4 py-1 text-black text-xs font-bold rounded-[10px] bg-[#B7ECE2] text-center">
              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}perfil.png`} alt="" className="w-4 h-4" />
                <span>4</span>
              </div>

              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}car-icon.png`} alt="" className="w-4 h-4" />
                <span>Manual</span>
              </div>

              <div className="flex items-center space-x-1">
                <img src={`${baseUrl}money-icon.png`} alt="" className="w-4 h-4" />
                <span>200</span>
              </div>
            </div>

            {/* <button className="hidden sm:block mt-4 w-full sm:w-[160px] md:w-[202px] h-[45px] md:h-[51px] bg-[#6adcc7] text-white 
              uppercase font-bold py-2 px-6 rounded-lg shadow-xl hover:bg-[#32ceb1] transition-all">
              Reserva ahora
            </button> */}
          </div>
        </div>
      </Carousel>
      {/* Botón para pantallas pequeñas */}
      {/* <div className="block sm:hidden mt-2 w-full">
        <button className="w-[90%] h-[45px] bg-[#6adcc7] text-white uppercase font-bold mb-4 py-2 px-4 
          rounded-lg shadow-xl hover:bg-[#32ceb1] transition-all">
          Reserva ahora
        </button>
      </div> */}
    </div>
  );
};

export default BannerHome;

