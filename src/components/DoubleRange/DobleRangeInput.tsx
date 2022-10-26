import { TextField } from "@mui/material";

export const DobleRangeInput = ({ disabled = false, value }: PropsType) => {
  return (
    <TextField
      size="small"
      inputProps={{
        style: {
          width: 20,
          fontSize: 14,
          paddingLeft: 6,
          paddingRight: 6,
          textAlign: "center",
        },
      }}
      disabled={disabled}
      value={value}
    />
  );
};

type PropsType = {
  disabled?: boolean;
  value: undefined | number;
};
