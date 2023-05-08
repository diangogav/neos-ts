import "@/styles/mat.css";

import React from "react";
import { useSnapshot } from "valtio";

import { ygopro } from "@/api";
import { CardState, DuelFieldState, matStore, messageStore } from "@/stores";

import { interactTypeToString } from "../utils";
import { BlockRow, ExtraBlockRow } from "./Block";
import { Card } from "./Card";
import { Menu } from "./Menu";
import YgoZone = ygopro.CardZone;
import YgoPosition = ygopro.CardPosition;

type RenderCard = CardState & {
  sequence: number;
  opponent?: boolean;
};

const HIGH_SCALE = 0.1;
const DEFAULT_HIGH = 1;

export const Mat = () => {
  const snap = useSnapshot(matStore);
  const monsters = snap.monsters;
  const magics = snap.magics;
  const hands = snap.hands;
  const grave = snap.graveyards;
  const banished = snap.banishedZones;
  const deck = snap.decks;
  const extraDeck = snap.extraDecks;

  const mapper =
    (opponent?: boolean) => (state: CardState, sequence: number) => {
      return {
        sequence,
        opponent,
        ...state,
      };
    };
  const filter = (state: CardState) => state.occupant !== undefined;

  const renderCards: RenderCard[] = monsters.me
    .map(mapper())
    .filter(filter)
    .concat(monsters.op.map(mapper(true)).filter(filter))
    .concat(magics.me.map(mapper()).filter(filter))
    .concat(magics.op.map(mapper(true)).filter(filter))
    .concat(hands.me.map(mapper()).filter(filter))
    .concat(hands.op.map(mapper(true)).filter(filter))
    .concat(grave.me.map(mapper()).filter(filter))
    .concat(grave.op.map(mapper(true)).filter(filter))
    .concat(banished.me.map(mapper()).filter(filter))
    .concat(banished.op.map(mapper(true)).filter(filter))
    .concat(deck.me.map(mapper()).filter(filter))
    .concat(deck.op.map(mapper(true)).filter(filter))
    .concat(extraDeck.me.map(mapper()).filter(filter))
    .concat(extraDeck.op.map(mapper(true)).filter(filter));

  renderCards.sort((card_a, card_b) => (card_a.uuid > card_b.uuid ? 1 : 0));

  return (
    <>
      <Menu />
      <div id="life-bar-container">
        <div id="life-bar">{snap.initInfo.me.life}</div>
        <div id="life-bar">{snap.initInfo.op.life}</div>
      </div>
      <div id="camera">
        <div id="board">
          <div id="board-bg">
            <BlockRow states={magics.op.slice(0, 5) as DuelFieldState} />
            <BlockRow
              states={monsters.op.slice(0, 5) as DuelFieldState}
              rightState={magics.op[5] as CardState}
            />
            <ExtraBlockRow
              meLeft={monsters.me[5] as CardState}
              meRight={monsters.me[6] as CardState}
              opLeft={monsters.op[5] as CardState}
              opRight={monsters.op[6] as CardState}
            />
            <BlockRow
              states={monsters.me.slice(0, 5) as DuelFieldState}
              leftState={magics.me[5] as CardState}
            />
            <BlockRow states={magics.me.slice(0, 5) as DuelFieldState} />
          </div>
          {renderCards.map((card) => (
            <Card
              key={card.uuid}
              code={card.occupant!.id}
              row={cardStateToRow(card)}
              col={cardStateToCol(card)}
              hight={CardStateToHigh(card)}
              defense={
                card.location.position === YgoPosition.DEFENSE ||
                card.location.position === YgoPosition.FACEDOWN_DEFENSE ||
                card.location.position === YgoPosition.FACEUP_DEFENSE
              }
              facedown={CardStateToFaceDown(card)}
              vertical={card.location.zone == YgoZone.HAND}
              highlight={card.idleInteractivities.length > 0}
              opponent={card.opponent}
              onClick={
                card.location.zone == YgoZone.SZONE ||
                card.location.zone == YgoZone.MZONE ||
                card.location.zone == YgoZone.HAND
                  ? onCardClick(card)
                  : card.location.zone == YgoZone.DECK
                  ? () => {}
                  : onFieldClick(renderCards, card)
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

function cardStateToRow(state: RenderCard): number {
  if (state.opponent) {
    switch (state.location.zone) {
      case YgoZone.EXTRA:
      case YgoZone.DECK:
        return 0;
      case YgoZone.HAND:
        return -1;
      case YgoZone.SZONE:
        return state.sequence >= 5 ? 1 : 0;
      case YgoZone.GRAVE:
        return 1;
      case YgoZone.MZONE:
        return state.sequence >= 5 ? 2 : 1;
      case YgoZone.REMOVED:
        return 2;
      default:
        return 0;
    }
  } else {
    switch (state.location.zone) {
      case YgoZone.EXTRA:
      case YgoZone.DECK:
        return 4;
      case YgoZone.HAND:
        return 5;
      case YgoZone.SZONE:
        return state.sequence >= 5 ? 3 : 4;
      case YgoZone.GRAVE:
        return 3;
      case YgoZone.MZONE:
        return state.sequence >= 5 ? 2 : 3;
      case YgoZone.REMOVED:
        return 2;
      default:
        return 0;
    }
  }
}

function cardStateToCol(state: RenderCard): number {
  if (state.opponent) {
    switch (state.location.zone) {
      case YgoZone.EXTRA:
        return 5;
      case YgoZone.HAND:
        return 4 - state.sequence;
      case YgoZone.SZONE:
        return state.sequence >= 5 ? 5 : 4 - state.sequence;
      case YgoZone.DECK:
      case YgoZone.REMOVED:
      case YgoZone.GRAVE:
        return -1;
      case YgoZone.MZONE:
        return state.sequence >= 5
          ? state.sequence == 5
            ? 3
            : 1
          : 4 - state.sequence;
      default:
        return 0;
    }
  } else {
    switch (state.location.zone) {
      case YgoZone.EXTRA:
        return -1;
      case YgoZone.HAND:
        return state.sequence;
      case YgoZone.SZONE:
        return state.sequence >= 5 ? -1 : state.sequence;
      case YgoZone.DECK:
      case YgoZone.REMOVED:
      case YgoZone.GRAVE:
        return 5;
      case YgoZone.MZONE:
        return state.sequence >= 5
          ? state.sequence == 5
            ? 1
            : 3
          : state.sequence;
      default:
        return 0;
    }
  }
}

function CardStateToHigh(state: RenderCard): number {
  switch (state.location.zone) {
    case YgoZone.EXTRA:
    case YgoZone.DECK:
    case YgoZone.REMOVED:
    case YgoZone.GRAVE:
      return state.sequence * HIGH_SCALE;
    case YgoZone.SZONE:
    case YgoZone.MZONE:
    case YgoZone.HAND:
      return DEFAULT_HIGH;
    default:
      return 0;
  }
}

function CardStateToFaceDown(state: RenderCard): boolean {
  const position = state.location.position;

  return (
    ((position === YgoPosition.FACEDOWN ||
      position === YgoPosition.FACEDOWN_ATTACK ||
      position === YgoPosition.FACEDOWN_DEFENSE) &&
      state.location.zone != YgoZone.HAND) ||
    state.occupant!.id == 0
  );
}

const onCardClick = (state: CardState) => () => {
  const occupant = state.occupant;
  if (occupant) {
    // 中央弹窗展示选中卡牌信息
    messageStore.cardModal.meta = occupant;
    messageStore.cardModal.interactivies = state.idleInteractivities.map(
      (interactivity) => ({
        desc: interactTypeToString(interactivity.interactType),
        response: interactivity.response,
      })
    );
    messageStore.cardModal.counters = state.counters;
    messageStore.cardModal.isOpen = true;

    // 侧边栏展示超量素材信息
    if (state.overlay_materials && state.overlay_materials.length > 0) {
      messageStore.cardListModal.list =
        state.overlay_materials?.map((overlay) => ({
          meta: overlay,
          interactivies: [],
        })) || [];
      messageStore.cardListModal.isOpen = true;
    }
  }
};

const onFieldClick = (states: Array<CardState>, clicked: CardState) => () => {
  const displayStates = states.filter(
    (state) =>
      state.location.zone == clicked.location.zone &&
      state.location.controler === clicked.location.controler
  );

  messageStore.cardListModal.list = displayStates.map((item) => ({
    meta: item.occupant,
    interactivies: item.idleInteractivities.map((interactivy) => ({
      desc: interactTypeToString(interactivy.interactType),
      response: interactivy.response,
    })),
  }));

  messageStore.cardListModal.isOpen = true;
};