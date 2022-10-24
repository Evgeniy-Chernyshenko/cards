import styled from "@emotion/styled";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

const Wrapper = styled.div`
  text-align: center;
`;

export const SetNewPasswordPage = () => {
  return (
    <Wrapper>
      <h1>Create new password</h1>
      <SetNewPasswordForm />
    </Wrapper>
  );
};
