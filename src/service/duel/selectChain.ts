import { ygopro } from "@/api";
import { sendSelectChainResponse } from "@/api/ocgcore/ocgHelper";
import { fetchSelectHintMeta } from "@/reducers/duel/hintSlice";
import {
  setCheckCardMOdalCancelAble,
  setCheckCardModalCancelResponse,
  setCheckCardModalIsOpen,
  setCheckCardModalMinMax,
  setCheckCardModalOnSubmit,
} from "@/reducers/duel/mod";
import { fetchCheckCardMeta } from "@/reducers/duel/modal/mod";
import { AppDispatch } from "@/store";
import {
  fetchCheckCardMeta as FIXME_fetchCheckCardMeta,
  fetchSelectHintMeta as FIXME_fetchSelectHintMeta,
  messageStore,
} from "@/valtioStores";

import { CardZoneToChinese } from "./util";

type MsgSelectChain = ygopro.StocGameMessage.MsgSelectChain;
export default (selectChain: MsgSelectChain, dispatch: AppDispatch) => {
  const player = selectChain.player;
  const spCount = selectChain.special_count;
  const forced = selectChain.forced;
  const hint0 = selectChain.hint0;
  const hint1 = selectChain.hint1;
  const chains = selectChain.chains;

  let handle_flag = 0;
  if (!forced) {
    // 无强制发动的卡
    if (spCount == 0) {
      // 无关键卡
      if (chains.length == 0) {
        // 直接回答
        handle_flag = 0;
      } else {
        // 处理多张
        handle_flag = 2;
      }
    } else {
      // 有关键卡
      if (chains.length == 0) {
        // 根本没卡，直接回答
        handle_flag = 0;
      } else {
        // 处理多张
        handle_flag = 2;
      }
    }
  } else {
    // 有强制发动的卡
    if (chains.length == 1) {
      // 只有一个强制发动的连锁项，直接回应
      handle_flag = 4;
    } else {
      // 处理强制发动的卡
      handle_flag = 3;
    }
  }

  switch (handle_flag) {
    case 0: {
      // 直接回答
      sendSelectChainResponse(-1);

      break;
    }
    case 2: // 处理多张
    case 3: {
      // 处理强制发动的卡

      // dispatch(setCheckCardModalMinMax({ min: 1, max: 1 }));
      // dispatch(setCheckCardModalOnSubmit("sendSelectChainResponse"));
      // dispatch(setCheckCardMOdalCancelAble(!forced));
      // dispatch(setCheckCardModalCancelResponse(-1));

      messageStore.checkCardModal.selectMin = 1;
      messageStore.checkCardModal.selectMax = 1;
      messageStore.checkCardModal.onSubmit = "sendSelectChainResponse";
      messageStore.checkCardModal.cancelAble = !forced;
      messageStore.checkCardModal.cancelResponse = -1;

      for (const chain of chains) {
        // const tagName = CardZoneToChinese(chain.location.location);
        // dispatch(
        //   fetchCheckCardMeta({
        //     tagName,
        //     option: {
        //       code: chain.code,
        //       location: chain.location,
        //       response: chain.response,
        //       effectDescCode: chain.effect_description,
        //     },
        //   })
        // );
        FIXME_fetchCheckCardMeta(chain.location.location, {
          code: chain.code,
          location: chain.location,
          response: chain.response,
          effectDescCode: chain.effect_description,
        });
      }
      // dispatch(
      //   fetchSelectHintMeta({
      //     selectHintData: 203,
      //   })
      // );
      FIXME_fetchSelectHintMeta({
        selectHintData: 203,
      });

      // dispatch(setCheckCardModalIsOpen(true));
      messageStore.checkCardModal.isOpen = true;

      break;
    }
    case 4: {
      // 有一张强制发动的卡，直接回应
      sendSelectChainResponse(chains[0].response);

      break;
    }
    default: {
      console.log(`Unhandled flag: ${handle_flag}`);
    }
  }
};
