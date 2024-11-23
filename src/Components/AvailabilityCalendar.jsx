import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AvailabilityCalendar = ({ productId }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/reservations/availability/${productId}`);
        if (!response.ok) throw new Error('Error al obtener la disponibilidad');
        const data = await response.json();
        setAvailableDates(data.available);
        setOccupiedDates(data.occupied);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede obtener la información de disponibilidad en este momento.',
        });
      }
    };

    fetchAvailability();
  }, [productId]);

  const isDateOccupied = (date) => {
    return occupiedDates.some(occupiedDate => 
      new Date(occupiedDate).toDateString() === date.toDateString()
    );
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <h3>Disponibilidad</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4>Fecha de Inicio</h4>
          <DatePicker
            selected={startDate}
            onChange={date => {
              setStartDate(date);
              // Limitar las fechas de finalización a las fechas disponibles después de la fecha de inicio
              if (endDate && date > endDate) {
                setEndDate(null); // Reiniciar la fecha de finalización si es anterior a la nueva fecha de inicio
              }
            }}
            inline
            filterDate={date => availableDates.some(availableDate => 
              new Date(availableDate).toDateString() === date.toDateString()
            )}
            dayClassName={date => 
              isDateOccupied(date) ? 'bg-red-500 text-white' : 
              availableDates.some(availableDate => 
                new Date(availableDate).toDateString() === date.toDateString()
              ) ? 'bg-green-500 text-white' : undefined
            }
          />
        </div>
        <div>
          <h4>Fecha de Finalización</h4>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            inline
            filterDate={date => availableDates.some(availableDate => 
              new Date(availableDate).toDateString() === date.toDateString() && 
              date > startDate // Asegurarse de que la fecha de finalización sea posterior a la de inicio
            )}
            dayClassName={date => 
              isDateOccupied(date) ? 'bg-red-500 text-white' : 
              availableDates.some(availableDate => 
                new Date(availableDate).toDateString() === date.toDateString()
              ) ? 'bg-green-500 text-white' : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;