import {
  HomeIcon,
  SwatchIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
import useIsMobile from "../../hooks/useIsMobile";
import MobileMessage from "../../Components/MobileMessage";

export const Admin = () => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileMessage />;
  
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
              <TruckIcon className="mr-3 h-5 w-5" />
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
              <SwatchIcon className="mr-3 h-5 w-5" />
              Categorías
            </Link>
            <Link
              to="/admin/characteristics"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <WalletIcon className="mr-3 h-5 w-5" />
              Características
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <AdminDashboard />
      </div>
    </div>
  );
};
