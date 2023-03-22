import { ygopro } from "../../api/ocgcore/idl/ocgcore";
import { setYesNoModalIsOpen } from "../../reducers/duel/mod";
import { fetchYesNoMetaWithEffecDesc } from "../../reducers/duel/modal/yesNoModalSlice";
import { AppDispatch } from "../../store";
import MsgSelectYesNo = ygopro.StocGameMessage.MsgSelectYesNo;

export default (selectYesNo: MsgSelectYesNo, dispatch: AppDispatch) => {
  const player = selectYesNo.player;
  const effect_description = selectYesNo.effect_description;

  dispatch(fetchYesNoMetaWithEffecDesc(effect_description));
  dispatch(setYesNoModalIsOpen(true));
};
