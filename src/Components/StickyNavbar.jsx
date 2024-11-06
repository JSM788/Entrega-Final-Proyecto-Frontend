import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
  const navigate = useNavigate(); // Hook de navegación
  const isLoggedIn = false;
  // const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const user = { name: "Ana Cecilia", email: "ana@gmail.com", role: "admin" }; // Datos del usuario

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    // setIsLoggedIn(false);
    navigate("/logIn");
  };

  const handleLoginNavigation = () => {
    navigate("/logIn");
  };

  const handleRegisterNavigation = () => {
    navigate("/singIn");
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

            {!isLoggedIn ? (
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
                  {getInitials(user.name)}
                </div>
                {/* Menú desplegable */}
                {openSubMenu && (
                  <div className="absolute  right-0 flex h-[212px] w-[214px] p-5 bg-customGray2 rounded-lg shadow flex-col justify-start items-start gap-2.5">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center justify-center w-[54px] h-[54px] rounded-full bg-customBlack text-white text-lg font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-center text-black text-xl font-medium font-['Roboto']">
                          {user.name}
                        </div>
                        <div className="text-[#79747e] text-[13px] font-medium font-['Roboto']">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-[0px] border border-customGray3"></div>
                    <div className="pl-2.5 pr-5 py-2.5 justify-start items-center gap-2.5 flex">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.85 17.1C6.7 16.45 7.65 15.9375 8.7 15.5625C9.75 15.1875 10.85 15 12 15C13.15 15 14.25 15.1875 15.3 15.5625C16.35 15.9375 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1875 15.6417 19.5125 14.775C19.8375 13.9083 20 12.9833 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 12.9833 4.1625 13.9083 4.4875 14.775C4.8125 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1875 12.6625 9.5125 11.9875C8.8375 11.3125 8.5 10.4833 8.5 9.5C8.5 8.51667 8.8375 7.6875 9.5125 7.0125C10.1875 6.3375 11.0167 6 12 6C12.9833 6 13.8125 6.3375 14.4875 7.0125C15.1625 7.6875 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1625 11.3125 14.4875 11.9875C13.8125 12.6625 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.8708 14.5 19.6125C15.2833 19.3542 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6458 14.5 17.3875C13.7167 17.1292 12.8833 17 12 17C11.1167 17 10.2833 17.1292 9.5 17.3875C8.71667 17.6458 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3542 9.5 19.6125C10.2833 19.8708 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z"
                          fill="black"
                        />
                      </svg>

                      {user.role === "admin" ? (
                        <span
                          onClick={() => navigate("/admin")}
                          className="text-black text-lg font-medium cursor-pointer"
                        >
                          Administración
                        </span>
                      ) : (
                        <span
                          onClick={() => navigate("/my-profile")}
                          className="text-black text-lg font-medium cursor-pointer"
                        >
                          Mi Cuenta
                        </span>
                      )}
                    </div>
                    <button
                      className="self-stretch pl-2.5 pr-5 py-2.5 bg-[#32ceb1] rounded-lg justify-center items-center gap-2.5 flex text-white text-lg font-medium font-['Roboto']"
                      onClick={handleLogout}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
                          fill="white"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="block lg:hidden">
          <Collapse open={openNav}>
            {navList}
            {!isLoggedIn && (
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
