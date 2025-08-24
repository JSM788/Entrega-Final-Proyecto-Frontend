import React from "react";
import { Categories } from "../components/Categories";
import { SearchBar } from "../components/SearchBar";
import { Recommendations } from "../components/Recommendations";
import { VehicleList } from "../components/Vehicle";
import BannerHome from "../../../shared/ui/Banner";

const HomeContainer = () => {
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

export default HomeContainer;
