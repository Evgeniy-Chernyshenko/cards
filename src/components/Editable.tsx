import styled from "@emotion/styled";
import { ModeEdit } from "@mui/icons-material";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";

const EditableSpan = styled.span`
  font-size: 20px;
  align-items: center;
  gap: 5px;
  text-decoration: underline dashed 1px;
  text-underline-position: under;
  cursor: pointer;
  height: 48px;
`;

export const Editable = ({
  label,
  initialValue,
  onEdit,
  buttonText = "save",
  emptyValueErrorText = "Value is required",
  fullWidth = false,
}: PropsType) => {
  const [value, setValue] = useState(initialValue);
  const [clearValue, setClearValue] = useState("");
  const [error, setError] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    setClearValue("");
  }, [initialValue]);

  useEffect(() => {
    const clearValue = value.trim();
    clearValue ? setError(false) : setError(true);
    setClearValue(clearValue);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.code === "Enter" && sendValue();
  };

  const handleButtonClick = () => {
    sendValue();
  };

  const handleBlur = () => {
    sendValue();
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const sendValue = async () => {
    if (!clearValue) {
      return;
    }

    let isSuccessful = false;
    if (clearValue !== initialValue) {
      setIsLoading(true);
      isSuccessful = await onEdit(clearValue);
      setIsLoading(false);
    }

    !isSuccessful ? setValue(initialValue) : setValue(clearValue);
    setIsEditMode(false);
  };

  if (!isEditMode) {
    return (
      <EditableSpan
        onClick={handleEditClick}
        style={{ display: fullWidth ? "flex" : "inline-flex" }}
      >
        {value}
        <IconButton size="small" onClick={handleEditClick}>
          <ModeEdit fontSize="small" />
        </IconButton>
      </EditableSpan>
    );
  }

  return (
    <TextField
      fullWidth={fullWidth}
      label={error ? emptyValueErrorText : label}
      value={value}
      error={error}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      variant="standard"
      autoFocus
      InputProps={{
        endAdornment: (
          <Button
            variant="contained"
            disabled={error || isLoading}
            sx={{
              borderRadius: "2px",
              fontSize: 12,
              fontWeight: 400,
              padding: "2px 10px",
              minWidth: 0,
              textTransform: "uppercase",
            }}
            onClick={handleButtonClick}
            startIcon={
              isLoading && (
                <CircularProgress
                  size={12}
                  sx={{ color: "#ffffff", marginLeft: "8px" }}
                />
              )
            }
          >
            {buttonText}
          </Button>
        ),
      }}
    />
  );
};

type PropsType = {
  label: string;
  initialValue: string;
  onEdit: (value: string) => Promise<boolean>;
  buttonText?: string;
  emptyValueErrorText?: string;
  fullWidth?: boolean;
};
