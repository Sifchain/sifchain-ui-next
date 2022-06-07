import { FC, useCallback, useState } from "react";
import {
  Button,
  Modal,
  ModalProps,
  SearchInput,
  WalletIcon,
} from "../../components";

export type ConnectWalletProps = {};

type Step = "choose-network" | "choose-wallet";

export const ConnectWallet: FC<ConnectWalletProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState();
  const [step, setStep] = useState<Step>("choose-network");

  const Content = useCallback<FC<ModalProps>>(
    (props) => {
      switch (step) {
        case "choose-network":
          return <ChooseNetwork {...props} />;
        case "choose-wallet":
          return <ChooseWallet {...props} />;
        default:
          return null;
      }
    },
    [step, isOpen, setIsOpen],
  );

  return (
    <>
      <Button
        disabled={isOpen}
        onClick={setIsOpen.bind(null, true)}
        className="w-full"
      >
        <WalletIcon className="-translate-y-0.5" /> Connect wallets
      </Button>
      <Content isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
};

const ChooseNetwork: FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      title="Connect Wallet"
      isOpen={isOpen}
      onClose={onClose}
      onGoBack={() => onClose(false)}
      subTitle={
        <header className="flex justify-between items-center w-full">
          <span>Choose network</span>
          <SearchInput placeholder="Search network" />
        </header>
      }
    >
      ...
    </Modal>
  );
};

const ChooseWallet: FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      title="Connect Wallet"
      isOpen={isOpen}
      onClose={onClose}
      onGoBack={() => {}}
      subTitle={
        <header className="flex justify-between items-center w-full">
          <span>Choose network</span>
          <SearchInput placeholder="Search network" />
        </header>
      }
    >
      ...
    </Modal>
  );
};
