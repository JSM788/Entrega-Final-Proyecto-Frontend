import "./App.css"
import Footer from "./Components/Footer.jsx"
import { HomeContainer } from "./Components/HomeContainer.jsx"
import StickyNavbar from "./Components/StickyNavbar.jsx"
import ProductDetail from "./Components/ProductDetail.jsx"
import { Link, Route, Routes } from "react-router-dom"
import { Admin } from "./Components/admin/Admin.jsx"
import { AdminUsers } from "./Components/admin/AdminUsers.jsx"
import { AdminVehicles } from "./Components/admin/AdminVehicles.jsx"
import { LogIn } from "./Components/LogIn.jsx"
import { SignIn } from "./Components/SignIn.jsx"

function App() {
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
        <Route path="/login" element={<h1>ingresa credenciales</h1>}/>
        <Route path="/register" element={<h1>registrate</h1>}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/singIn" element={<SignIn />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<h1>Error 404 - Page not Found</h1>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
