import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authThunks } from "../../store/auth-reducer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
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
  email: yup.string().required("Email is required").email("Invalid email"),
});

export const ForgotPasswordForm = (props: PropsType) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    const isSuccessful = await dispatch(
      authThunks.sendRestorePasswordToken({
        email,
        from: "Cards App Support <no-reply@cardsapp.com>",
        message: `
          <h1>Restore your password</h1>
          <p>Your password recovery link: <a href="${process.env.REACT_APP_FRONTEND_BASE_URL}${PATHS.setNewPassword}/$token$">${process.env.REACT_APP_FRONTEND_BASE_URL}${PATHS.setNewPassword}/$token$</a>.</p>
        `,
      })
    );

    if (isSuccessful) {
      reset();
      props.onSuccessful(email);
    }
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
      </FieldsContainer>
      <InstructionsContainer>
        Enter your email address and we will send you further instructions
      </InstructionsContainer>
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingPosition="start"
        variant="contained"
        fullWidth
        startIcon={<></>}
      >
        Send Instructions
      </LoadingButton>
    </form>
  );
};

type Inputs = {
  email: string;
};

type PropsType = {
  onSuccessful: (email: string) => void;
};
