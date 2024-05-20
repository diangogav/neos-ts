import { fetchCard, ygopro } from "@/api";
import { AudioActionType, playEffect } from "@/infra/audio";
import { cardStore, fetchEsHintMeta } from "@/stores";
import { callCardMove } from "@/ui/Duel/PlayMat/Card";

export default async (draw: ygopro.StocGameMessage.MsgDraw) => {
  fetchEsHintMeta({ originMsg: "玩家抽卡时" });

  const drawLength = draw.cards.length;

  // 将卡从卡组移到手牌：设置zone、occupant、sequence
  const handsLength = cardStore.at(ygopro.CardZone.HAND, draw.player).length;
  const newHands = cardStore
    .at(ygopro.CardZone.DECK, draw.player)
    .sort((a, b) => a.location.sequence - b.location.sequence)
    .slice(-drawLength);

  for (const idx in newHands) {
    const card = newHands[Number(idx)];
    const code = draw.cards[idx];
    const meta = fetchCard(code);
    card.code = code;
    card.meta = meta;
    card.location.zone = ygopro.CardZone.HAND;
    card.location.sequence = Number(idx) + handsLength;
  }

  playEffect(AudioActionType.SOUND_DRAW);

  // 抽卡动画
  await Promise.all(
    cardStore
      .at(ygopro.CardZone.HAND, draw.player)
      .map((card) => callCardMove(card.uuid)),
  );
};
