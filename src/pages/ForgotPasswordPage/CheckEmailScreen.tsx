import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { PATHS } from "../../app/AppRoutes";
import letter from "../../assets/images/letter.svg";
import { WrapContainer } from "../../components/WrapContainer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
`;

const Image = styled.img`
  display: block;
  width: 108px;
`;

const SentText = styled.span`
  font-weight: var(--fw1);
  color: var(--text-color2);
  text-align: center;
`;

export const CheckEmailScreen = (props: PropsType) => {
  return (
    <WrapContainer>
      <Wrapper>
        <h1>Check Email</h1>
        <Image src={letter} alt="Letter" />
        <SentText>
          We’ve sent an Email with instructions to {props.email}
        </SentText>
        <Button
          component={Link}
          to={PATHS.signin}
          variant="contained"
          fullWidth
        >
          Back to login
        </Button>
      </Wrapper>{" "}
    </WrapContainer>
  );
};

type PropsType = {
  email: string;
};
