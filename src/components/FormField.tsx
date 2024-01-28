"use client";
import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { LuAlertCircle } from "react-icons/lu";

interface IFormField {
  type: string;
  placeholder?: string;
  uni: string;
  register: UseFormRegister<any>;
  icon?: React.ReactNode;
  containerClass?: string;
  error?: string;
}

const FormField: React.FC<IFormField> = ({
  type,
  placeholder,
  uni,
  icon,
  register,
  containerClass,
  error,
}) => {
  return (
    <div>
      <label
        className={
          (error && "border-destructive border") +
          " bg-background rounded-lg flex items-center text-muted-foreground h-10 px-4 " +
          containerClass
        }
        htmlFor={uni}
      >
        <span>{icon}</span>
        <input
          type={type}
          className="w-full bg-transparent px-4 outline-none text-foreground placeholder:text-muted-foreground"
          placeholder={placeholder}
          id={uni}
          {...register(uni)}
        />
        <span>
          {error && (
            <LuAlertCircle className="fill-destructive stroke-background size-6" />
          )}
        </span>
      </label>
      <p className="h-4 text-xs px-4 text-destructive mt-1">{error}</p>
    </div>
  );
};

export default FormField;
