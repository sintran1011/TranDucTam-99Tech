import type { InputBaseProps, InputProps } from "@mui/material";
import type { Key } from "react";
import { StyledInput } from "./styled";

interface InputNumberProps extends Omit<InputBaseProps, "onChange" | "value"> {
  value?: Key;
  onChange?: (val: Key) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputNumber = (props: InputNumberProps) => {
  const { value, onChange = () => {}, placeholder, onFocus } = props;
  return (
    <StyledInput
      type="text"
      value={value}
      placeholder={placeholder}
      sx={{ borderRadius: "4px" }}
      onChange={(e) => {
        const inputValue = (e.target as HTMLInputElement).value;
        const validInput = inputValue.replace(/[^0-9.,]/g, "");
        onChange(validInput);
      }}
      variant="standard"
      onFocus={onFocus}
    />
  );
};

export default InputNumber;
