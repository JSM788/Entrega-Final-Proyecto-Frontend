import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

import AutoPlata from "../assets/icons/auto-plata.svg";
import AutoBlack from "../assets/icons/auto-black.svg";
import dolar from "../assets/icons/dolar.svg";

export const VehicleCard = () => (
  <Card className="p-4 rounded-lg shadow-lg border">
    <Typography
      variant="h6"
      color="blue-gray"
      className="text-center font-bold mb-2"
    >
      MODELO DE AUTO
    </Typography>
    <div className="flex justify-center mb-4">
      <img
        src={AutoPlata} // Reemplaza con la ruta de tu imagen
        alt="Vehículo eléctrico"
        className="h-24 w-full object-contain"
      />
    </div>
    <div className="flex justify-evenly mb-4">
      <Button size="sm" color="gray" className="">
        VER MÁS
      </Button>
      <Button size="sm" className="bg-[#32CEB1]">
        RESERVAR
      </Button>
    </div>

    <div className="flex justify-around text-gray-600 text-sm">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="h-4 w-4 mr-4"
        >
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
        </svg>
        <Typography variant="small">4</Typography>
      </div>
      <div className="flex items-center">
        <img
          src={AutoBlack}
          alt="Imagen del vehículo eléctrico"
          className="h-4 w-4 mr-3"
        />
        <Typography variant="small">Manual</Typography>
      </div>

      <div className="flex items-center">
        <img
          src={dolar}
          alt="Imagen del vehículo eléctrico"
          className="h-4 w-4 mr-2"
        />
        <Typography variant="small" className="font-bold text-blue-gray-700">
          200/h
        </Typography>
      </div>
    </div>
  </Card>
);

export const VehicleList = () => {
  return (
    <>
      <div className="text-left pl-5 pt-4">
        <Typography variant="h4">Productos</Typography>
      </div>
      <div
        className="grid gap-6 p-4 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3"
      >
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
        <VehicleCard />
      </div>
    </>
  );
};
