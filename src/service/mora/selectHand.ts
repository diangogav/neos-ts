import { ygopro } from "@/api";
import { selectHandAble } from "@/reducers/moraSlice";
import { store } from "@/store";
import { moraStore } from "@/valtioStores";

export default function handleSelectHand(_: ygopro.YgoStocMsg) {
  // const dispatch = store.dispatch;

  // dispatch(selectHandAble());
  moraStore.selectHandAble = true;
}
