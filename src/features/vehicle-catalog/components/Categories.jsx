import { Typography } from "@material-tailwind/react";
import autoIcon from "../../../shared/assets/icons/auto.svg";
import motoIcon from "../../../shared/assets/icons/moto.svg";
import biciIcon from "../../../shared/assets/icons/bici.svg";

export const Categories = () => {
  return (
    <>
      <div className="w-full left-0 absolute bg-black flex flex-row justify-center md:space-x-14 py-5 space-x-8">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 flex flex-row justify-center items-center">
            <img src={autoIcon} alt="Auto Icon" className="mx-auto" />
          </div>
          <Typography
            variant="paragraph"
            color="white"
            className="text-xs sm:text-base"
          >
            Autos
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <img src={biciIcon} alt="Bicicletas" className="mx-auto" />
          <Typography
            variant="paragraph"
            color="white"
            className="text-xs sm:text-base"
          >
            Bicicletas
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <img src={motoIcon} alt="Moto Icon" className="mx-auto" />
          <Typography
            variant="paragraph"
            color="white"
            className="text-xs sm:text-base"
          >
            Motos
          </Typography>
        </div>
        <div className="flex flex-col items-center">
          <img src={biciIcon} alt="Scooters" className="mx-auto" />
          <Typography
            variant="paragraph"
            color="white"
            className="text-xs sm:text-base"
          >
            Scooters
          </Typography>
        </div>
      </div>
      <div className="relative h-[88px] py-5"></div>
    </>
  );
};
