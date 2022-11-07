import styled from "@emotion/styled";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { BaseModal } from "../../components/BaseModal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UploadImage } from "../../components/UploadImage";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { appActions } from "../../store/app-reducer";

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

export const AddCardModal = (props: PropsType) => {
  const [open, setOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCardInputsType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [questionFormat, setQuestionFormat] =
    useState<QuestionFormatType>("text");
  const [questionImg, setQuestionImg] = useState<string>();
  const [answerImg, setAnswerImg] = useState<string>();
  const dispatch = useAppDispatch();

  const handleClose = () => {
    props.onClose();
  };

  const handleChangeQuestionFormat = (e: SelectChangeEvent) => {
    setQuestionFormat(e.target.value as QuestionFormatType);
  };

  const handleActionTextFormat = handleSubmit((values) => {
    setOpen(false);
    props.onSave(values);
  });

  const handleActionImageFormat = () => {
    if (answerImg && questionImg) {
      setOpen(false);
      props.onSave({ answerImg, questionImg });
    } else {
      dispatch(
        appActions.setSnackbarMessage(
          "Please, select question and answer images",
          "error"
        )
      );
    }
  };

  return (
    <BaseModal
      open={open}
      title="Add new card"
      actionButtonText="Save"
      setOpen={setOpen}
      onClose={handleClose}
      onAction={
        questionFormat === "text"
          ? handleActionTextFormat
          : handleActionImageFormat
      }
      wrapForm={questionFormat === "text"}
    >
      <FieldsContainer>
        <FormControl variant="standard">
          <InputLabel>Choose a question format</InputLabel>
          <Select
            value={questionFormat}
            label="Choose a question format"
            onChange={handleChangeQuestionFormat}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="image">Image</MenuItem>
          </Select>
        </FormControl>
        {questionFormat === "text" && (
          <>
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
          </>
        )}
        {questionFormat === "image" && (
          <>
            <UploadImage
              labelText="Question:"
              uploadLinkText="Change cover"
              onUpload={setQuestionImg}
            />
            <UploadImage
              labelText="Answer:"
              uploadLinkText="Change cover"
              onUpload={setAnswerImg}
            />
          </>
        )}
      </FieldsContainer>
    </BaseModal>
  );
};

type PropsType = {
  onClose: () => void;
  onSave: (values: AddCardInputsType) => void;
};

export type AddCardInputsType = {
  question?: string;
  answer?: string;
  questionImg?: string;
  answerImg?: string;
};

type QuestionFormatType = "text" | "image";
