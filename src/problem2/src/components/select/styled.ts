"use client";

import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomSelect = styled(Select)({
  "&.MuiInputBase-root ": {
    backgroundColor: "#ffffff0a",
    minWidth: "auto",
    padding: "12px 0",
    "& .MuiSelect-select": {
      paddingLeft: "0",
    },
  },
});

export { CustomSelect };
