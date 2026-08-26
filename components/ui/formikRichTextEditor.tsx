"use client";

import { useField } from "formik";
import RichTextEditor from "./richTextEditor";
import { Label } from "@heroui/react";

export interface FormikRichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  minHeight?: number;
  /** Show the error only after the field has been touched (default true) */
  validateOnTouch?: boolean;
}

export default function FormikRichTextEditor({
  name,
  label,
  placeholder,
  isDisabled,
  minHeight,
  validateOnTouch = true,
}: FormikRichTextEditorProps) {
  const [field, meta, helpers] = useField(name);

  const showError = validateOnTouch ? meta.touched && !!meta.error : !!meta.error;

  return (
    <div className={`w-full flex flex-col text-black! gap-1  }`}>
      {label && (
        <Label className="text-sm font-medium text-black ">
          {label}
        </Label>
      )}
      <RichTextEditor
        value={field.value}
        onChange={(html) => helpers.setValue(html)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={placeholder}
        isInvalid={showError}
        isDisabled={isDisabled}
        minHeight={minHeight}
      />

      {showError && (
        <span className="text-tiny text-danger">{meta.error}</span>
      )}
    </div>
  );
}
