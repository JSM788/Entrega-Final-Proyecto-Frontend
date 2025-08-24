import { CalendarIcon, UsersIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from "react" // Import useEffect and useState
import axios from "axios"; // Import axios

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalUsers: 0,
    totalReservations: 0,
    availableVehicles: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        // Fetch stats
        const statsResponse = await axios.get(`${baseUrl}/api/dashboard/stats`);
        setStats(statsResponse.data);

        // Fetch recent reservations
        const recentReservationsResponse = await axios.get(`${baseUrl}/api/dashboard/recent-reservations`);
        setRecentReservations(Array.isArray(recentReservationsResponse.data) ? recentReservationsResponse.data : [recentReservationsResponse.data].filter(Boolean));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error al cargar los datos del dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <div>Cargando datos del dashboard...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Vehículos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalVehicles}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Usuarios Activos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reservas Activas
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalReservations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vehículos Disponibles
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.availableVehicles}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <li key={reservation.reservationId}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-teal-600 truncate">
                        Reserva #{reservation.reservationId} - {reservation.product?.name || 'Producto Desconocido'}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {reservation.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Usuario: {reservation.user?.fullName || 'Usuario Desconocido'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-gray-500">No hay reservas recientes.</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  )
}

