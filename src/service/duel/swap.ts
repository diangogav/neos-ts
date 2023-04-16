import { ygopro } from "@/api/ocgcore/idl/ocgcore";
import { fetchEsHintMeta } from "@/reducers/duel/hintSlice";
import { AppDispatch } from "@/store";

export default (
  _swap: ygopro.StocGameMessage.MsgSwap,
  dispatch: AppDispatch
) => {
  dispatch(fetchEsHintMeta({ originMsg: 1602 }));
};