"use client";

import React from "react";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  disabled?: boolean;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  disabled,
  errors,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })} // handles the onChange, onFocus etc.
          className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-50
          ${errors[id] && "focus:ring-rose-500 "}
          ${disabled && "cursor-default opacity-50 "}`}
        />
      </div>
    </div>
  );
};

export default Input;
