import { styled, TextField } from "@mui/material";

const StyledInput = styled(TextField)({
  "& .MuiInputBase-root": {
    width: "auto",
    "&::before": {
      border: "none",
    },
    "&:hover::before": {
      borderBottom: "none !important",
    },
    "& input": {
      direction: "rtl",
    },
  },
});

export { StyledInput };
