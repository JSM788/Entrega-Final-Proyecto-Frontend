import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ClockIcon,
  KeyIcon,
  LockClosedIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useContextGlobal } from '../Components/utils/global.context';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import ReactModal from 'react-modal';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
// Importa el componente AvailableVehicle
import DoubleCalendar from './AvailableVehicle';
import styles from '../Components/Styles/Share.module.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

ReactModal.setAppElement('#root');

const policies = [
  {
    icon: <ClockIcon className="h-6 w-6 text-[#32ceb1] mr-2" />,
    title: 'Política de reembolso',
    description: [
      'Si cancelas antes de 48 horas, recibirás un reembolso completo.',
      'Cancelaciones dentro de las 48 horas previas tendrán un cargo del 20%.',
      'El reembolso será procesado en un plazo máximo de 5 días hábiles.',
    ],
  },
  {
    icon: <KeyIcon className="h-6 w-6 text-[#32ceb1] mr-2" />,
    title: 'Política de devolución',
    description: [
      'Devuelve el vehículo en el mismo estado en el que lo recibiste.',
      'Asegúrate de que esté cargado al menos al 50% al momento de la devolución.',
      'Cargos adicionales pueden aplicar por daños o accesorios faltantes.',
    ],
  },
  {
    icon: <LockClosedIcon className="h-6 w-6 text-[#32ceb1] mr-2" />,
    title: 'Política de recojo',
    description: [
      'El recojo del vehículo debe ser programado con al menos 24 horas de anticipación.',
      'Presenta tu documento de identidad al momento del recojo.',
      'El vehículo será entregado completamente cargado y listo para usar.',
    ],
  },
];

