import { FC, useState } from "react";
import { Button, Modal } from "~/components";

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
      <Modal title="Connect Wallet" isOpen={isOpen} onClose={setIsOpen}>
        asd
      </Modal>
    </>
  );
};

const ChooseNetwork = () => {};
