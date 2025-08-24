import React from 'react';
import { Typography, Card, CardBody, CardFooter, Button } from '@material-tailwind/react';
import { CalendarDaysIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import styles from './Reservation.module.css';

const ReservationDetail = ({ reservation }) => {
  if (!reservation) {
    return null;
  }

  const { product, startDate, endDate, totalPrice, status, reservationId } = reservation;

  const formattedStartDate = new Date(startDate).toLocaleDateString();
  const formattedEndDate = new Date(endDate).toLocaleDateString();

  const statusColor = status === 'ACTIVE' ? 'text-green-500' : 'text-red-500';
  const statusIcon = status === 'ACTIVE' ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />;

  return (
    <Card className={styles.reservationCard}>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Reserva #{reservationId}
        </Typography>
        {product && (
          <Typography>
            <span className="font-semibold">Vehículo:</span> {product.name}
          </Typography>
        )}
        <Typography className="flex items-center gap-1">
          <CalendarDaysIcon className="h-4 w-4" />
          <span className="font-semibold">Fechas:</span> {formattedStartDate} - {formattedEndDate}
        </Typography>
        <Typography className="flex items-center gap-1">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span className="font-semibold">Precio Total:</span> ${totalPrice}
        </Typography>
        <Typography className={`flex items-center gap-1 ${statusColor}`}>
          {statusIcon}
          <span className="font-semibold">Estado:</span> {status}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        {/* You can add buttons for actions like "View Details", "Cancel", etc. */}
        {/* <Button variant="text" size="sm">Ver Detalles</Button> */}
      </CardFooter>
    </Card>
  );
};

export default ReservationDetail;
