import "./App.css";
import Footer from "./Components/Footer.jsx";
import { HomeContainer } from "./Components/HomeContainer.jsx";
import StickyNavbar from "./Components/StickyNavbar.jsx";
import ProductDetail from "./Components/ProductDetail.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { Admin } from "./Components/admin/Admin.jsx";
import { AdminUsers } from "./Components/admin/AdminUsers.jsx";
import { AdminVehicles } from "./Components/admin/AdminVehicles.jsx";
import LoginForm from "./Components/LogIn.jsx";
import { SignIn } from "./Components/SignIn.jsx";
import { useContextGlobal } from "./Components/utils/global.context.jsx";
import Page403 from "./Components/Page403.jsx";
import { AdminCategories } from "./Components/admin/AdminCategories.jsx";
import { AdminCharacteristics } from "./Components/admin/AdminCharacteristics.jsx";

function App() {
  const { state } = useContextGlobal();
  const { isAuth, user } = state;

  return (
    <div className="flex flex-col min-h-screen">
      <StickyNavbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeContainer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            isAuth && user.roles.includes("ROLE_ADMIN") ? (
              <Admin />
            ) : (
              <Page403 />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            isAuth && user.roles.includes("ROLE_ADMIN") ? (
              <AdminUsers />
            ) : (
              <Page403 />
            )
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            isAuth && user.roles.includes("ROLE_ADMIN") ? (
              <AdminVehicles />
            ) : (
              <Page403 />
            )
          }
        />
        <Route
          path="/admin/categories"
          element={
            isAuth && user.roles.includes("ROLE_ADMIN") ? (
              <AdminCategories />
            ) : (
              <Page403 />
            )
          }
        />
         <Route
          path="/admin/characteristics"
          element={
            isAuth && user.roles.includes("ROLE_ADMIN") ? (
              <AdminCharacteristics />
            ) : (
              <Page403 />
            )
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/singIn" element={<SignIn />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<h1>Error 404 - Page not Found</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
