import styled from "@emotion/styled";
import { useState } from "react";
import { BaseModal } from "../../components/BaseModal";

const Name = styled.span`
  font-weight: var(--fw3);
`;

export const DeletePackModal = (props: PropsType) => {
  const [open, setOpen] = useState(true);

  const handleAction = () => {
    setOpen(false);
    props.onDelete();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Delete pack"
      actionButtonText="Delete"
      actionButtonColor="error"
      setOpen={setOpen}
      onClose={handleClose}
      onAction={handleAction}
    >
      Do you really want to remove <Name>{props.name}</Name>?
      <br />
      All cards will be deleted.
    </BaseModal>
  );
};

type PropsType = {
  name: string;
  onClose: () => void;
  onDelete: () => void;
};
