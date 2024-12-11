import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Button } from '@material-tailwind/react';

import { ArrowLeftIcon, ClockIcon, KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export const ReservationDetail = ({ reservation }) => {
  const {
    reservationCode,
    product: { name: productName, pricePerDay, productId },
    images,
    startDate,
    endDate,
    itemProducts,
    totalPrice,
  } = reservation;

  // Función para determinar el estado de la reserva
  const determineReservationStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > today) return 'Confirmada';
    if (end < today) return 'Finalizada';
    return 'En proceso';
  };

  // Define colores basados en el estado
  const statusColors = {
    Confirmada: 'text-green-600',
    Finalizada: 'text-blue-600',
    'En proceso': 'text-yellow-600',
  };

  const status = determineReservationStatus(startDate, endDate);

  return (
    <div className="w-full items-center max-w-4xl mx-auto border rounded-lg shadow-lg overflow-hidden mb-4">
      <div className="bg-[#FAFAFA] p-4 sm:p-6">
        <div className="flex flex-col pb-1">
          <div className="flex flex-col">
            <h5 className="mb-1 font-semibold text-center sm:text-left">Código: {reservationCode}</h5>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between bg-white sm:max-h-48">
          {/* Imagen del producto */}
          <div className="flex justify-center items-center sm:w-1/2 w-full p-0 h-48 sm:h-auto">
            <img
              src={images?.[0]?.url || 'https://via.placeholder.com/150'}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detalles de la reserva */}
          <div className="flex flex-col w-full sm:w-2/3 justify-start p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-black text-center sm:text-left">{productName}</h3>
              <span
                className={`text-sm font-bold uppercase ${
                  statusColors[status] || 'text-gray-600'
                } sm:text-right text-center`}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-col justify-start items-start mb-1">
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-bold">Fecha:</span> {startDate} - {endDate}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-bold">Ciudad de recogida:</span>{' '}
                {itemProducts?.[0]?.city?.cityName && itemProducts?.[0]?.city?.countryName
                  ? `${itemProducts[0]?.city?.cityName}, ${itemProducts[0]?.city?.countryName}`
                  : 'No especificada'}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-bold">Precio por día:</span> ${pricePerDay.toFixed(2)}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-bold">Precio:</span> ${totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <Link to={`/product/${productId}`}>
                <Button
                  size="sm"
                  color="gray"
                  className="flex items-center gap-1 border bg-[#2A606E] text-white rounded-lg px-4 py-2"
                >
                  <KeyIcon className="h-5 w-5 text-white" />
                  Ver producto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
