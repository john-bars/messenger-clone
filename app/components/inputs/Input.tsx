"use client";

import clsx from "clsx";
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
    </div>
  );
};

export default Input;
