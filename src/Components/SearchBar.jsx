import React, { useState, useEffect } from 'react';
import { Typography, Input, Button } from '@material-tailwind/react';
import map from '../assets/icons/map.svg';
import calendario from '../assets/icons/calendario.svg';
import './Styles/SearchBar.css'; // Asegúrate de importar el CSS
import Swal from 'sweetalert2';
import { useContextGlobal } from '../Components/utils/global.context'; // Importar el contexto global
import axios from 'axios';

export const SearchBar = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityError, setCityError] = useState(false); // Estado para el error de ciudad
  const [startDate, setStartDate] = useState(''); // Fecha de recogida
  const [endDate, setEndDate] = useState(''); // Fecha de devolución
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [touchedStartDate, setTouchedStartDate] = useState(false);
  const [touchedEndDate, setTouchedEndDate] = useState(false);

  const { dispatch } = useContextGlobal(); // Para actualizar el estado global

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/cities`);
        setCities(response.data); // Asignar las ciudades recibidas
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cargar las ciudades.',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };
    fetchCities();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === '') {
      setFilteredCities([]);
    } else {
      const filtered = cities.filter((city) => city?.cityName?.toLowerCase().includes(value.toLowerCase()));
      setFilteredCities(filtered.slice(0, 5)); // Mostrar solo los primeros 5 resultados
    }
  };

  // Función para resaltar las coincidencias en el nombre de la ciudad
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index} className="font-bold text-[#2A606E]">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  const handleCitySelect = (city) => {
    setInputValue(`${city.cityName}, ${city.countryName}`);
    setSelectedCity(city);
    setFilteredCities([]);
    setCityError(false); // Resetear el error al seleccionar la ciudad
  };

  const validateStartDate = (date) => {
    if (!date) return 'La fecha de recogida es obligatoria.';
    if (new Date(date) <= today) return 'Debe ser al menos un día después de hoy.';
    return '';
  };

  const validateEndDate = (startDate, endDate) => {
    if (!endDate) return 'La fecha de devolución es obligatoria.';
    if (new Date(endDate) <= new Date(startDate))
      return 'La fecha de devolución debe ser posterior a la fecha de recogida.';
    if (new Date(endDate).getTime() === new Date(startDate).getTime())
      return 'La fecha de devolución no puede ser la misma que la fecha de recogida.';
    return '';
  };

  // Validar dinámicamente las fechas
  useEffect(() => {
    if (touchedStartDate) {
      setStartDateError(validateStartDate(startDate));
    }
  }, [startDate, touchedStartDate]);

  useEffect(() => {
    if (touchedEndDate) {
      setEndDateError(validateEndDate(startDate, endDate));
    }
  }, [startDate, endDate, touchedEndDate]);

  const handleSearch = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!selectedCity) {
      setCityError(true);
      valid = false;
    }

    if (startDateError || endDateError) {
      valid = false;
    }

    // Verificar si todos los campos están mal
    if (!valid) {
      Swal.fire({
        title: 'Algo salió mal con la búsqueda. Intenta de nuevo.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          const progressBar = document.querySelector('.swal2-timer-progress-bar');
          if (progressBar) {
            progressBar.style.backgroundColor = 'red';
          }
        },
      });
      return;
    }

    // Si hay errores individuales, detener la ejecución sin Swal
    //if (!valid) return;

    const city = selectedCity.cityName;

    dispatch({ type: 'SET_IS_LOADING_VEHICLES', payload: true });
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${baseUrl}/api/products/search/${startDate}/${endDate}/${city}`);
      dispatch({ type: 'SET_FILTERED_VEHICLES', payload: response.data });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron obtener los vehículos.',
        showConfirmButton: false,
        timer: 2000,
      });
      dispatch({ type: 'SET_FILTERED_VEHICLES', payload: [] });
    } finally {
      // Detener el estado de carga después de la búsqueda
      dispatch({ type: 'SET_IS_LOADING_VEHICLES', payload: false });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && filteredCities.length > 0) {
      e.preventDefault(); // Prevenir el comportamiento predeterminado de tabulación
      const firstCity = filteredCities[0];
      setInputValue(`${firstCity.cityName}, ${firstCity.countryName}`);
      setSelectedCity(firstCity);
      setFilteredCities([]);
    }
  };

  const clearCityInput = () => {
    setInputValue('');
    setFilteredCities([]);
    setSelectedCity(null);
    setCityError(false);
  };

  const handleBlur = () => {
    const matchedCity = cities.find(
      (city) => `${city.cityName}, ${city.countryName}`.toLowerCase() === inputValue.toLowerCase(),
    );
    if (matchedCity) {
      setSelectedCity(matchedCity);
      setCityError(false);
    } else {
      setCityError(true);
    }
  };

  const handleMouseOver = (index) => {
    const city = filteredCities[index];
    if (city) {
      handleCitySelect(city);
    }
  };

  return (
    <div className="p-4 bg-[#DEECEC] rounded-lg mt-5 mx-auto w-[90%]">
      <form>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-y-1">
          <div className="flex flex-col lg:relative">
            <Typography variant="small" className="text-left">
              Recoge el vehículo en
            </Typography>
            <div className="relative">
              <img src={map} className="input-icon" alt="Icono de ciudad" />
              <Input
                type="text"
                placeholder="Ciudad"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Detectar la tecla Tab
                className="p-2 pl-10 pr-4 !mt-0 placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
                labelProps={{ className: 'hidden' }}
                onBlur={handleBlur} // Verificar la ciudad al perder el foco
              />
              {inputValue && (
                <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={clearCityInput}>
                  &#10005;
                </button>
              )}
              {filteredCities.length > 0 && (
                <div className="absolute bg-white p-1 shadow-lg rounded-lg w-full mt-1 max-h-40 overflow-y-auto z-20 transition-all ease-in-out duration-300">
                  {filteredCities.map((city) => (
                    <div
                      key={city.idCity}
                      className="p-2 cursor-pointer hover:bg-gray-200 hover:ring-2 hover:ring-[#2A606E] rounded transition-all"
                      onClick={() => handleCitySelect(city)}
                    >
                      {highlightMatch(`${city.cityName}, ${city.countryName}`, inputValue)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm mt-1 lg:hidden">
                {cityError && <p className="error-message">La ciudad no se encuentra en la lista.</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:relative">
            <Typography variant="small" className="text-left">
              Fecha de recogida
            </Typography>
            <div className="relative z-10">
              <img src={calendario} className="input-icon" alt="Icono de Calendario" />
              <Input
                type="date"
                value={startDate}
                min={formattedTomorrow}
                onBlur={() => setTouchedStartDate(true)}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 pl-10 !mt-0 placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
                labelProps={{ className: 'hidden' }}
              />
            </div>
            <div className="text-sm mt-1 lg:hidden">
              {touchedStartDate && startDateError && <p className="error-message">{startDateError}</p>}
            </div>
          </div>

          <div className="flex flex-col lg:relative">
            <Typography variant="small" className="text-left">
              Fecha de devolución
            </Typography>
            <div className="relative z-10">
              <img src={calendario} className="input-icon" alt="Icono de Calendario" />
              <Input
                type="date"
                value={endDate}
                min={startDate || formattedTomorrow}
                onBlur={() => setTouchedEndDate(true)}
                onChange={(e) => setEndDate(e.target.value)}
                labelProps={{ className: 'hidden' }}
                className="p-2 pl-10 !mt-0 placeholder-gray-100 !border-t-blue-gray-200 focus:!border-t-gray-900 bg-white ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900"
              />
            </div>
            <div className="text-sm  mt-1 lg:hidden">
              {touchedEndDate && endDateError && <p className="error-message">{endDateError}</p>}
            </div>
          </div>

          <div className="flex flex-col col-span-1 md:col-span-3 lg:col-span-1 lg:justify-end">
            <Button
              onClick={handleSearch}
              className="w-full bg-[#2A606E] hover:bg-[#2A606E] focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Buscar
            </Button>
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 lg:col-span-4 gap-2 mb-1">
            <div className="text-sm mt-1">
              {cityError && <p className="error-message">La ciudad no se encuentra en la lista.</p>}
            </div>

            <div className="text-sm mt-1">
              {touchedStartDate && startDateError && <p className="error-message">{startDateError}</p>}
            </div>

            <div className="text-sm mt-1">
              {touchedEndDate && endDateError && <p className="error-message">{endDateError}</p>}
            </div>
            <div className=""></div>
          </div>
        </div>
      </form>
    </div>
  );
};
