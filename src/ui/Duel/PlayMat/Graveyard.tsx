import * as BABYLON from "@babylonjs/core";

import { useConfig } from "@/config";
import { useAppSelector } from "@/hook";
import {
  selectMeCemetery,
  selectOpCemetery,
} from "@/reducers/duel/cemeretySlice";

import { cardSlotRotation } from "../utils";
import { Depth, SingleSlot } from "./SingleSlot";

const NeosConfig = useConfig();
export const Graveyard = () => {
  const meCemetery = useAppSelector(selectMeCemetery).inner;
  const opCemetery = useAppSelector(selectOpCemetery).inner;

  return (
    <>
      <SingleSlot
        state={meCemetery}
        position={cemeteryPosition(0, meCemetery.length)}
        rotation={cardSlotRotation(false)}
      />
      <SingleSlot
        state={opCemetery}
        position={cemeteryPosition(1, opCemetery.length)}
        rotation={cardSlotRotation(true)}
      />
    </>
  );
};

const cemeteryPosition = (player: number, cemeteryLength: number) => {
  const x = player == 0 ? 3.2 : -3.2;
  const y = (Depth * cemeteryLength) / 2 + NeosConfig.ui.card.floating;
  const z = player == 0 ? -2.0 : 2.0;

  return new BABYLON.Vector3(x, y, z);
};
