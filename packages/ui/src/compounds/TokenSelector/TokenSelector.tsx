import { FC, ReactNode, useState } from "react";
import tw from "tailwind-styled-components";

import { Modal, SearchInput, Select } from "../../components";

const NO_OP = () => {
  //
};

const ListContainer = tw.ul`
  grid gap-2 max-h-64 overflow-y-scroll -mx-3
`;

const ListItem = tw.li`
  flex items-center justify-between p-4 hover:opacity-60 rounded
`;

export type TokenSelectorProps = {
  label: string;
  modalTitle: string;
};

export const TokenSelector: FC<TokenSelectorProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  return (
    <>
      <Select
        label={props.label}
        options={[]}
        onChange={NO_OP}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        title={props.modalTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div>
          <SearchInput />
        </div>

        <ListContainer></ListContainer>
      </Modal>
    </>
  );
};

export type TokenItemProps = {
  symbol: string;
  name: string;
  icon: ReactNode;
  balance?: string;
};

export const TokenItem: FC<TokenItemProps> = (props) => {
  return (
    <div className="flex items-center py-1 px-8" role="button">
      <div>{props.icon}</div>
      <div className="grid">
        <span className="text-white text-base">{props.symbol}</span>
        <span className="text-gray-300 text-sm">{props.name}</span>
      </div>
      <div>
        {Boolean(props.balance) && (
          <span className="text-white font-semibold">{props.balance}</span>
        )}
      </div>
    </div>
  );
};
