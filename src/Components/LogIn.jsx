import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi"
import Swal from "sweetalert2";
import ErrorMessage from "./ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContextGlobal } from "./utils/global.context";

const baseUrl = import.meta.env.BASE_URL;

const initialState = {
  email: "", 
  password: ""
}

const LoginForm = () => {
  const [customer, setCustomer] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { dispatch } = useContextGlobal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value })
  }

  const validateField = (name, value) => {
    const regExEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (name === "email") return value.trim() && value.length > 5 && regExEmail.test(value.trim());
    if (name === "password") return value.trim() && value.length > 5;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      email: customer.email,
      password: customer.password
    }

    try {
      const baseUrl = import.meta.env.BASE_URL;
      const response = await axios.post(`${baseUrl}/api/auth/login`, loginData)
      console.log(response.data)
      if (response.status === 200) {
        dispatch({ type: 'login', payload: response.data })
        navigate("/");
        Swal.fire({
          title: "¡Bienvenido de nuevo!",
          text: response.data.fullName,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            htmlContainer: "!text-[#32CEB1]"
          }
        })
      }
    } catch (error) {
      if (error.status === 401) {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          showCloseButton: true,
          showConfirmButton: false,
          customClass: {
            title: "text-red-500"
          },
          willClose: () => {
            setCustomer(initialState);
          }
        })
      } else {
        Swal.fire({
          title: "Error",
          text: "Service Error, try it later",
          showCloseButton: true,
          showConfirmButton: false,
          customClass: {
            title: "text-red-500"
          },
          willClose: () => {
            setCustomer(initialState);
          }
        })
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <section className="h-screen my-4 md:flex items-center">
      <div className="md:w-1/2 lg:w-1/3 m-5 md:mx-28">
        <form onSubmit={handleSubmit} className="bg-[#F9F9F9] text-left shadow-xl rounded-lg h-[700px] pt-6">
          <h2 className="text-4xl text-black font-bold w-3/4 mx-auto py-5">
            !Bienvenido de nuevo!
          </h2>

          <div className="my-10 w-3/4 mx-auto">
            <label htmlFor="email" className="text-md font-bold">
              Correo electrónico
            </label>
            <input 
              type="email"
              id="email"
              className={`w-full rounded-lg mt-3 p-3 border 
                ${customer.email
                  ? (validateField("email", customer.email) ? "border-[#32CEB1]" : "border-red-500")
                  : "border-customGray3"}`}
              placeholder="Ingrese su email" 
              name="email"
              value={customer.email}
              onChange={handleChange}
            />

            {!validateField("email", customer.email) && customer.email && 
              <ErrorMessage field="Verifica que hayas ingresado un correo válido."
            />}
          </div>

          <div className="pb-20 w-3/4 mx-auto">
            <div className="mb-2">
              <label htmlFor="password" className="text-md font-bold">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                className={`w-full rounded-lg p-3 border 
                  ${customer.password
                    ? (validateField("password", customer.password) ? "border-[#32CEB1]" : "border-red-500")
                    : "border-customGray3"}`}
                placeholder="Ingrese su contraseña"
                name="password"
                value={customer.password}
                onChange={handleChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <HiEyeOff size={20} className="text-deepTeal" /> : <HiEye size={20} className="text-deepTeal" />} 
              </button>
            </div>

            {!validateField("password", customer.password) && customer.password && 
              <ErrorMessage field="La contraseña debe contener al menos 6 caracteres"
            />}
          </div>

          <div className="w-3/4 mx-auto">
            <input 
              type="submit"
              className={`"bg-slate-800 w-full uppercase text-white font-bold rounded-lg h-[39px] 
                cursor-pointer ${validateField("email", customer.email) && validateField("password", customer.password) 
                  ? "bg-[#32CEB1] hover:bg-[#95eede]" 
                  : "bg-black disabled:opacity-10"}`}
              value={loading ? "Cargando..." : "Inicia Sesión"} 
              disabled={loading || !validateField("email", customer.email) || !validateField("password", customer.password)}
            />
          </div>

          <p className="text-center text-sm lg:text-lg text-black font-bold pt-12">
            ¿No tienes cuenta? <Link to={"/singIn"}><span className="text-[#32CEB1] underline">Regístrate</span></Link>
          </p>
        </form>
      </div>
  
      <div className="hidden md:flex w-2/3 items-center justify-center h-[700px] ml-6">
        <img 
          src={`${baseUrl}imagen-login.png`} 
          alt="imagen de login" 
          className="h-[700px] object-cover w-full rounded-l-lg" 
        />
      </div>
    </section>
  )
}

export default LoginForm;