const showPoliciesModal = () => {
  const policiesHTML = ReactDOMServer.renderToString(
    <div className="text-left">
      <h1 className="text-xl font-bold text-[#32ceb1]">¡Queremos que tu experiencia sea increíble!</h1>
      <p className="font-semibold text-lg mt-4">Nuestras políticas:</p>
      <div className="mt-4">
        {policies.map((policy, index) => (
          <div key={index} className="flex items-start mb-4">
            {policy.icon}
            <div>
              <h3 className="font-bold">{policy.title}</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                {policy.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>,
  );

  Swal.fire({
    html: policiesHTML,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'bg-white rounded-lg shadow-lg p-6 max-w-xl',
    },
  });
};

const ProductDetail = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const { state, dispatch } = useContextGlobal(); // Acceder al estado global
  const { isAuth } = state; // Extrae la información de autenticación
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false); // Estado para mostrar el calendario
  const [selectedCity, setSelectedCity] = useState(''); // Estado para almacenar la ciudad seleccionada
  const [selectedProductId, setSelectedProductId] = useState(null); // Mantener el ID del itemProduct
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para guardar el producto seleccionado
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const navigate = useNavigate();

  console.log(state.user);
  

  const location = useLocation();
  const cityFromLink = location.state?.city;

  const handleDateSelect = (range) => {
    if (range?.from && range?.to) {
      setSelectedRange(range); // Actualiza el estado con el rango seleccionado
      console.log('Rango de fechas seleccionado:', range);
    } else if (range?.from) {
      setSelectedRange({ from: range.from, to: null }); // Selecciona solo la fecha de inicio
    } else {
      setSelectedRange({ from: null, to: null }); // Limpiar las fechas si el rango es vacío
    }
  };

  useEffect(() => {
    if (cityFromLink) {
      setSelectedCity(cityFromLink.idCity); // Asegúrate de almacenar solo el idCity en selectedCity
      handleCityChange({ target: { value: cityFromLink.idCity } });
    }
  }, [cityFromLink]);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    console.log('cityId', cityId);
    // Filtrar los productos por la ciudad seleccionada
    console.log('product.itemProducts', product.itemProducts);
    const selectedProduct = product.itemProducts.find((product) => product.city.idCity === parseInt(cityId));
    console.log('selectedProduct', selectedProduct);
    // Si hay un producto correspondiente, actualizar el id del producto
    if (selectedProduct) {
      console.log('selectedProduct*', selectedProduct);
      setSelectedProductId(selectedProduct.id);
      setSelectedProduct(selectedProduct);
    } else {
      setSelectedProductId(null); // Si no hay producto, poner null
      setSelectedProduct(null);
    }
  };

  const handleReservationClick = () => {
    console.log('Selected Range:', selectedRange);
    if (!isAuth) {
      // Si el usuario no está autenticado, redirige al login
      navigate('/login');
    } else {
      // Si está autenticado, continúa con el proceso de reserva
      if (!selectedCity || !selectedProductId || !selectedRange.from || !selectedRange.to) {
        Swal.fire({
          title: 'Por favor, selecciona una ciudad y un rango de fechas para realizar tu reserva.',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            const progressBar = document.querySelector('.swal2-timer-progress-bar');
            if (progressBar) {
              progressBar.style.backgroundColor = '#D9534F';
            }
          },
        });
        return;
      }

      // Calcular el monto total de la reserva
      const normalizeToStartOfDay = (date) => {
        const normalized = new Date(date);
        normalized.setUTCHours(0, 0, 0, 0); // Normaliza al inicio del día
        return normalized;
      };

      // Normaliza las fechas seleccionadas
      const fromDate = normalizeToStartOfDay(selectedRange.from);
      const toDate = normalizeToStartOfDay(selectedRange.to || selectedRange.from); // Si no hay `to`, usa `from`

      // Calcula los días reservados (incluye el último día completo)
      const daysBooked = Math.max(1, Math.ceil((toDate - fromDate) / (1000 * 3600 * 24)) + 1);
      const totalAmount = daysBooked * product.pricePerDay; // Asumiendo que el precio es por hora

      Swal.fire({
        title: `<span style="color: #00696b;">Detalles de tu reserva</span>`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6">
            <div class="reservation-details">
              <!-- Imagen del producto a la izquierda -->
              <div class="product-image">
                <img
                  src="${product.images[0].url}"
                  alt="${product.name}"
                  style="max-width: 200px; border-radius: 10px"
                />
              </div>
      
              <!-- Información del producto a la derecha -->
              <div class="product-info">
                <p>
                  <strong>Vehiculo:</strong>
                  <span style="color: #00696b">${product.name}</span>
                </p>
                <p><strong>Fecha:</strong> <span style="color: #00696b">${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}</span></p>
                <p>
                  <strong>Ciudad de entrega:</strong>
                  <span style="color: #00696b">
                    ${selectedProduct.city.cityName} - ${selectedProduct.city.countryName}
                  </span>
                </p>
              </div>
            </div>
      
            <hr style="border: 2px solid #ddd" />
      
            <h1 style="margin: 8px 0; text-align: left; color: #00696b;"><strong>Datos de usuario y reservación</strong></h1>
            <div style="margin: 0 0 15px 10px; text-align: left">
              <p><strong>Nombre de Usuario:</strong> 
              <span style="color: #00696b">${state.user.fullName}</span></p>
              <p><strong>Correo:</strong> 
              <span style="color: #00696b">${state.user.email}</span></p>
            </div>

            <p class="texto-detalles" style="text-align: left; color: #00696b; margin-bottom: 5px;">
              "Revisa los detalles antes de confirmar tu reserva. ¡Nos aseguraremos de que tu vehículo esté listo!"
            </p>
      
            <!-- Sección oculta inicialmente -->
            <div id="extra-info" style="margin: 0 0 15px 10px; text-align: left; display: none;">
              <p><strong>Costo Total:</strong> <span style="color: #00696b">$${totalAmount.toFixed(2)}</span></p>
              <p><strong>N° de serie:</strong>
              <span style="color: #00696b">${selectedProduct.nro_serial}</span></p>
              <p><strong>Color:</strong>
              <span style="color: #00696b">${selectedProduct.color}</span></p>
              <p><strong>ID del Producto:</strong>
              <span style="color: #00696b">${selectedProduct.id}</span></p> 
              <p><strong>Descripción:</strong>
              <span style="color: #00696b">${product.description}</span></p>
            </div>
      
            <!-- Texto interactivo -->
            <p class="texto-detalles" id="toggle-text" style="cursor: pointer; color: #2980b9; text-decoration: underline; text-align: center;">
              Ver más detalles
            </p>
          </div>
        `,
        confirmButtonText: 'Confirmar Reserva',
        confirmButtonColor: '#32CEB1',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#D9534F',
        customClass: {
          popup: 'custom-swal-popup',
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
        didRender: () => {
          const toggleText = document.getElementById('toggle-text');
          const extraInfo = document.getElementById('extra-info');

          toggleText.addEventListener('click', () => {
            const isVisible = extraInfo.style.display === 'block';
            extraInfo.style.display = isVisible ? 'none' : 'block';
            toggleText.textContent = isVisible ? 'Ver más detalles' : 'Ver menos';

            const paragraph = document.querySelector('.texto-detalles');
            if (!isVisible) {
              extraInfo.appendChild(paragraph);
              paragraph.style.marginTop = '25px';
            } else {
              extraInfo.parentElement.insertBefore(paragraph, extraInfo.nextSibling);
              paragraph.style.marginTop = '0';
            }
          });

          const style = document.createElement('style');
          style.innerHTML = `
            .custom-swal-popup {
              max-width: 800px !important;
              width: 90% !important;
              padding: 20px !important;
            }

            .reservation-details {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 35px;
              background-color: #e4f0f0;
              padding: 15px 8px;
              margin-bottom: 8px;
            }

            .product-image {
              flex-shrink: 0;
            }

            .product-info {
              text-align: left;
            }

            @media (max-width: 768px) {
              .reservation-details {
                flex-direction: column;
                text-align: center;
              }

              .product-image img {
                margin-bottom: 10px;
              }

              .product-info {
                text-align: center;
              }

              .texto-detalles {
                font-size: 13px;
              }
            }

            .swal2-actions {
              display: flex !important; 
              justify-content: center; 
              gap: 10px; 
              margin: 10px 0 20px 0;
            }

            .swal-confirm-button, .swal-cancel-button {
              flex: 1; 
              padding: 5px; 
              font-size: 16px; 
              border-radius: 5px; 
            }
          `;
          document.head.appendChild(style);
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Procesando Reserva...',
            text: 'Por favor, espera un momento mientras confirmamos tu reserva.',
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading(); // Muestra el indicador de carga
            }
          });
          // Lógica para procesar la reserva (hacer una llamada a la API de reservas POST)
          const payload = {
            itemProductId: selectedProduct.id,
            startDate: selectedRange.from.toISOString().split('T')[0],
            endDate: selectedRange.to.toISOString().split('T')[0],
          };
          try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await axios.post(`${baseUrl}/api/reservations`, payload, {
              headers: {
                Authorization: `Bearer ${state.accessToken}`,
              },
            });
            dispatch({ type: 'ADD_RESERVATION', payload: response.data });
            setSelectedCity('');
            Swal.close();
            Swal.fire({
              title: 'Reserva confirmada con éxito',
              html: `
                <p style="text-align: center; margin-bottom: 20px;">
                  Hemos enviado todos los detalles a tu correo <strong>${state.user.email}</strong>.
                  Si necesitas más información, puedes revisarla en tu lista de reservas.
                  ¡Gracias por confiar en nosotros!
                </p>
              `,
              showCancelButton: true,
              confirmButtonText: 'OK, cerrar ventana',
              cancelButtonText: 'Ir a reservas',
              focusConfirm: false,
              customClass: {
                cancelButton: 'btn-ir-a-reservas',
                confirmButton: 'btn-ok-cerrar',
                title: 'title-centered',
                htmlContainer: 'html-centered',
              },
              buttonsStyling: false,
              willOpen: () => {
                const cancelButton = document.querySelector('.swal2-cancel');
                cancelButton.style.backgroundColor = '#00696b';
                cancelButton.style.color = 'white';
                cancelButton.style.border = 'none';
                cancelButton.style.padding = '10px 20px';
                cancelButton.style.fontSize = '16px';
                cancelButton.style.borderRadius = '5px';
                cancelButton.style.marginRight = '10px';

                cancelButton.addEventListener('mouseenter', () => {
                  cancelButton.style.backgroundColor = '#004d49';
                });

                cancelButton.addEventListener('mouseleave', () => {
                  cancelButton.style.backgroundColor = '#00696b';
                });

                const confirmButton = document.querySelector('.swal2-confirm');
                confirmButton.style.backgroundColor = '#32CEB1';
                confirmButton.style.color = 'white';
                confirmButton.style.border = 'none';
                confirmButton.style.padding = '10px 20px';
                confirmButton.style.fontSize = '16px';
                confirmButton.style.borderRadius = '5px';
                confirmButton.style.marginLeft = '10px';

                confirmButton.addEventListener('mouseenter', () => {
                  confirmButton.style.backgroundColor = '#28b3a0';
                });

                confirmButton.addEventListener('mouseleave', () => {
                  confirmButton.style.backgroundColor = '#32CEB1';
                });
              },
            }).then((result) => {
              if (result.isDismissed) {
                navigate('/reservations');
              }
            })
          } catch (error) {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema de conexón, por favor intentelo mas tarde.',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      });
    }
  };

  // Filtrar el producto específico desde el array vehicles en el contexto global
  const product = state.vehicles.find((vehicle) => vehicle.productId === Number(id));

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0].url);
    }
  }, [product]);
  // url para compartir link del producto
  const title = '¡Mira este sitio web!';
  const url = 'https://storage.googleapis.com/movelt-front/index.html' + product?.productId;

  // Si aún no hay vehículos cargados, muestra "Cargando..."
  if (!state.vehicles || state.vehicles.length === 0) {
    return <div>Cargando...</div>;
  }

  // Si ya cargaron los vehículos pero el producto no fue encontrado
  if (!product) {
    return <div>Producto no encontrado</div>;
  }
  return (
    <div className="w-full min-h-screen">
      <header className="m-auto flex sm:flex-row flex-col gap-4 items-start sm:items-center py-4 px-7 w-full">
        <Button size="sm" variant="text" className="flex items-center justify-end" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-6 w-6 text-deepTeal" />
        </Button>
        <div className="flex flex-col w-full items-start ml-0 sm:ml-12">
          <h4 className="text-lg	text-customBlack">{product.category.categoryName.toUpperCase()}</h4>
          <h3 className="text-2xl text-black font-semibold text-left flex-grow">{product.name}</h3>
          <div className="flex flex-col w-full pt-2">
            <h4 className="text-left text-black font-bold">Disponibilidad:</h4>
            <span className="text-left text-black">*Visualiza la disponibilidad según la ciudad de recojo </span>
            <div className="flex gap-2 w-full flex-col lg:flex-row">
              <select
                name="cities"
                id="cities"
                className="w-full lg:w-1/2 border border-gray-300 rounded-lg p-3"
                onChange={handleCityChange}
                value={selectedCity}
              >
                <option value="">Selecciona una ciudad</option>
                {product.itemProducts.map((item) => (
                  <option key={item.city.idCity} value={item.city.idCity}>
                    {item.city.cityName} - {item.city.countryName}
                  </option>
                ))}
              </select>
              {selectedCity && (
                <DoubleCalendar
                  productId={selectedProductId}
                  onDateSelect={handleDateSelect}
                  selectedCity={selectedCity}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="ml-auto border bg-[#2A606E] text-white rounded-lg p-2 flex gap-1" onClick={openModal}>
            <ShareIcon className="h-6 w-6 text-white" /> COMPARTIR
          </button>
          <button className="ml-auto border border-[#2A606E] rounded-lg p-2" onClick={showPoliciesModal}>
            <ExclamationCircleIcon className="h-5 w-6 text-deepTeal" />
          </button>
        </div>

        {/* Modal */}
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Compartir en redes sociales"
          className={styles.modal}
          style={{
            content: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '400px',
              height: '400px',
              maxWidth: '90%',
              margin: 'auto',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              zIndex: -1,
              gap: '20px',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <div className="modal-content">
            <p>Compartir este enlace</p>
            <p>Elige una red social para compartir:</p>
            <div className={styles.buttons}>
              <FacebookShareButton url={url} quote={title} onClick={closeModal}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>

              <TwitterShareButton url={url} title={title} onClick={closeModal}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>

              <WhatsappShareButton url={url} title={title} onClick={closeModal}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </div>
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white p-2 rounded">
              Cerrar
            </button>
          </div>
        </ReactModal>
      </header>
      {/* Contenido principal */}
      <main className="m-auto mt-8">
        <section className="flex justify-between gap-5 xl:flex-row flex-col">
          {/* Información del producto */}
          <div className="max-w-[792px] bg-mintTeal py-6 pr-0 pl-0 sm:pl-[115px] rounded-l-none sm:rounded-r-3xl flex flex-col sm:flex-row">
            <div className="text-lg text-start w-full sm:w-auto pr-0 sm:pr-[115px] pb-12 sm:pb-0 xl:pr-0 flex sm:flex-col flex-row items-start sm:items-stretch justify-center sm:justify-around">
              {/* Característica: Velocidad máxima */}
              <div className="flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10.45 15.5C10.85 15.9 11.3667 16.0958 12 16.0875C12.6333 16.0792 13.1 15.85 13.4 15.4L19 7L10.6 12.6C10.15 12.9 9.9125 13.3583 9.8875 13.975C9.8625 14.5917 10.05 15.1 10.45 15.5ZM12 4C12.9833 4 13.9292 4.1375 14.8375 4.4125C15.7458 4.6875 16.6 5.1 17.4 5.65L15.5 6.85C14.95 6.56667 14.3792 6.35417 13.7875 6.2125C13.1958 6.07083 12.6 6 12 6C9.78333 6 7.89583 6.77917 6.3375 8.3375C4.77917 9.89583 4 11.7833 4 14C4 14.7 4.09583 15.3917 4.2875 16.075C4.47917 16.7583 4.75 17.4 5.1 18H18.9C19.2833 17.3667 19.5625 16.7083 19.7375 16.025C19.9125 15.3417 20 14.6333 20 13.9C20 13.3 19.9292 12.7167 19.7875 12.15C19.6458 11.5833 19.4333 11.0333 19.15 10.5L20.35 8.6C20.85 9.38333 21.2458 10.2167 21.5375 11.1C21.8292 11.9833 21.9833 12.9 22 13.85C22.0167 14.8 21.9083 15.7083 21.675 16.575C21.4417 17.4417 21.1 18.2667 20.65 19.05C20.4667 19.35 20.2167 19.5833 19.9 19.75C19.5833 19.9167 19.25 20 18.9 20H5.1C4.75 20 4.41667 19.9167 4.1 19.75C3.78333 19.5833 3.53333 19.35 3.35 19.05C2.91667 18.3 2.58333 17.5042 2.35 16.6625C2.11667 15.8208 2 14.9333 2 14C2 12.6167 2.2625 11.3208 2.7875 10.1125C3.3125 8.90417 4.02917 7.84583 4.9375 6.9375C5.84583 6.02917 6.90833 5.3125 8.125 4.7875C9.34167 4.2625 10.6333 4 12 4Z"
                    fill="#595858"
                  />
                </svg>
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.maximumSpeed}</strong>
                  <span className="text-lg text-black"> km/h</span>
                  <br />
                  velocidad máxima
                </p>
              </div>
              {/* Característica: Potencia del motor */}
              <div className="flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11.3 20L16.3 10.25H12.8V4L7.8 13.75H11.3V20ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20Z"
                    fill="#595958"
                  />
                </svg>
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.enginePower}</strong>
                  <span className="text-lg text-black"> w</span>
                  <br />
                  potencia máxima del motor
                </p>
              </div>
              <hr className="border-t border-customGray3 my-1 hidden sm:block" />
              {/* Característica: Tiempo de carga */}
              <div className="flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15.3 16.7L16.7 15.3L13 11.6V7H11V12.4L15.3 16.7ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20Z"
                    fill="#595958"
                  />
                </svg>
                <p className="text-customBlack2 text-base w-28 font-semibold mt-1">
                  <strong className="text-black text-[32px]">{product.chargeTime}</strong>
                  <span className="text-lg text-black"> horas</span>
                  <br />
                  carga de 0% a 100%
                </p>
              </div>
            </div>

            {/* Imagen principal */}
            <div className="flex justify-center items-center">
              <img
                src={activeImage}
                alt={product.name}
                className="rounded-3xl w-[90%] sm:w-auto xl:w-[566px] shadow-md sm:ml-[15%]"
              />
            </div>
          </div>

          {/* Carrusel de imágenes */}
          <section className="block lg:hidden mt-8 overflow-x-auto md:overflow-hidden">
            <div className="flex md:justify-center gap-4 md:flex-nowrap">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${product.name} - imagen ${index + 1}`}
                  className={`h-24 w-32 object-cover cursor-pointer rounded-lg border first:!ml-8 ${
                    activeImage === image.url ? 'border-aquaTeal' : 'border-customGrayTransparent opacity-50'
                  }`}
                  onClick={() => setActiveImage(image.url)} // Cambiar imagen activa al hacer clic
                />
              ))}
            </div>
          </section>

          {/* Price and Plan */}

          <div className="bg-customGray p-6 rounded-2xl shadow-md w-[80%] lg:w-[40%] m-auto xl:mx-0 xl:w-[338px] h-[447px] xl:mr-[8%]">
            <h3 className="text-lg font-semibold text-start">PRECIOS Y PLANES</h3>
            <p className="text-base mt-2 text-start font-semibold">
              {product.category.categoryName.toUpperCase()}
              <span className="text-deepTeal"> {product.name}</span>
            </p>
            <div className="mt-4">
              <ul className="space-y-2">
                <li className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                  <div className="mt-4 ml-4">
                    <span className="block w-4 h-4 bg-deepTeal rounded-full"></span>
                  </div>
                  <span className="py-[10px] m-0 text-start">
                    <span className="text-sm font-semibold">Alquiler por hora</span>
                    <br />
                    <span className="text-lg">${product.pricePerHour}/</span>
                    <span className="font-semibold text-[11px]">por hora</span>
                  </span>
                </li>
                <li className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                  <div className="mt-4 ml-4">
                    <span className="block w-4 h-4 bg-deepTeal rounded-full"></span>
                  </div>
                  <span className="py-[10px] m-0 text-start">
                    <span className="text-sm font-semibold">Alquiler diario</span>
                    <br />
                    <span className="text-lg">${product.pricePerDay}/</span>
                    <span className="font-semibold text-[11px]">por día</span>
                  </span>
                </li>
                <li className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                  <div className="mt-4 ml-4">
                    <span className="block w-4 h-4 bg-deepTeal rounded-full"></span>
                  </div>
                  <span className="py-[10px] m-0 text-start">
                    <span className="text-sm font-semibold">Suscripción mensual</span>
                    <br />
                    <span className="text-lg">${product.pricePerMonth}/</span>
                    <span className="font-semibold text-[11px]">por mes</span>
                  </span>
                </li>
                <li className="flex space-x-2 items-start max-w-[251px] h-[66px]">
                  <div className="mt-4 ml-4">
                    <span className="block w-4 h-4 bg-deepTeal rounded-full"></span>
                  </div>
                  <span className="py-[10px] m-0 text-start">
                    <span className="text-sm font-semibold">Suscripción anual</span>
                    <br />
                    <span className="text-lg">${product.pricePerYear}/</span>
                    <span className="font-semibold text-[11px]">anual</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-2">
              <button className="bg-[#32ceb1] text-white px-4 py-2 rounded-md w-full" onClick={handleReservationClick}>
                INICIAR RESERVA
              </button>
            </div>
          </div>
        </section>

        {/* Mostrar el calendario en un modal */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full">
              <AvailabilityCalendar productId={product.productId} />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCalendar(false)} // Cerrar el modal
                  className="text-red-600 font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Carrusel de imágenes */}
        <section className="hidden lg:block mt-8 overflow-x-auto md:overflow-hidden">
          <div className="flex md:justify-center gap-4 md:flex-nowrap">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${product.name} - imagen ${index + 1}`}
                className={`h-24 w-32 object-cover cursor-pointer rounded-lg border ${
                  activeImage === image.url ? 'border-aquaTeal' : 'border-customGrayTransparent opacity-50'
                }`}
                onClick={() => setActiveImage(image.url)}
              />
            ))}
          </div>
        </section>

        {/* Characteristics */}
        {product.characteristics && product.characteristics.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold my-4 text-black underline" style={{ textDecorationColor: '#6adcc7' }}>
              CARACTERÍSTICAS:
            </h3>
            <section className="my-8 bg-customGray py-4 w-auto">
              <div className="flex overflow-x-auto whitespace-nowrap space-x-4">
                {/* Características dinámicas */}
                {product.characteristics?.map((caracteristica, index) => (
                  <div key={index} className="flex items-center min-w-[530px] first:!ml-8">
                    <img
                      src={caracteristica.featureImageUrl}
                      alt={caracteristica.featureName}
                      className="w-[223px] h-[174px] object-cover rounded-lg"
                    />
                    <div className="bg-mintTeal2 rounded-l-none rounded-r-lg min-w-[280px] text-start p-7">
                      <p className="mt-2 font-medium text-lg text-black">{caracteristica.featureName}</p>
                      <p className="text-[11px] text-black">{caracteristica.featureDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
