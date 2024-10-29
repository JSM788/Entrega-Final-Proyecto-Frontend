import React from "react";
import BannerHome from "./Banner";
import { Categories } from "./Categories";
import { SearchBar } from "./SearchBar";
import { Recommendations } from "./Recommendations";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { VehicleList } from "./Vehicle";

export const HomeContainer = () => {
  return (
    <>
      {/* Banner */}
      <BannerHome />
      {/* Categorias */}
      <Categories />

      {/* Busqueda */}
      <SearchBar />

      {/* Productos */}
      <VehicleList />

      {/* Recomendaciones  */}
      <Recommendations />
    </>
  );
};
