import React from "react";
import { useState } from "react";
import styles from "../Components/Styles/SignIn.module.css";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    nationality: "",
    birthDate: "",
  });
  // Definicion de los errores
  const [nameError, setNameError] = useState(false);

  //Manejo logica de verificacion
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (/[^a-zA-Z0-9]/.test(formData.firstName)) {
      setNameError(true);
    }else{
      setNameError(false);
        
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Aquí puedes manejar la lógica de registro
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1>Registrarse</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Primer Nombre
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChangeName}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu primer nombre"
          />
        </div>
        {nameError ? (
          <>
            <h2 style={{ color: "red" }}>
              Tu nombre no puede contener caracteres especiales
            </h2>
          </>
        ) : null}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Segundo Nombre
          </label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu segundo nombre"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu apellido"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu número de teléfono"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu dirección"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="********"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nacionalidad
          </label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tu nacionalidad"
          />
        </div>

        {/* Uncomment this section if you want to include birth date */}
        {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div> */}

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Registrarse
        </button>

        <p className="mt-4 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/logIn" className="text-blue-500 hover:underline">
            Iniciar Sesión
          </a>
        </p>
      </form>
    </div>
  );
};
