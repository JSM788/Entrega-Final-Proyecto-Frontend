import React, { useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "./utils/global.context";
import Swal from "sweetalert2";
import {
  ArrowRightStartOnRectangleIcon,
  HeartIcon,
  IdentificationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export function StickyNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [isActive, setIsActive] = useState("");

  const navigate = useNavigate();
  const { state, dispatch } = useContextGlobal();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const handleLogout = () => {
    setOpenSubMenu(false); // Cierra el submenú
    dispatch({ type: "logout" });
    navigate("/login");
  };

  const handleLoginNavigation = () => {
    navigate("/login");
  };

  const handleRegisterNavigation = () => {
    navigate("/singIn");
  };

  const handleMisFavoritos = () => {
    setOpenSubMenu(false); // Cierra el submenú
    navigate("/favorites");
  };

  const handleMiCuenta = () => {
    setOpenSubMenu(false); // Cierra el submenú
    Swal.fire({
      title: "Datos de usuario",
      html: `
        <p style="margin-bottom: 8px; font-size: 22px;">
          <span style="color: #32CEB1;">Nombre:</span> <span style="color: #000;">
            ${state.user.fullName}
          </span></p>
        <p style="margin-bottom: 8px; font-size: 22px;">
          <span style="color: #32CEB1;">Email:</span> <span style="color: #000;">
            ${state.user.email}
        </span></p>
        <p style="margin-bottom: 8px; font-size: 22px;">
          <span style="color: #32CEB1;">Nombre de usuario:</span> <span style="color: #000;">
            ${state.user.username}
        </span></p>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        title: "text-black",
        htmlContainer: "!text-[#32CEB1]",
      },
    });
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Other
        </a>
      </Typography>
    </ul>
  );

  return (
    <div className="sticky top-0 mx-10 my-5 z-20">
      <Navbar className="!bg-[#fafafa] h-max max-w-full rounded-2xl shadow px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <IconButton
            variant="text"
            className="h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
          {/* Agregamos el evento onClick al logo */}
          <Typography
            as="a"
            className="mr-4 cursor-pointer py-1.5 font-semibold"
            onClick={() => navigate("/")} // Navega al Home al hacer clic
          >
            MOVELT
          </Typography>

          <div className="flex items-center gap-4 w-auto lg:w-full">
            <div className="mr-4 hidden lg:flex w-full justify-center">
              {navList}
            </div>

            {!state.isAuth ? (
              <div className="hidden md:flex items-center gap-x-4 w-full justify-end">
                <button
                  className="rounded-lg border border-customBlack  p-2.5 text-center text-black text-base font-semibold"
                  onClick={handleLoginNavigation}
                >
                  INICIA SESIÓN
                </button>
                <button
                  className="rounded-lg  bg-[#2a606e] p-2.5 text-center text-white text-base font-semibold"
                  onClick={handleRegisterNavigation}
                >
                  REGÍSTRATE
                </button>
              </div>
            ) : (
              // Mostrar las iniciales en un círculo cuando hay sesión iniciada
              <div className="relative">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-customBlack text-white font-medium cursor-pointer"
                  onClick={() => setOpenSubMenu(!openSubMenu)}
                >
                  {state.user.avatarInitials}
                </div>
                {/* Menú desplegable */}
                {openSubMenu && (
                  <div className="absolute  right-0 flex w-[214px] p-5 bg-customGray2 rounded-lg shadow flex-col justify-start items-start gap-2.5">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center justify-center w-[54px] h-[54px] rounded-full bg-customBlack text-white text-lg font-medium">
                        {state.user.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-center text-black text-xl font-medium font-['Roboto']">
                          {truncateText(state.user.fullName, 8)}
                        </div>
                        <div className="text-[#79747e] text-[13px] font-medium font-['Roboto']">
                          {truncateText(state.user.email, 12)}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-[0px] border border-customGray3"></div>
                    <div
                      className={`pl-2.5 pr-5 py-2.5 w-full flex items-center gap-2.5 rounded-lg cursor-pointer ${
                        isActive === "miCuenta"
                          ? "bg-[#32ceb1] text-white"
                          : "bg-transparent text-black hover:bg-[#32ceb1] hover:text-white"
                      }`}
                      onMouseEnter={() => setIsActive("miCuenta")}
                      onMouseLeave={() => setIsActive("")}
                      onClick={handleMiCuenta}
                    >
                      <UserCircleIcon
                        className={`h-4 w-4 ${
                          isActive === "miCuenta" ? "text-white" : "text-black"
                        }`}
                      />
                      Mi Cuenta
                    </div>
                    <div
                      className={`pl-2.5 pr-5 py-2.5 w-full flex items-center gap-2.5 rounded-lg cursor-pointer ${
                        isActive === "misFavoritos"
                          ? "bg-[#32ceb1] text-white"
                          : "bg-transparent text-black hover:bg-[#32ceb1] hover:text-white"
                      }`}
                      onMouseEnter={() => setIsActive("misFavoritos")}
                      onMouseLeave={() => setIsActive("")}
                      onClick={handleMisFavoritos}
                    >
                      <HeartIcon
                        className={`h-4 w-4 ${
                          isActive === "misFavoritos"
                            ? "text-white"
                            : "text-black"
                        }`}
                      />
                      Mis Favoritos
                    </div>
                    {state.user.roles.includes("ROLE_ADMIN") ? (
                      <>
                        <div
                          className={`pl-2.5 pr-5 py-2.5 w-full flex items-center gap-2.5 rounded-lg cursor-pointer ${
                            isActive === "administracion"
                              ? "bg-[#32ceb1] text-white"
                              : "bg-transparent text-black hover:bg-[#32ceb1] hover:text-white"
                          }`}
                          onMouseEnter={() => setIsActive("administracion")}
                          onMouseLeave={() => setIsActive("")}
                          onClick={() => {
                            navigate("/admin");
                            setOpenSubMenu(false); // Cierra el submenú
                          }}
                        >
                          <IdentificationIcon
                            className={`h-4 w-4 ${
                              isActive === "administracion"
                                ? "text-white"
                                : "text-black"
                            }`}
                          />
                          Administración
                        </div>
                        <div
                          className={`pl-2.5 pr-5 py-2.5 w-full flex items-center gap-2.5 rounded-lg cursor-pointer ${
                            isActive === "cerrarSesion"
                              ? "bg-[#32ceb1] text-white"
                              : "bg-transparent text-black hover:bg-[#32ceb1] hover:text-white"
                          }`}
                          onMouseEnter={() => setIsActive("cerrarSesion")}
                          onMouseLeave={() => setIsActive("")}
                          onClick={handleLogout}
                        >
                          <ArrowRightStartOnRectangleIcon
                            className={`h-4 w-4 ${
                              isActive === "cerrarSesion"
                                ? "text-white"
                                : "text-black"
                            }`}
                          />
                          Cerrar Sesión
                        </div>
                      </>
                    ) : (
                      <div
                        className={`pl-2.5 pr-5 py-2.5 w-full flex items-center gap-2.5 rounded-lg cursor-pointer ${
                          isActive === "cerrarSesion"
                            ? "bg-[#32ceb1] text-white"
                            : "bg-transparent text-black hover:bg-[#32ceb1] hover:text-white"
                        }`}
                        onMouseEnter={() => setIsActive("cerrarSesion")}
                        onMouseLeave={() => setIsActive("")}
                        onClick={handleLogout}
                      >
                        <ArrowRightStartOnRectangleIcon
                          className={`h-4 w-4 ${
                            isActive === "cerrarSesion"
                              ? "text-white"
                              : "text-black"
                          }`}
                        />
                        Cerrar Sesión
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="block lg:hidden">
          <Collapse open={openNav}>
            {navList}
            {!state.isAuth && (
              <div className="flex md:hidden items-center gap-x-1">
                <button
                  className="w-full rounded-lg border border-customBlack  p-2.5 text-center text-black text-base font-semibold"
                  onClick={handleLoginNavigation}
                >
                  INICIA SESIÓN
                </button>
                <button
                  className="w-full rounded-lg  bg-[#2a606e] p-2.5 text-center text-white text-base font-semibold"
                  onClick={handleRegisterNavigation}
                >
                  REGÍSTRATE
                </button>
              </div>
            )}
          </Collapse>
        </div>
      </Navbar>
    </div>
  );
}

export default StickyNavbar;
