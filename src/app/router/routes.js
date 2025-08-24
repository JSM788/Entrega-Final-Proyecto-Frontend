import HomePage from '../../features/vehicle-catalog/pages/HomePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import AdminDashboardPage from '../../features/admin-panel/components/Admin.jsx';
import { AdminDashboard } from '../../features/admin-panel/components/AdminDashboard';
import { AdminUsers } from '../../features/admin-panel/components/AdminUsers';
import { AdminCategories } from '../../features/admin-panel/components/AdminCategories';
import { AdminCharacteristics } from '../../features/admin-panel/components/AdminCharacteristics';
import { AdminVehicles } from '../../features/admin-panel/components/AdminVehicles';
import VehicleDetailPage from '../../features/vehicle-catalog/pages/VehicleDetailPage';
import VehicleListPage from '../../features/vehicle-catalog/pages/VehicleListPage';
import UserReservationsPage from '../../features/reservations/pages/UserReservationsPage';
import ReservationDetailPage from '../../features/reservations/pages/ReservationDetailPage';
import FavoritesPage from '../../features/user-profile/pages/FavoritesPage';
import Page403 from '../../shared/ui/Page403';

export const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
    {
    path: '/administracion',
    component: AdminDashboardPage,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'categories', component: AdminCategories },
      { path: 'characteristics', component: AdminCharacteristics },
      { path: 'vehicles', component: AdminVehicles },
    ],
  },
  { path: '/product/:id', component: VehicleDetailPage },
  { path: '/products', component: VehicleListPage },
  { path: '/reservations', component: UserReservationsPage },
  { path: '/reservation/:id', component: ReservationDetailPage },
  { path: '/favorites', component: FavoritesPage },
  { path: '/403', component: Page403 },
];