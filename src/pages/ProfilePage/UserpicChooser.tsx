import styled from "@emotion/styled";
import { PhotoCamera } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { authThunks } from "../../store/auth-reducer";
import mockUserPic from "../../assets/images/mock-user-pic.png";
import { SmartImage } from "../../components/SmartImage";

const Wrapper = styled.label`
  display: inline-block;
  position: relative;
  cursor: pointer;
  &:hover > label {
    background-color: #989898;
  }
`;

const UserPic = styled(SmartImage)`
  width: 96px;
  height: 96px;
  border-radius: 100%;
  object-fit: cover;
  display: block;
  z-index: 0;
`;

export const UserpicChooser = (props: PropsType) => {
  const [image, setImage] = useState(props.image || mockUserPic);

  useLayoutEffect(() => {
    setImage(props.image || mockUserPic);
  }, [props.image]);

  const dispatch = useAppDispatch();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.files &&
      dispatch(authThunks.updateUserAvatar(e.currentTarget.files[0]));
  };

  return (
    <Wrapper>
      <UserPic src={image} alt={props.imageDescription} />
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
        <input hidden accept="image/*" type="file" onChange={handleUpload} />
      </IconButton>
    </Wrapper>
  );
};

type PropsType = {
  image?: string;
  imageDescription: string;
};
