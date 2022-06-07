import { ArrowLeftIcon } from "@heroicons/react/outline";
import { FC, ReactNode, useMemo, useState } from "react";
import { Button, Modal, SearchInput, WalletIcon } from "../../components";

export type ConnectWalletProps = {
  chains: {
    id: string;
    name: string;
    wallets: string[];
    icon: ReactNode;
  }[];
  wallets: {
    id: string;
    name: string;
    icon: ReactNode;
  }[];
  isLoading?: boolean;
  onConnect?: (selection: { networkId: string; walletId: string }) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
};

export type ConnectWalletStep =
  | "choose-network"
  | "choose-wallet"
  | "await-confirmation";

export const ConnectWallet: FC<ConnectWalletProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkId, setNetworkId] = useState<string>();
  const [walletId, setWalletId] = useState<string>();

  const [step, setStep] = useState<ConnectWalletStep>("choose-network");
  const [previousStep, setPreviousStep] =
    useState<ConnectWalletStep>("choose-network");

  const navigate = (nextStep: ConnectWalletStep) => {
    setPreviousStep(step);
    setStep(nextStep);
    setSearch("");
  };

  const goBack = () => {
    switch (step) {
      case "choose-network":
        setIsOpen(false);
        setNetworkId("");
        setWalletId("");
        setSearch("");
        setStep("choose-network");
        props.onCancel?.();
        return;
      case "choose-wallet":
        navigate("choose-network");
        return;
      case "await-confirmation":
        navigate("choose-wallet");
    }
  };

  const [search, setSearch] = useState("");

  const selectedNetwork = useMemo(
    () => props.chains.find((x) => x.id === networkId),
    [networkId],
  );

  const selectedWallet = useMemo(
    () => props.wallets.find((x) => x.id === walletId),
    [walletId],
  );

  const [subHeading, content] = useMemo(() => {
    switch (step) {
      case "choose-network":
        return [
          <label className="flex justify-between items-center w-full">
            <span>Choose network</span>
            <SearchInput
              placeholder="Search network"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>,
          <>
            <ul className="grid gap-2">
              {props.chains
                .filter((x) => x.name.includes(search))
                .map((x) => (
                  <li
                    key={x.id}
                    className="flex items-center justify-between p-4 hover:opacity-80 rounded"
                    role="button"
                    onClick={() => {
                      setNetworkId(x.id);
                      navigate("choose-wallet");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <figure className="h-5 w-5">{x.icon}</figure>
                      {x.name}
                    </div>

                    <ArrowLeftIcon className="h-4 w-4 rotate-180 text-gray-400" />
                  </li>
                ))}
            </ul>
          </>,
        ];
      case "choose-wallet":
        return [
          <label className="flex justify-between items-center w-full">
            <span>Choose wallet</span>
            <SearchInput
              placeholder="Search wallet"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>,
          <>
            <ul className="grid gap-2">
              {props.wallets
                .filter(
                  (x) =>
                    selectedNetwork?.wallets.includes(x.id) &&
                    x.name.includes(search),
                )
                .map((x) => (
                  <li
                    key={x.id}
                    className="flex items-center justify-between p-4 hover:opacity-80 rounded"
                    role="button"
                    onClick={() => {
                      setWalletId(x.id);
                      navigate("await-confirmation");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <figure className="text-lg">{x.icon}</figure>
                      {x.name}
                    </div>

                    <ArrowLeftIcon className="h-4 w-4 rotate-180 text-gray-400" />
                  </li>
                ))}
            </ul>
          </>,
        ];
      case "await-confirmation":
        return [
          <></>,
          <>
            <div className="grid place-items-center gap-4">
              <p>
                Connect {selectedWallet?.name} to {selectedNetwork?.name} to
                proceed
              </p>
              <Button
                onClick={() => {
                  setNetworkId("");
                  setSearch("");
                  setWalletId("");
                  setStep("choose-network");
                }}
              >
                Cancel
              </Button>
            </div>
          </>,
        ];
      default:
        return [<></>];
    }
  }, [step]);

  return (
    <>
      <Button
        disabled={isOpen}
        onClick={setIsOpen.bind(null, true)}
        className="w-full max-w-xs"
      >
        <WalletIcon className="-translate-y-0.5" /> Connect wallets
      </Button>
      <Modal
        title="Connect Wallet"
        isOpen={isOpen}
        onClose={setIsOpen}
        onGoBack={goBack}
        subTitle={subHeading}
      >
        {content}
      </Modal>
    </>
  );
};
