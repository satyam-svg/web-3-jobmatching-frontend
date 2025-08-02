import React from "react";

interface InputProps {
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  label,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-300 text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};
