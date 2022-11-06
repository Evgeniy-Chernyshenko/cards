import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { SignInForm } from "./SignInForm";
import { PATHS } from "../../app/AppRoutes";
import { WrapContainer } from "../../components/WrapContainer";

const Wrapper = styled.div`
  text-align: center;
`;

const FormContainer = styled.div`
  margin-bottom: 40px;
`;

const SignInContainer = styled.div`
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

export const SignInPage = () => {
  return (
    <WrapContainer>
      <Wrapper>
        <h1>Sign In</h1>
        <FormContainer>
          <SignInForm />
        </FormContainer>
        <SignInContainer>
          <SignInText>Don't have an account?</SignInText>
          <SignInLink to={PATHS.signup}>Sign Up</SignInLink>
        </SignInContainer>
      </Wrapper>
    </WrapContainer>
  );
};
