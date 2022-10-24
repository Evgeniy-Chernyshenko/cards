import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { SignUpForm } from "./SignUpForm";
import { PATHS } from "../../app/AppRoutes";

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

export const SignUpPage = () => (
  <Wrapper>
    <h1>Sign Up</h1>
    <FormContainer>
      <SignUpForm />
    </FormContainer>
    <SignInContainer>
      <SignInText>Already have an account?</SignInText>
      <SignInLink to={PATHS.signin}>Sign In</SignInLink>
    </SignInContainer>
  </Wrapper>
);
