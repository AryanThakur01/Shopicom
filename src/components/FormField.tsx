"use client";
import React, { ReactNode } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { LuAlertCircle, LuPlus, LuPlusCircle } from "react-icons/lu";

interface IFormField {
  type: string;
  placeholder?: string;
  uni: string;
  register: UseFormRegister<any>;
  icon?: React.ReactNode;
  containerClass?: string;
  error?: string;
  label?: string;
  as?: string;
  children?: ReactNode;
  inputClass?: string;
  labelClass?: string;
}

const FormField: React.FC<IFormField> = ({
  type,
  placeholder,
  uni,
  icon,
  register,
  containerClass,
  error,
  label,
  as,
  children,
  inputClass,
  labelClass,
}) => {
  return (
    <div className={containerClass}>
      <label htmlFor={uni} className="block mb-2">
        {label}
      </label>
      {type === "options" && (
        <select
          {...register(uni)}
          className="w-full mb-4 rounded bg-background p-2 px-8"
        >
          {children}
        </select>
      )}
      {type === "file" && (
        <label
          className={
            "cursor-pointer group bg-background rounded-lg flex justify-center items-center text-muted-foreground px-4 border " +
            " " +
            (error ? " border-destructive" : "border-muted") +
            " " +
            labelClass
          }
          htmlFor={uni}
        >
          {children ? (
            children
          ) : (
            <LuPlusCircle className="fill-primary size-10 stroke-1 stroke-foreground" />
          )}
          <input type={type} id={uni} {...register(uni)} className="hidden" />
        </label>
      )}
      {(type === "text" || type === "password" || type === "email") && (
        <>
          <label
            className={
              "bg-background rounded-lg flex items-center text-muted-foreground px-4 min-h-10 border " +
              " " +
              (error ? " border-destructive" : "border-muted") +
              " " +
              labelClass
            }
            htmlFor={uni}
          >
            <span>{icon}</span>
            {as === "textarea" ? (
              <textarea
                id={uni}
                {...register(uni)}
                className="w-full px-4 resize-none h-40 outline-none bg-background my-2"
                placeholder={placeholder}
              />
            ) : (
              <input
                type={type}
                className={
                  "w-full bg-transparent px-4 outline-none text-foreground placeholder:text-muted-foreground " +
                  inputClass
                }
                placeholder={placeholder}
                id={uni}
                {...register(uni)}
              />
            )}
            <span>
              {error && (
                <LuAlertCircle className="fill-destructive stroke-background size-6" />
              )}
            </span>
          </label>
          <p className="h-4 text-xs px-4 text-destructive mt-1">{error}</p>
        </>
      )}
    </div>
  );
};

export default FormField;
