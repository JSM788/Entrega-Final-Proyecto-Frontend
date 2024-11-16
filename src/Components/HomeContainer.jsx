import React from "react";
import BannerHome from "./Banner";
import { Categories } from "./Categories";
import { SearchBar } from "./SearchBar";
import { Recommendations } from "./Recommendations";
import { VehicleList } from "./Vehicle";

export const HomeContainer = () => {
  return (
    <main className="flex-grow bg-white">
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
    </main>
  );
};
