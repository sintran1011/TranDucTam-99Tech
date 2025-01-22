"use client";

import { Stack, Typography } from "@mui/material";
import {
  Children,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  cloneElement,
} from "react";
import { Controller, FormProvider } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

type ChildProps = ReactElement<any, string | JSXElementConstructor<any>>;

interface IProps<T extends FieldValues> {
  className?: string;
  children: ReactNode;
  form: UseFormReturn<T, unknown, undefined>;
  onSubmit?: (data: T) => void;
  onError?: (data: FieldErrors<T>) => void;
  formName?: string;
}

interface FormItem {
  control?: Control<FieldValues, unknown>;
  children:
    | ChildProps
    | readonly ReactElement<unknown, string | JSXElementConstructor<unknown>>[];
  name: string;
  label?: string | ReactNode;
  className?: string;
  showError?: boolean;
}

const BasicForm = <T extends FieldValues>(props: IProps<T>) => {
  const {
    className,
    children,
    form,
    onSubmit = () => {},
    formName = "formName",
    onError = () => {},
  } = props;
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form
        id={formName}
        onSubmit={handleSubmit(onSubmit, onError)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};

const FormItem = (props: FormItem) => {
  const { children, name = "", label, className, showError = false } = props;
  return (
    <Controller
      name={name}
      control={props?.control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        const error = fieldState?.error?.message;
        return (
          <Stack gap="8px" className={className}>
            {label ? (
              <label>
                <Typography
                  fontWeight={500}
                  fontSize="14px"
                  lineHeight="20px"
                  color={error ? "error" : "dark"}
                >
                  {label}
                </Typography>
              </label>
            ) : null}
            {Children.map(children, (child: ChildProps) => {
              return cloneElement(child, {
                ...child?.props,
                onChange,
                onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (typeof value !== "string") return onChange(e);
                  const trimmedValue = value.replace(/\s+/g, " ").trim();
                  onChange(trimmedValue);
                  onBlur();
                },
                value,
                style: {
                  border: error ? "1px solid error" : "none",
                },
              });
            })}
            {error && showError ? (
              <Typography
                sx={{
                  bottom: 0,
                  fontWeight: 500,
                  color: "error",
                }}
              >
                {error}
              </Typography>
            ) : null}
          </Stack>
        );
      }}
    />
  );
};

BasicForm.FormItem = FormItem;

export default BasicForm;

BasicForm.displayName = "BasicForm";
