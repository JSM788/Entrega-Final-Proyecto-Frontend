const ErrorMessage = ({ field }) => {
  return (
    <p className="text-sm text-red-500 font-bold">
      {field}
    </p>
  )
}

export default ErrorMessage;