import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authThunks } from "../../store/auth-reducer";
import { PATHS } from "../../app/AppRoutes";

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-top: 40px;
`;

const InstructionsContainer = styled.div`
  margin-bottom: 60px;
  font-weight: var(--fw1);
  text-align: left;
  margin-top: 25px;
  color: var(--text-color2);
`;

const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be more than 7 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

export const SetNewPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const { resetPasswordToken } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    if (!resetPasswordToken) {
      return;
    }

    const isSuccessful = await dispatch(
      authThunks.setNewPassword({ password, resetPasswordToken })
    );

    isSuccessful && navigate(PATHS.signin);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldsContainer>
        <FormControl variant="standard">
          <InputLabel htmlFor="password" error={!!errors.password}>
            {errors.password ? errors.password.message : "Password"}
          </InputLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("password")}
            error={!!errors.password}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel
            htmlFor="confirmPassword"
            error={!!errors.confirmPassword}
          >
            {errors.confirmPassword
              ? errors.confirmPassword.message
              : "Confirm password"}
          </InputLabel>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            autoComplete="new-password"
          />
        </FormControl>
      </FieldsContainer>
      <InstructionsContainer>
        Create new password and we will send you further instructions to email
      </InstructionsContainer>
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<></>}
      >
        Create new password
      </LoadingButton>
    </form>
  );
};

type Inputs = {
  password: string;
  confirmPassword: string;
};
