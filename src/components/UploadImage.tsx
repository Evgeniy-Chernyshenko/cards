import styled from "@emotion/styled";
import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { appActions } from "../store/app-reducer";
import { getBase64FromFile } from "../utils/getBase64FromFile";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UploadContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span`
  font-weight: var(--fw2);
  font-size: 16px;
`;

const UploadLink = styled.label`
  font-weight: var(--fw2);
  color: var(--link-color1);
  text-decoration: underline;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

export const UploadImage = (props: PropsType) => {
  const dispatch = useAppDispatch();
  const [initImage] = useState(props.image);
  const [image, setImage] = useState<null | string>(props.image || null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!files) {
      return;
    }

    try {
      const fileBase64 = await getBase64FromFile(files[0], 1048576);

      setImage(fileBase64);

      props.onUpload(fileBase64);
    } catch (e) {
      const error = e as Error;

      dispatch(appActions.setSnackbarMessage(error.message, "error"));
    }
  };

  const handleImageError = () => {
    setImage(initImage || null);
    props.onUpload(initImage);
  };

  return (
    <Wrapper>
      <UploadContainer>
        <Label>{props.labelText}</Label>
        <UploadLink>
          {props.uploadLinkText}
          <FileInput type="file" accept="image/*" onChange={handleUpload} />
        </UploadLink>
      </UploadContainer>
      {image && <Image src={image} alt="Cover" onError={handleImageError} />}
    </Wrapper>
  );
};

type PropsType = {
  labelText: string;
  uploadLinkText: string;
  image?: string;
  onUpload: (fileBase64?: string) => void;
};
