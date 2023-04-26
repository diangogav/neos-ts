import { ygopro } from "@/api";
import {
  setCheckCardModalV3AllLevel,
  setCheckCardModalV3IsOpen,
  setCheckCardModalV3MinMax,
  setCheckCardModalV3OverFlow,
} from "@/reducers/duel/mod";
import { fetchCheckCardMetasV3 } from "@/reducers/duel/modal/checkCardModalV3Slice";
import { AppDispatch } from "@/store";
import {
  fetchCheckCardMetasV3 as FIXME_fetchCheckCardMetasV3,
  messageStore,
} from "@/valtioStores";
type MsgSelectSum = ygopro.StocGameMessage.MsgSelectSum;

export default (selectSum: MsgSelectSum, dispatch: AppDispatch) => {
  // dispatch(setCheckCardModalV3OverFlow(selectSum.overflow != 0));
  messageStore.checkCardModalV3.overflow = selectSum.overflow != 0;
  // dispatch(setCheckCardModalV3AllLevel(selectSum.level_sum));
  messageStore.checkCardModalV3.allLevel = selectSum.level_sum;
  // dispatch(
  //   setCheckCardModalV3MinMax({ min: selectSum.min, max: selectSum.max })
  // );
  messageStore.checkCardModalV3.selectMin = selectSum.min;
  messageStore.checkCardModalV3.selectMax = selectSum.max;
  // dispatch(
  //   fetchCheckCardMetasV3({
  //     mustSelect: true,
  //     options: selectSum.must_select_cards,
  //   })
  // );
  FIXME_fetchCheckCardMetasV3({
    mustSelect: true,
    options: selectSum.must_select_cards,
  });
  // dispatch(
  //   fetchCheckCardMetasV3({
  //     mustSelect: false,
  //     options: selectSum.selectable_cards,
  //   })
  // );
  FIXME_fetchCheckCardMetasV3({
    mustSelect: false,
    options: selectSum.selectable_cards,
  });
  // dispatch(setCheckCardModalV3IsOpen(true));

  messageStore.checkCardModalV3.isOpen = true;
};
