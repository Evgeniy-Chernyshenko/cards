import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authThunks } from "../../store/auth-reducer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../app/AppRoutes";

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-top: 40px;
`;

const ForgotPasswordLinkContainer = styled.div`
  margin-bottom: 60px;
  text-align: right;
`;

const ForgotPasswordLink = styled(Link)`
  color: var(--text-color1);
`;

const schema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required"),
});

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
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

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const isSuccessful = await dispatch(authThunks.signin(values));

    isSuccessful && navigate(PATHS.profile, { replace: true });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Remember me"
          {...register("rememberMe")}
        />
      </FieldsContainer>
      <ForgotPasswordLinkContainer>
        <ForgotPasswordLink to={PATHS.forgotPassword}>
          Forgot password?
        </ForgotPasswordLink>
      </ForgotPasswordLinkContainer>
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<></>}
      >
        Sign In
      </LoadingButton>
    </form>
  );
};

type Inputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};
