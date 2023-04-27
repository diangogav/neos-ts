import { ygopro } from "@/api";
import MsgPosChange = ygopro.StocGameMessage.MsgPosChange;
import { fetchEsHintMeta, matStore } from "@/stores";
export default (posChange: MsgPosChange) => {
  const { location, controler, sequence } = posChange.card_info;

  switch (location) {
    case ygopro.CardZone.MZONE: {
      matStore.monsters.of(controler)[sequence].location.position =
        posChange.cur_position;

      break;
    }
    case ygopro.CardZone.SZONE: {
      matStore.magics.of(controler)[sequence].location.position =
        posChange.cur_position;

      break;
    }
    default: {
      console.log(`Unhandled zone ${location}`);
    }
  }
  fetchEsHintMeta({
    originMsg: 1600,
  });
};
