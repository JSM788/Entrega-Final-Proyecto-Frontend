const MobileMessage = ({
  title = "Acceso no disponible",
  message = "La página de administración no está disponible en dispositivos móviles.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-red-600">{title}</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default MobileMessage;
