import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "./utils/global.context";
import Swal from "sweetalert2";

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
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

                      <span
                        onClick={handleMiCuenta}
                        className="text-black text-lg font-medium cursor-pointer"
                      >
                        Mi Cuenta
                      </span>
                    </div>
                    {state.user.roles.includes("ROLE_ADMIN") ? (
                      <>
                        <button
                          className="self-stretch pl-2.5 pr-5 py-2.5 bg-[#32ceb1] rounded-lg justify-center items-center gap-2.5 flex text-white text-lg font-medium font-['Roboto']"
                          onClick={() =>  {
                            navigate("/admin");
                            setOpenSubMenu(false); // Cierra el submenú
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H7V2C7 1.45 7.19583 0.979167 7.5875 0.5875C7.97917 0.195833 8.45 0 9 0H11C11.55 0 12.0208 0.195833 12.4125 0.5875C12.8042 0.979167 13 1.45 13 2V5H18C18.55 5 19.0208 5.19583 19.4125 5.5875C19.8042 5.97917 20 6.45 20 7V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM2 18H18V7H13C13 7.55 12.8042 8.02083 12.4125 8.4125C12.0208 8.80417 11.55 9 11 9H9C8.45 9 7.97917 8.80417 7.5875 8.4125C7.19583 8.02083 7 7.55 7 7H2V18ZM4 16H10V15.55C10 15.2667 9.92083 15.0042 9.7625 14.7625C9.60417 14.5208 9.38333 14.3333 9.1 14.2C8.76667 14.05 8.42917 13.9375 8.0875 13.8625C7.74583 13.7875 7.38333 13.75 7 13.75C6.61667 13.75 6.25417 13.7875 5.9125 13.8625C5.57083 13.9375 5.23333 14.05 4.9 14.2C4.61667 14.3333 4.39583 14.5208 4.2375 14.7625C4.07917 15.0042 4 15.2667 4 15.55V16ZM12 14.5H16V13H12V14.5ZM7 13C7.41667 13 7.77083 12.8542 8.0625 12.5625C8.35417 12.2708 8.5 11.9167 8.5 11.5C8.5 11.0833 8.35417 10.7292 8.0625 10.4375C7.77083 10.1458 7.41667 10 7 10C6.58333 10 6.22917 10.1458 5.9375 10.4375C5.64583 10.7292 5.5 11.0833 5.5 11.5C5.5 11.9167 5.64583 12.2708 5.9375 12.5625C6.22917 12.8542 6.58333 13 7 13ZM12 11.5H16V10H12V11.5ZM9 7H11V2H9V7Z"
                              fill="white"
                            />
                          </svg>
                          Administración
                        </button>
                        <div className="pl-2.5 pr-5 py-2.5 justify-start items-center gap-2.5 flex">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.5 18C1.95 18 1.47917 17.8042 1.0875 17.4125C0.695833 17.0208 0.5 16.55 0.5 16V2C0.5 1.45 0.695833 0.979167 1.0875 0.5875C1.47917 0.195833 1.95 0 2.5 0H9.5V2H2.5V16H9.5V18H2.5ZM13.5 14L12.125 12.55L14.675 10H6.5V8H14.675L12.125 5.45L13.5 4L18.5 9L13.5 14Z"
                              fill="#272727"
                            />
                          </svg>

                          <span
                            onClick={handleLogout}
                            className="text-black text-lg font-medium cursor-pointer"
                          >
                            Cerrar Sesión
                          </span>
                        </div>
                      </>
                    ) : (
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
