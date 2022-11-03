import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { ReactNode } from "react";

const ContentContainer = styled.div`
  margin-bottom: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const BaseModal = (props: PropsType) => {
  const handleClose = () => {
    props.onClose();
  };

  const Content = (
    <>
      <ContentContainer>{props.children}</ContentContainer>
      <ButtonsContainer>
        <Button variant="outlined" onClick={() => props.setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={props.actionButtonColor}
          onClick={props.onAction}
          type={props.wrapForm ? "submit" : "button"}
        >
          {props.actionButtonText}
        </Button>
      </ButtonsContainer>
    </>
  );

  return (
    <Dialog
      onClose={() => props.setOpen(false)}
      open={props.open}
      closeAfterTransition={true}
      TransitionProps={{
        onExited: () => {
          handleClose();
        },
      }}
      onKeyUp={(e) => {
        if (!props.wrapForm && e.code === "Enter") {
          props.onAction();
        }
      }}
    >
      <DialogTitle>
        <TitleContainer>
          <span>{props.title}</span>
          <IconButton onClick={() => props.setOpen(false)}>
            <Close />
          </IconButton>
        </TitleContainer>
      </DialogTitle>
      <DialogContent dividers>
        {props.wrapForm ? (
          <form onSubmit={props.onAction}>{Content}</form>
        ) : (
          Content
        )}
      </DialogContent>
    </Dialog>
  );
};

type PropsType = {
  open: boolean;
  title: string;
  children: ReactNode;
  actionButtonText: string;
  actionButtonColor?: "error";
  wrapForm?: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onAction: () => void;
};
