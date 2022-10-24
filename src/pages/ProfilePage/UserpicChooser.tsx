import styled from "@emotion/styled";
import { PhotoCamera } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Wrapper = styled.label`
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 96px;
  &:hover > label {
    background-color: #989898;
  }
`;

const UserPic = styled.img`
  width: 96px;
  display: block;
  z-index: 0;
`;

export const UserpicChooser = (props: PropsType) => {
  return (
    <Wrapper>
      <UserPic src={props.image} alt={props.imageDescription} />
      <IconButton
        size="small"
        sx={{
          backgroundColor: "#808080",
          color: "white",
          position: "absolute",
          right: "0",
          bottom: "0",
          verticalAlign: "text-bottom",
          "&:hover": { backgroundColor: "#989898" },
          zIndex: 1,
        }}
        component="label"
      >
        <PhotoCamera />
        <input hidden accept="image/*" type="file" />
      </IconButton>
    </Wrapper>
  );
};

type PropsType = {
  image: string;
  imageDescription: string;
};
