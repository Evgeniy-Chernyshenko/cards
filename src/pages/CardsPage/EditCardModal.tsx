import styled from "@emotion/styled";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { BaseModal } from "../../components/BaseModal";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 36px;
`;

const schema = yup.object({
  question: yup.string().trim().required("Question is required"),
  answer: yup.string().trim().required("Answer is required"),
});

export const EditCardModal = (props: PropsType) => {
  const [open, setOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCardInputsType>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: props.values,
  });

  const onSubmit: SubmitHandler<EditCardInputsType> = (values) => {
    setOpen(false);
    props.onSave(values);
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Edit card"
      actionButtonText="Save"
      setOpen={setOpen}
      onClose={handleClose}
      onAction={handleSubmit(onSubmit)}
      wrapForm
    >
      <FieldsContainer>
        <FormControl variant="standard">
          <InputLabel>Choose a question format</InputLabel>
          <Select value="text" label="Choose a question format">
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="image">Image</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={errors.question ? errors.question.message : "Question"}
          variant="standard"
          {...register("question")}
          error={!!errors.question}
          autoFocus
        />
        <TextField
          label={errors.answer ? errors.answer.message : "Answer"}
          variant="standard"
          {...register("answer")}
          error={!!errors.answer}
        />
      </FieldsContainer>
    </BaseModal>
  );
};

type PropsType = {
  values: EditCardInputsType;
  onClose: () => void;
  onSave: (values: EditCardInputsType) => void;
};

export type EditCardInputsType = {
  question: string;
  answer: string;
};
