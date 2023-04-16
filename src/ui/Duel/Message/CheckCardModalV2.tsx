import { CheckCard } from "@ant-design/pro-components";
import { Button, Card, Col, Row } from "antd";
import React from "react";

import { sendSelectUnselectCardResponse } from "@/api/ocgcore/ocgHelper";
import { useConfig } from "@/config";
import { useAppSelector } from "@/hook";
import { selectHint } from "@/reducers/duel/hintSlice";
import {
  resetCheckCardModalV2,
  setCheckCardModalV2IsOpen,
  setCheckCardModalV2ResponseAble,
} from "@/reducers/duel/mod";
import {
  selectCheckCardModalV2CancelAble,
  selectCheckCardModalV2FinishAble,
  selectCheckCardModalV2IsOpen,
  selectCheckCardModalV2MinMax,
  selectCheckCardModalV2ResponseAble,
  selectCheckCardModalV2SelectAbleOptions,
  selectCheckCardModalV2SelectedOptions,
} from "@/reducers/duel/modal/checkCardModalV2Slice";
import { store } from "@/store";

import { DragModal } from "./DragModal";

const NeosConfig = useConfig();
export const CheckCardModalV2 = () => {
  const dispatch = store.dispatch;
  const isOpen = useAppSelector(selectCheckCardModalV2IsOpen);
  const { min, max } = useAppSelector(selectCheckCardModalV2MinMax);
  const cancelable = useAppSelector(selectCheckCardModalV2CancelAble);
  const finishable = useAppSelector(selectCheckCardModalV2FinishAble);
  const selectableOptions = useAppSelector(
    selectCheckCardModalV2SelectAbleOptions
  );
  const selectedOptions = useAppSelector(selectCheckCardModalV2SelectedOptions);
  const responseable = useAppSelector(selectCheckCardModalV2ResponseAble);
  const hint = useAppSelector(selectHint);
  const preHintMsg = hint?.esHint || "";
  const selectHintMsg = hint?.esSelectHint || "请选择卡片";

  const onFinishOrCancel = () => {
    sendSelectUnselectCardResponse({ cancel_or_finish: true });
    dispatch(setCheckCardModalV2IsOpen(false));
    dispatch(resetCheckCardModalV2());
    dispatch(setCheckCardModalV2ResponseAble(false));
  };

  return (
    <DragModal
      title={`${preHintMsg} ${selectHintMsg} ${min}-${max}`}
      open={isOpen}
      closable={false}
      footer={
        <>
          <Button
            disabled={!finishable || !responseable}
            onClick={onFinishOrCancel}
          >
            finish
          </Button>
          <Button
            disabled={!cancelable || !responseable}
            onClick={onFinishOrCancel}
          >
            cancel
          </Button>
        </>
      }
      width={800}
    >
      <CheckCard.Group
        bordered
        size="small"
        onChange={(value) => {
          if (responseable) {
            dispatch(setCheckCardModalV2IsOpen(false));
            // @ts-ignore
            sendSelectUnselectCardResponse({ selected_ptr: value });
            dispatch(setCheckCardModalV2ResponseAble(false));
          }
        }}
      >
        <Row>
          {selectableOptions.map((option, idx) => {
            return (
              <Col span={4} key={idx}>
                <CheckCard
                  title={option.name}
                  description={option.desc}
                  style={{ width: 120 }}
                  cover={
                    <img
                      alt={option.code.toString()}
                      src={`${NeosConfig.cardImgUrl}/${option.code}.jpg`}
                      style={{ width: 100 }}
                    />
                  }
                  value={option.response}
                />
              </Col>
            );
          })}
        </Row>
      </CheckCard.Group>
      <p>已经选择的卡片</p>
      <Row>
        {selectedOptions.map((option, idx) => {
          return (
            <Col span={4} key={idx}>
              <Card
                hoverable
                style={{ width: 120 }}
                cover={
                  <img
                    alt={option.code.toString()}
                    src={`${NeosConfig.cardImgUrl}/${option.code}.jpg`}
                  />
                }
              />
            </Col>
          );
        })}
      </Row>
    </DragModal>
  );
};