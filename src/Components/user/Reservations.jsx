import { useContextGlobal } from '../../Components/utils/global.context.jsx';
import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ClockIcon,
  KeyIcon,
  LockClosedIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { Button, Typography } from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReservationDetail } from './ReservationDetail';
import styles from '../Styles/Reservation.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Reservations = () => {
  const navigate = useNavigate();
  const { state } = useContextGlobal();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/reservations/history/user`, {
          params: {
            page: 0,
            size: 10,
          },
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });

        console.log('Respuesta de la API: ', response.data);

        // Validamos que response.data.reservations exista y sea un arreglo
        const fetchedReservations = response?.data?.reservations;
        if (Array.isArray(fetchedReservations)) {
          setReservations(fetchedReservations);
        } else {
          setReservations([]); // Si no existen reservas, forzar un estado de arreglo vacío
        }
      } catch (err) {
        console.error('Error al obtener reservas: ', err);
        setError(err.response?.data?.message || 'Error inesperado');
        setReservations([]); // Limpia las reservas en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <>
      <div className="">
        <header className="m-auto flex sm:flex-row flex-col items-start sm:items-center py-4 px-7 w-full">
          <Button size="sm" variant="text" className="flex items-center justify-end" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-6 w-6 text-deepTeal" />
          </Button>
          <div className="flex flex-col w-full items-start ml-0 sm:ml-12">
            <h4 className="text-lg	text-customBlack">{}</h4>
            <h3 className="text-2xl text-black font-semibold text-left flex-grow">MIS RESERVAS</h3>
          </div>
        </header>
      </div>
      <main className={styles.reservationContainer}>
        {/* Renderizamos todas las reservaciones */}
        {loading && <p className="text-center">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && reservations.length === 0 && (
          <div className="w-full h-[70vh] flex flex-col p-20">
            <Typography variant="paragraph" className="text-center text-gray-500">
              Aún no tienes reservaciones registradas.
            </Typography>
            <Link to="/" className="text-center text-[#2A606E] text-2xl font-semibold">
              ¡Haz tu primera reserva ahora!
            </Link>
          </div>
        )}
        {!loading &&
          reservations.length > 0 &&
          reservations.map((reservation) => (
            <ReservationDetail key={reservation.reservationId} reservation={reservation} />
          ))}
      </main>
    </>
  );
};
