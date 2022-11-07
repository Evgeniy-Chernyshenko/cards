import styled from "@emotion/styled";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { BaseModal } from "../../components/BaseModal";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UploadImage } from "../../components/UploadImage";

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 36px;
`;

const schema = yup.object({
  name: yup.string().trim().required("Name pack is required"),
});

export const AddPackModal = (props: PropsType) => {
  const [open, setOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPackInputsType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [deckCover, setDeckCover] = useState<string>();

  const onSubmit: SubmitHandler<AddPackInputsType> = (values) => {
    setOpen(false);
    props.onSave({ ...values, ...(deckCover && { deckCover }) });
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Add pack"
      actionButtonText="Save"
      setOpen={setOpen}
      onClose={handleClose}
      onAction={handleSubmit(onSubmit)}
      wrapForm
    >
      <FieldsContainer>
        <UploadImage
          labelText="Cover"
          uploadLinkText="Change cover"
          onUpload={setDeckCover}
        />
        <TextField
          label={errors.name ? errors.name.message : "Name pack"}
          variant="standard"
          {...register("name")}
          error={!!errors.name}
          autoFocus
        />
        <div>
          <FormControlLabel
            control={<Checkbox />}
            label="Private pack"
            {...register("private")}
          />
        </div>
      </FieldsContainer>
    </BaseModal>
  );
};

type PropsType = {
  onClose: () => void;
  onSave: (values: AddPackInputsType) => void;
};

export type AddPackInputsType = {
  name: string;
  private: boolean;
  deckCover?: string;
};
