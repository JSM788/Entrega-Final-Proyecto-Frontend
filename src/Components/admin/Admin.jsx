import {
  CalendarIcon,
  CogIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
import { useEffect, useState } from "react";

// Hook personalizado para verificar si el dispositivo es móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajusta el tamaño según tus necesidades
    };

    // Chequear el tamaño inicial y añadir event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const Admin = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Acceso no disponible
          </h2>
          <p className="text-gray-700">
            La página de administración no está disponible en dispositivos
            móviles.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2">
            <a
              href="/admin"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-teal-100 text-teal-700"
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <Link
              to="/admin/vehicles"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Vehículos
            </Link>
            <Link
              to="/admin/users"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Usuarios
            </Link>
            <Link
              to="/admin/categories"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <UsersIcon className="mr-3 h-5 w-5" />
              Categorías
            </Link>
            <a
              href="#"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              Reservas
            </a>
            <a
              href="#"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <CogIcon className="mr-3 h-6 w-6" />
              Configuración
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <AdminDashboard />
      </div>
    </div>
  );
};
