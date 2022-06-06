import { FC, useState } from "react";
import { Button, Modal, ModalProps, SearchInput } from "../../components";

export type ConnectWalletProps = {};

type Step = "choose-network" | "choose-wallet";

export const ConnectWallet: FC<ConnectWalletProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState();
  const [step, setStep] = useState<Step>("choose-network");

  return (
    <>
      <Button disabled={isOpen} onClick={setIsOpen.bind(null, true)}>
        Connect Wallets
      </Button>
      <ChooseNetwork isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
};

const ChooseNetwork: FC<ModalProps> = ({ isOpen, onClose }) => {
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
