import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authThunks } from "../../store/auth-reducer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../app/AppRoutes";

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 40px 0 60px 0;
`;

const schema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be more than 7 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

export const SignUpForm = () => {
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    const isSuccessful = await dispatch(authThunks.signup({ email, password }));

    isSuccessful && navigate(PATHS.signin, { replace: true });
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
        <TextField
          label={errors.email ? errors.email.message : "Email"}
          variant="standard"
          {...register("email")}
          error={!!errors.email}
        />
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
          />
        </FormControl>
      </FieldsContainer>
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<></>}
      >
        Sign Up
      </LoadingButton>
    </form>
  );
};

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};
