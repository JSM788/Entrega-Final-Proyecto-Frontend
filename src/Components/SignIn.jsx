import React from "react";
import { useState } from "react";
import styles from "../Components/Styles/SignIn.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import FormInput from './FormInput';

export const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    nationality: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [birthDateFields, setBirthDateFields] = useState({
    day: '',
    month: '',
    year: ''
  });

  const handleBirthDateChange = (field, value) => {
    const newBirthDateFields = { ...birthDateFields, [field]: value };
    setBirthDateFields(newBirthDateFields);
    
    if (newBirthDateFields.day && newBirthDateFields.month && newBirthDateFields.year) {
      const fullDate = `${newBirthDateFields.year}-${newBirthDateFields.month.padStart(2, '0')}-${newBirthDateFields.day.padStart(2, '0')}`;
      setFormData(prev => ({
        ...prev,
        birthDate: fullDate
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
      case "lastName":
        return {
          isValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(value.trim()),
          error: "Solo letras, entre 2 y 30 caracteres"
        };
      case "email":
        return {
          isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          error: "Email inválido"
        };
      case "phone":
        return {
          isValid: /^\+?[\d\s-]{10,}$/.test(value),
          error: "Número de teléfono inválido"
        };
      case "address":
        return {
          isValid: value.trim().length >= 5,
          error: "La dirección debe tener al menos 5 caracteres"
        };
      case "password":
        return {
          isValid: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
          error: "Mínimo 8 caracteres, al menos una letra y un número"
        };
      case "nationality":
        return {
          isValid: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(value.trim()),
          error: "Nacionalidad inválida"
        };
      case "birthDate":
        const date = new Date(value);
        const today = new Date();
        const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return {
          isValid: date <= minAge,
          error: "Debes ser mayor de 18 años"
        };
      default:
        return { isValid: true, error: "" };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const { isValid, error } = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: !isValid ? error : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const { isValid, error } = validateField(key, formData[key]);
      if (!isValid) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, revisa los campos marcados en rojo',
        confirmButtonColor: '#32CEB1'
      });
      return;
    }

    const fullName = `${formData.name} ${formData.lastName}`.trim();
    const username = formData.email.split('@')[0];
    const birthDate = `${birthDateFields.year}-${birthDateFields.month.padStart(2,"0")}-${birthDateFields.day.padStart(2, "0")}`;
    const formattedData = {
      address: formData.address,
      birthDate,
      nationality: formData.nationality,
      password: formData.password,
      phone: formData.phone,
      username,
      fullName,
      email: formData.email,
      role: ["USER"],
    }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseUrl}/api/auth/signup`, formattedData);
      console.log('respuesta:', response.status);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Gracias por registrarte!',
          html: `
              <p>
                Te hemos enviado un correo para confirmar tu dirección. Revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta. 
                En caso de que no te haya llegado ningún correo, puedes 
                <a href="#" id="resendEmailLink" style="color: #32CEB1; text-decoration: underline;">volver a enviarlo</a>.
              </p>
              <button id="loginButton" class="swal2-confirm swal2-styled" style="background-color: #32CEB1; margin-top: 20px;">
                INICIAR SESIÓN
              </button>
            `,
            showConfirmButton: false,
        });
        document.getElementById('resendEmailLink').addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            // Reemplazar la solicitud con una solicitud POST y enviar el correo como parámetro de consulta
            const email = encodeURIComponent(formData.email); // Asegurarse de que el correo esté codificado para la URL
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await axios.post(`${baseUrl}/api/auth/resend-confirmation?email=${email}`);
        
            Swal.fire({
              icon: 'success',
              title: 'Correo reenviado',
              text: 'Te hemos reenviado el correo de confirmación. Revisa tu bandeja de entrada y la carpeta de spam.',
              confirmButtonColor: '#32CEB1',
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error al reenviar',
              text: error.response?.data?.message || 'Hubo un problema al intentar reenviar el correo.',
              confirmButtonColor: '#32CEB1',
            });
          }
        });

        document.getElementById('loginButton').addEventListener('click', () => {
          navigate("/login");
        });
      
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar usuario',
        confirmButtonColor: '#32CEB1'
      });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1>Registrarse</h1>

        <FormInput
          label="Nombre"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          error={errors.name}
        />


        <FormInput
          label="Apellido"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Tu apellido"
          error={errors.lastName}
        />

        <FormInput
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          error={errors.email}
        />

        <FormInput
          label="Teléfono"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Tu número de teléfono"
          error={errors.phone}
        />

        <FormInput
          label="Dirección"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Tu dirección"
          error={errors.address}
        />

        <FormInput
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          error={errors.password}
        />

        <FormInput
          label="Nacionalidad"
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          placeholder="Tu nacionalidad"
          error={errors.nationality}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              name="day"
              value={birthDateFields.day}
              onChange={(e) => handleBirthDateChange('day', e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Día</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            
            <select
              name="month"
              value={birthDateFields.month}
              onChange={(e) => handleBirthDateChange('month', e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Mes</option>
              {[
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ].map((month, i) => (
                <option key={i + 1} value={i + 1}>{month}</option>
              ))}
            </select>
            
            <select
              name="year"
              value={birthDateFields.year}
              onChange={(e) => handleBirthDateChange('year', e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Año</option>
              {[...Array(100)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md">
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
