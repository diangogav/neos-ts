import { ygopro } from "@/api";
import { cardStore, type CardType, isMe } from "@/stores";

import { matConfig } from "../../utils";
import { SpringApi } from "./types";

const {
  BLOCK_HEIGHT_M,
  BLOCK_HEIGHT_S,
  CARD_RATIO,
  ROW_GAP,
  HAND_MARGIN_TOP,
  HAND_CARD_HEIGHT,
  HAND_CIRCLE_CENTER_OFFSET_Y,
} = matConfig;

const { HAND } = ygopro.CardZone;

export const moveToHand = async (props: { card: CardType; api: SpringApi }) => {
  const { card, api } = props;
  const { sequence, controller } = card.location;
  // 手卡会有很复杂的计算...
  const hand_circle_center_x = 0;
  const hand_circle_center_y =
    1 * BLOCK_HEIGHT_M.value +
    1 * BLOCK_HEIGHT_S.value +
    2 * ROW_GAP.value +
    (HAND_MARGIN_TOP.value +
      HAND_CARD_HEIGHT.value +
      HAND_CIRCLE_CENTER_OFFSET_Y.value);
  const hand_card_width = CARD_RATIO.value * HAND_CARD_HEIGHT.value;
  const THETA =
    2 *
    Math.atan(
      hand_card_width /
        2 /
        (HAND_CIRCLE_CENTER_OFFSET_Y.value + HAND_CARD_HEIGHT.value)
    ) *
    0.9;
  // 接下来计算每一张手卡
  const hands_length = cardStore.at(HAND, controller).length;
  const angle = (sequence - (hands_length - 1) / 2) * THETA;
  const r = HAND_CIRCLE_CENTER_OFFSET_Y.value + HAND_CARD_HEIGHT.value / 2;
  const negativeX = Math.sin(angle) * r;
  const negativeY = Math.cos(angle) * r + HAND_CARD_HEIGHT.value / 2;
  const x = hand_circle_center_x + negativeX * (isMe(controller) ? 1 : -1);
  const y = hand_circle_center_y - negativeY + 130; // 常量 是手动调的 这里肯定有问题 有空来修

  const _rz = (angle * 180) / Math.PI;

  api.start({
    x: isMe(controller) ? x : -x,
    y: isMe(controller) ? y : -y,
    z: 0,
    rz: isMe(controller) ? _rz : 180 - _rz,
    ry: isMe(controller) ? 0 : 180,
    height: HAND_CARD_HEIGHT.value,
    zIndex: sequence,
    // rx: -PLANE_ROTATE_X.value,
  });
};