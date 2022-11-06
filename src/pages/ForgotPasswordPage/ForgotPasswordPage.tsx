import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { PATHS } from "../../app/AppRoutes";
import { useState } from "react";
import { CheckEmailScreen } from "./CheckEmailScreen";
import { WrapContainer } from "../../components/WrapContainer";

const Wrapper = styled.div`
  text-align: center;
`;

const FormContainer = styled.div`
  margin-bottom: 40px;
`;

const TryLoggingInContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const SignInText = styled.span`
  font-weight: var(--fw3);
  color: var(--text-color2);
`;

const SignInLink = styled(Link)`
  font-weight: var(--fw3);
  font-size: 16px;
`;

export const ForgotPasswordPage = () => {
  const [successfullEmail, setSuccessfullEmail] = useState<null | string>(null);

  const onSuccesfull = (email: string) => {
    setSuccessfullEmail(email);
  };

  if (successfullEmail) {
    return <CheckEmailScreen email={successfullEmail} />;
  }

  return (
    <WrapContainer>
      <Wrapper>
        <h1>Forgot your password?</h1>
        <FormContainer>
          <ForgotPasswordForm onSuccessful={onSuccesfull} />
        </FormContainer>
        <TryLoggingInContainer>
          <SignInText>Did you remember your password?</SignInText>
          <SignInLink to={PATHS.signin}>Try logging in</SignInLink>
        </TryLoggingInContainer>
      </Wrapper>{" "}
    </WrapContainer>
  );
};
