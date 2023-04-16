import { CheckCard } from "@ant-design/pro-components";
import { Button } from "antd";
import React, { useState } from "react";

import { sendSelectOptionResponse } from "@/api/ocgcore/ocgHelper";
import { useAppSelector } from "@/hook";
import { resetOptionModal, setOptionModalIsOpen } from "@/reducers/duel/mod";
import {
  selectOptionModalIsOpen,
  selectOptionModalOptions,
} from "@/reducers/duel/modal/mod";
import { store } from "@/store";

import { DragModal } from "./DragModal";

export const OptionModal = () => {
  const dispatch = store.dispatch;
  const isOpen = useAppSelector(selectOptionModalIsOpen);
  const options = useAppSelector(selectOptionModalOptions);
  const [selected, setSelected] = useState<number | undefined>(undefined);

  return (
    <DragModal
      title="请选择需要发动的效果"
      open={isOpen}
      closable={false}
      footer={
        <Button
          disabled={selected === undefined}
          onClick={() => {
            if (selected !== undefined) {
              sendSelectOptionResponse(selected);
              dispatch(setOptionModalIsOpen(false));
              dispatch(resetOptionModal());
            }
          }}
        >
          submit
        </Button>
      }
    >
      <CheckCard.Group
        bordered
        size="small"
        onChange={(value) => {
          // @ts-ignore
          setSelected(value);
        }}
      >
        {options.map((option, idx) => (
          <CheckCard key={idx} title={option.msg} value={option.response} />
        ))}
      </CheckCard.Group>
    </DragModal>
  );
};