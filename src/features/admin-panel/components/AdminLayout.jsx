import {
  HomeIcon,
  SwatchIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";
import useIsMobile from "../../../shared/hooks/useIsMobile";
import MobileMessage from "../../../shared/ui/MobileMessage";

export const AdminLayout = () => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;
  
return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <nav className="mt-5 px-2">
          <Link
            to="/administracion"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <HomeIcon className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="vehicles"
            className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <TruckIcon className="mr-3 h-5 w-5" />
            Vehículos
          </Link>
          <Link
            to="users"
            className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <UsersIcon className="mr-3 h-5 w-5" />
            Usuarios
          </Link>
          <Link
            to="categories"
            className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <SwatchIcon className="mr-3 h-5 w-5" />
            Categorías
          </Link>
          <Link
            to="/administracion/characteristics"
            className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <WalletIcon className="mr-3 h-5 w-5" />
            Características
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 flex flex-col">
        <Outlet />
      </main>
    </div>
    </div>
  );
};