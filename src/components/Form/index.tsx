"use client";

import { FormEvent, useMemo, useState } from "react";

import { cn } from "@/helpers/cn";
import Button from "../Elements/Button";

type FieldType = "text" | "radio" | "time" | "multiselect" | "textarea";

type RadioOption = {
  label: string;
  value: string;
};

export type FormFieldValue = string | string[];

type SubmitResult = {
  ok: boolean;
  error?: string;
};

export type FormFields = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: RadioOption[];
  required?: boolean;
  defaultValue?: string;
  defaultValues?: string[];
};

export type FormProps = {
  name?: string;
  fields: FormFields[];
  submitLabel?: string;
  title?: string;
  className?: string;
  submitAction?: (values: Record<string, FormFieldValue>) => Promise<SubmitResult>;
};

export default function FormWrapper({
  fields,
  submitLabel = "Submit",
  title = "Registration",
  className,
  submitAction,
}: FormProps) {
  const [status, setStatus] = useState<"idle" | "registering" | "success" | "error" >("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialValues = useMemo(() => {
    return fields.reduce<Record<string, FormFieldValue>>((acc, field) => {
      if (field.type === "multiselect") {
        acc[field.name] = field.defaultValues ?? [];
        return acc;
      }
      acc[field.name] = field.defaultValue ?? "";
      return acc;
    }, {});
  }, [fields]);

  const [values, setValues] = useState<Record<string, FormFieldValue>>(initialValues);
  const [submittedValues, setSubmittedValues] = useState<Record<string, FormFieldValue> | null>(null);

  const handleValueChange = (name: string, value: string) => {
    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));
  };

  const handleMultiSelectToggle = (name: string, optionValue: string) => {
    setValues((previousValues) => {
      const currentValues = previousValues[name];
      const currentArray = Array.isArray(currentValues) ? currentValues : [];
      const nextValues = currentArray.includes(optionValue)
        ? currentArray.filter((value) => value !== optionValue)
        : [...currentArray, optionValue];

      return {
        ...previousValues,
        [name]: nextValues,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!submitAction) {
      setSubmittedValues(values);
      setStatus("success");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    submitAction(values)
      .then((result) => {
        if (result.ok) {
          setSubmittedValues(values);
          setStatus("success");
          return;
        }
        setStatus("error");
        setErrorMessage(result.error ?? "Failed to submit form. Please try again.");
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Failed to submit form. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if(status === "idle") {
    return (
      <div className="text-center">
        <Button
          label={submitLabel}
          onClick={() => setStatus("registering")}
          icon="lucide:plus"
        />
      </div>
    );
  }

  if (status === "success") {
    return (
      <section className={cn("rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm", className)}>
        <h2 className="text-xl font-semibold text-green-900">Submission received</h2>
        <p className="mt-2 text-sm text-green-800">
          Your response has been saved successfully.
        </p>
      </section>
    );
  }

  return (
    <section className={cn("rounded-xl border border-default-200 bg-white p-6 shadow-sm", className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => {
          if (field.type === "radio") {
            return (
              <fieldset key={field.name} className="space-y-2">
                <legend className="text-sm font-medium text-default-900">{field.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {field.options?.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "cursor-pointer rounded-md border px-3 py-2 text-sm transition",
                        values[field.name] === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-default-200 hover:border-primary/50",
                      )}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name={field.name}
                        value={option.value}
                        required={field.required}
                        checked={values[field.name] === option.value}
                        onChange={(event) => handleValueChange(field.name, event.target.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }

          if (field.type === "multiselect") {
            const selectedValues = Array.isArray(values[field.name]) ? values[field.name] : [];

            return (
              <fieldset key={field.name} className="space-y-2">
                <legend className="text-sm font-medium text-default-900">{field.label}</legend>
                <div className="grid gap-2">
                  {field.options?.map((option) => {
                    const isChecked = selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                          isChecked
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-default-200 hover:border-primary/50",
                        )}
                      >
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option.value}
                          checked={isChecked}
                          onChange={() => handleMultiSelectToggle(field.name, option.value)}
                          className="h-4 w-4 rounded border-default-300 text-primary focus:ring-primary/20"
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium text-default-900">
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={typeof values[field.name] === "string" ? values[field.name] : ""}
                  onChange={(event) => handleValueChange(field.name, event.target.value)}
                  rows={4}
                  className="block w-full rounded-md border border-default-300 bg-white px-3 py-2 text-sm text-default-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium text-default-900">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                value={typeof values[field.name] === "string" ? values[field.name] : ""}
                onChange={(event) => handleValueChange(field.name, event.target.value)}
                className="block h-10 w-full rounded-md border border-default-300 bg-white px-3 py-2 text-sm text-default-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          );
        })}

        <Button
          type="submit"
          label={isSubmitting ? "Submitting..." : submitLabel}
          icon="lucide:plus"
          disabled={isSubmitting}
        />
      </form>

      {status === "error" && errorMessage ? (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {submittedValues ? (
        <pre className="mt-4 overflow-x-auto rounded-md bg-default-100 p-3 text-xs text-default-800">
          {JSON.stringify(submittedValues, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
