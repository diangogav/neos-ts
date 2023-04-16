import * as BABYLON from "@babylonjs/core";
import { useRef } from "react";

import { useConfig } from "@/config";
import { useClick } from "@/hook";
import { CardState } from "@/reducers/duel/generic";
import {
  setCardListModalInfo,
  setCardListModalIsOpen,
} from "@/reducers/duel/mod";
import { store } from "@/store";

import { interactTypeToString } from "../utils";

const NeosConfig = useConfig();
const transform = NeosConfig.ui.card.transform;
export const Depth = 0.005;

export const SingleSlot = (props: {
  state: CardState[];
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
}) => {
  const boxRef = useRef(null);
  const dispatch = store.dispatch;
  const edgeRender =
    props.state.find((item) =>
      item === undefined ? false : item.idleInteractivities.length > 0
    ) !== undefined;
  const edgesWidth = 2.0;
  const edgesColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Yellow());

  useClick(
    (_event) => {
      if (props.state.length != 0) {
        dispatch(
          setCardListModalInfo(
            props.state
              .filter(
                (item) => item.occupant !== undefined && item.occupant.id !== 0
              )
              .map((item) => {
                return {
                  meta: item.occupant,
                  interactivies: item.idleInteractivities.map((interactivy) => {
                    return {
                      desc: interactTypeToString(interactivy.interactType),
                      response: interactivy.response,
                    };
                  }),
                };
              })
          )
        );
        dispatch(setCardListModalIsOpen(true));
      }
    },
    boxRef,
    [props.state]
  );

  return (
    <box
      name="single-slot"
      ref={boxRef}
      scaling={
        new BABYLON.Vector3(
          transform.x,
          transform.y,
          Depth * props.state.length
        )
      }
      position={props.position}
      rotation={props.rotation}
      enableEdgesRendering
      edgesWidth={edgeRender ? edgesWidth : 0}
      edgesColor={edgesColor}
    >
      <standardMaterial
        name="single-slot-mat"
        diffuseTexture={
          new BABYLON.Texture(`${NeosConfig.assetsPath}/card_back.jpg`)
        }
        alpha={props.state.length == 0 ? 0 : 1}
      />
    </box>
  );
};