import {
  MenuItemProps as MUIMenuItemProps,
  MenuItem,
  SelectProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { ReactNode, forwardRef } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CustomSelect } from "./styled";

export type MenuItemLabel = string | ReactNode;

export interface MenuItemProps {
  value: string;
  label: MenuItemLabel;
  icon?: string;
  disabled?: boolean;
}

interface IProps<T> extends Omit<SelectProps, "options"> {
  options: MenuItemProps[];
  width?: number | string;
  height?: number | string;
  typographyProps?: TypographyProps;
  menuItemProps?: MUIMenuItemProps;
  placeholder?: string;
  multiple?: boolean;
  renderItem?: (label: T) => ReactNode;
  classes?: {
    icon?: string;
  };
}

const BasicSelect = ({
  height,
  width = 140,
  fullWidth = false,
  options = [],
  typographyProps,
  sx,
  MenuProps,
  menuItemProps,
  placeholder,
  multiple = false,
  renderValue,
  renderItem,
  classes,
  ...restProps
}: IProps<MenuItemProps>) => {
  const sxProps = {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    minWidth: fullWidth ? "100%" : width,
    height,
    ...sx,
  };

  const CustomIcon = forwardRef((props, _ref) => (
    <ArrowDropDownIcon
      {...props}
      style={{
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
      }}
    />
  ));

  const renderLabel = (label: MenuItemLabel) => {
    if (typeof label === "string")
      return (
        <Typography color="white" fontSize="14px" {...typographyProps}>
          {label}
        </Typography>
      );
    return label;
  };

  return (
    <CustomSelect
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#1C1919",
            borderRadius: "8px",
          },
        },
        MenuListProps: {
          sx: {
            padding: 0,
            maxHeight: "336px",
          },
        },
        ...MenuProps,
      }}
      // IconComponent={CustomIcon}
      sx={sxProps}
      multiple={multiple}
      displayEmpty
      {...restProps}
      renderValue={(value) => {
        const isValidValue = multiple ? (value as []).length > 0 : !!value;
        if (!isValidValue) {
          return (
            <Typography color="#767272" fontSize="14px" lineHeight="20px">
              {placeholder}
            </Typography>
          );
        }
        return renderValue ? renderValue(value) : (value as string);
      }}
    >
      {options && options.length > 0 ? (
        options.map((i, idx) => (
          <MenuItem
            sx={{
              padding: "12px",
              "&:hover": {
                backgroundColor: "#332D2D",
              },
            }}
            disabled={i?.disabled}
            key={i.value || idx}
            value={i.value}
            {...menuItemProps}
          >
            {!!renderItem ? renderItem(i) : renderLabel(i.label)}
          </MenuItem>
        ))
      ) : (
        <MenuItem
          sx={{
            padding: "12px",
            "&:hover": {
              backgroundColor: "#332D2D",
            },
            userSelect: "none",
          }}
          {...menuItemProps}
        >
          {renderLabel("N/A")}
        </MenuItem>
      )}
    </CustomSelect>
  );
};

export default BasicSelect;
