import React from 'react';

const FormInput = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = true 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full p-2 border rounded-md
          ${error 
            ? "border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:ring-teal-500"
          }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput; 