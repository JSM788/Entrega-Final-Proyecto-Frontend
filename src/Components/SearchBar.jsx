import { Typography, Input, Button } from "@material-tailwind/react";
import map from "../assets/icons/map.svg";
import calendario from "../assets/icons/calendario.svg";
import "./Styles/SearchBar.css"; // Asegúrate de importar el CSS

export const SearchBar = () => {
  return (
    <div className="p-4 bg-[#DEECEC] rounded-lg mt-5 mx-4">
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 m-4">
        <div className="flex flex-col col-span-1 md:col-span-1 lg:col-span-1">
          <Typography variant="small" className="mb-1 text-left">
            Recoge el vehículo en
          </Typography>
          <div className="relative">
            <img src={map} className="input-icon" alt="Icono de ciudad" />
            <Input
              type="text"
              placeholder="Ciudad"
              className="pl-10  pr-4 placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </div>

        <div className="">
          <Typography variant="small" className="mb-1 text-left">
            Fecha de recogida
          </Typography>
          <div className="relative">
            <img
              src={calendario}
              className="input-icon"
              alt="Icono de Calendario"
            />
            <Input
              type="date"
              className="pl-10  placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </div>
        <div className="">
          <Typography variant="small" className="mb-1 text-left">
            Fecha de devolución
          </Typography>
          <div className="relative">
            <img
              src={calendario}
              className="input-icon"
              alt="Icono de Calendario"
            />
            <Input
              type="date"
              className=" placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col col-span-1 md:col-span-3 lg:col-span-1 self-center">
          <Button
            type="submit"
            className="bg-[#2A606E] text-white rounded"
            fullWidth
          >
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
};
