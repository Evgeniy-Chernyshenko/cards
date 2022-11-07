import styled from "@emotion/styled";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { BaseModal } from "../../components/BaseModal";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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

export const EditPackModal = (props: PropsType) => {
  const [open, setOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EditPackInputsType>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: props.values,
  });
  const [deckCover, setDeckCover] = useState(props.values.deckCover);

  const onSubmit: SubmitHandler<EditPackInputsType> = (values) => {
    setOpen(false);
    props.onSave({ ...values, deckCover });
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Edit pack"
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
          image={deckCover}
        />
        <TextField
          label={errors.name ? errors.name.message : "Name pack"}
          variant="standard"
          {...register("name")}
          error={!!errors.name}
          autoFocus
        />
        <div>
          <Controller
            name="private"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox />}
                label="Private pack"
                {...field}
                checked={field.value}
              />
            )}
          />
        </div>
      </FieldsContainer>
    </BaseModal>
  );
};

type PropsType = {
  values: EditPackInputsType;
  onClose: () => void;
  onSave: (values: EditPackInputsType) => void;
};

export type EditPackInputsType = {
  name: string;
  private: boolean;
  deckCover?: string;
};
