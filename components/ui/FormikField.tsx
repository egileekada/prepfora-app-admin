"use client";

import { useField, useFormikContext, getIn } from "formik";
import {
    InputGroup,
    Label,
    TextField,
    Select,
    ListBox,
    TextArea,
} from "@heroui/react";
import { ReactNode, useState } from "react";
import { Danger, Eye, EyeSlash, InfoCircle } from "iconsax-reactjs";
import { AnimatePresence, motion } from "framer-motion";

interface Option {
    label: string;
    value: string;
}

interface FormikFieldProps<T = unknown> {
    name: string;
    label?: string;
    placeholder?: string;
    type?: string;
    as?: "input" | "textarea" | "select";
    options?: Option[];
    info?: string;

    multiple?: boolean;

    prefix?: ReactNode;
    suffix?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    isPassword?: boolean;

    selectClassName?: string;
    selectTriggerClassName?: string;
    selectPopoverClassName?: string;
    selectIndicatorClassName?: string;
    isTouched?: boolean
}

export function FormikField<T = unknown>({
    name,
    label,
    placeholder,
    type = "text",
    as = "input",
    options = [],
    prefix,
    suffix,
    disabled = false,
    loading = false,
    className,
    isPassword,
    selectClassName,
    selectTriggerClassName,
    selectPopoverClassName,
    selectIndicatorClassName,
    info,
    multiple,
    isTouched
}: FormikFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    const [field] = useField<T>(name);

    const { errors, touched, setFieldValue, setFieldTouched, validateField } =
        useFormikContext<Record<string, unknown>>();

    const fieldError = getIn(errors, name) as string | undefined;
    const fieldTouched = getIn(touched, name) as boolean | undefined; 

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputValue = field.value ?? "";

    const accessibleLabel = label || placeholder || name;

    const handleChange = async (val: unknown) => {
        await setFieldValue(name, val, true);
    };

    const handleBlur = async () => {
        await setFieldTouched(name, true, true);
    };

    const getSelectedLabel = () => {
        if (!inputValue) return placeholder || "Select option";

        if (multiple && Array.isArray(inputValue)) {
            return options
                .filter((opt) => inputValue.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ");
        }

        const selected = options.find(
            (opt) => String(opt.value) === String(inputValue),
        );

        return selected?.label || String(inputValue);
    };

    console.log(fieldError);
    console.log(fieldTouched);
    

    return (
        <div className={`w-full flex flex-col text-black! gap-1 ${className || ""}`}>
            {label && (
                <Label className="text-sm font-medium text-black ">
                    {label}
                </Label>
            )}

            {/* INPUT */}
            {as === "input" && (
                <TextField name={name} aria-label={accessibleLabel}>
                    <InputGroup
                        className={`bg-white rounded-[8px] p-px border h-fit border-neutral-150 ${
                            (fieldTouched || isTouched)&& fieldError ? "border-red-500" : ""
                        }`}
                    >
                        {prefix && (
                            <InputGroup.Prefix>{prefix}</InputGroup.Prefix>
                        )}

                        <InputGroup.Input
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            aria-label={accessibleLabel}
                            value={String(inputValue)}
                            type={inputType}
                            placeholder={placeholder}
                            disabled={disabled || loading}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            className={`w-full bg-white placeholder:text-neutral-150 text-black! ${
                                isPassword ? "rounded-l-[8px]" : "rounded-[8px]"
                            } h-[45px] text-sm`}
                        />

                        {loading ? (
                            <InputGroup.Suffix>
                                <span className="animate-spin text-black text-sm">
                                    ⏳
                                </span>
                            </InputGroup.Suffix>
                        ) : isPassword ? (
                            <InputGroup.Suffix>
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="h-[45px] w-full flex items-center justify-center"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeSlash size="20" />
                                    ) : (
                                        <Eye size="20" />
                                    )}
                                </button>
                            </InputGroup.Suffix>
                        ) : (
                            suffix && (
                                <InputGroup.Suffix>{suffix}</InputGroup.Suffix>
                            )
                        )}
                    </InputGroup>
                </TextField>
            )}

            {/* TEXTAREA */}
            {as === "textarea" && (
                <TextArea
                    value={String(inputValue)}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    aria-label={accessibleLabel}
                    disabled={disabled || loading}
                    className={`w-full h-[100px] bg-white  text-black border border-neutral-150 ${
                        (fieldTouched || isTouched)&& fieldError ? "border-red-500" : ""
                    }`}
                />
            )}

            {/* SINGLE SELECT */}
            {as === "select" && !multiple && (
                <Select
                    value={inputValue ? String(inputValue) : undefined}
                    onChange={async (key) => {
                        await setFieldValue(name, key ? String(key) : "", true);
                        await setFieldTouched(name, true, true);
                    }}
                    placeholder={placeholder || "Select option"}
                    aria-label={accessibleLabel}
                    isDisabled={disabled || loading}
                    className={`rounded-md bg-white h-[45px] border border-neutral-150 ${
                        selectClassName || ""
                    }`}
                >
                    <Select.Trigger
                        className={`rounded-md bg-white h-[45px] text-sm ${
                            selectTriggerClassName || ""
                        }`}
                    >
                        <Select.Value className="text-sm">
                            {getSelectedLabel()}
                        </Select.Value>

                        <Select.Indicator
                            className={selectIndicatorClassName}
                        />
                    </Select.Trigger>

                    <Select.Popover
                        className={`rounded-md ${selectPopoverClassName || ""}`}
                    >
                        <ListBox className="text-sm">
                            {options.map((opt) => (
                                <ListBox.Item
                                    key={opt.value}
                                    id={opt.value}
                                    textValue={opt.label}
                                    className="text-sm"
                                >
                                    {opt.label}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            )}

            {/* MULTIPLE SELECT */}
            {as === "select" && multiple && (
                <Select
                    selectionMode="multiple"
                    value={
                        Array.isArray(inputValue) ? [...inputValue] : undefined
                    }
                    onChange={(keys) => {
                        handleChange(keys);
                        handleBlur();
                    }}
                    placeholder={placeholder || "Select option"}
                    aria-label={accessibleLabel}
                    isDisabled={disabled || loading}
                    className={`rounded-md bg-white h-[40px] ${
                        selectClassName || ""
                    }`}
                >
                    <Select.Trigger
                        className={`rounded-md bg-white h-[40px] ${
                            selectTriggerClassName || ""
                        }`}
                    >
                        <Select.Value>{getSelectedLabel()}</Select.Value>

                        <Select.Indicator
                            className={selectIndicatorClassName}
                        />
                    </Select.Trigger>

                    <Select.Popover
                        className={`rounded-md ${selectPopoverClassName || ""}`}
                    >
                        <ListBox selectionMode="multiple">
                            {options.map((opt) => (
                                <ListBox.Item
                                    key={opt.value}
                                    id={opt.value}
                                    textValue={opt.label}
                                >
                                    {opt.label}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            )}
            <AnimatePresence mode="wait">
                {(fieldTouched || isTouched)&& fieldError ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-1 items-center text-red-500"
                    >
                        <Danger size={18} color="#fb2c36" />

                        <p className="text-xs capitalize font-medium">
                            {String(fieldError)}
                        </p>
                    </motion.div>
                ) : info ? (
                    <motion.div
                        key="info"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-1 items-center text-grey-03"
                    >
                        <InfoCircle size={18} color="#A3A3A3" />

                        <p className="text-xs font-medium">{info}</p>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
