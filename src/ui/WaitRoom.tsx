import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ygopro } from "../api/idl/ocgcore";
import { fetchDeck, IDeck } from "../api/Card";
import "../css/WaitRoom.css";
import { useAppSelector } from "../hook";
import { selectJoined } from "../reducers/joinSlice";
import { selectChat } from "../reducers/chatSlice";
import {
  selectIsHost,
  selectPlayer0,
  selectPlayer1,
  selectObserverCount,
} from "../reducers/playerSlice";
import { sendUpdateDeck, sendHsReady, sendHsStart } from "../api/helper";
import socketMiddleWare, { socketCmd } from "../middleware/socket";

const READY_STATE = "ready";

export default function WaitRoom() {
  const params = useParams<{
    player?: string;
    passWd?: string;
    ip?: string;
  }>();

  const [choseDeck, setChoseDeck] = useState<boolean>(false);
  const { player, passWd, ip } = params;

  useEffect(() => {
    if (ip && player && player.length != 0 && passWd && passWd.length != 0) {
      socketMiddleWare({
        cmd: socketCmd.CONNECT,
        initInfo: {
          ip,
          player,
          passWd,
        },
      });
    }
  }, []);

  const joined = useAppSelector(selectJoined);
  const chat = useAppSelector(selectChat);
  const isHost = useAppSelector(selectIsHost);
  const player0 = useAppSelector(selectPlayer0);
  const player1 = useAppSelector(selectPlayer1);
  const observerCount = useAppSelector(selectObserverCount);

  const handleChoseDeck = async () => {
    const deck = await fetchDeck("hero.ydk");

    sendUpdateDeck(deck);

    setChoseDeck(true);
  };

  const handleChoseReady = () => {
    sendHsReady();
  };

  const handleChoseStart = () => {
    sendHsStart();
  };

  return (
    <div className="container">
      <div className="playerRegion">
        <h2>{joined ? "Room Joined!" : "Room Not Joined."}</h2>
        <p>
          <button disabled={!joined} onClick={handleChoseDeck}>
            choose hero.ydk
          </button>
        </p>
        <p>
          <button disabled={!choseDeck} onClick={handleChoseReady}>
            ready
          </button>
        </p>
        <p>
          <button
            disabled={
              !(
                isHost &&
                player0.state != undefined &&
                player0.state === READY_STATE &&
                player1.state != undefined &&
                player1.state === READY_STATE
              )
            }
            onClick={handleChoseStart}
          >
            start
          </button>
        </p>
      </div>
      <div className="roomRegion">
        <h2>Room Passwd: {passWd}</h2>
        <p>
          player0: {player0.isHost == true ? "[Host]" : ""} {player0.name}{" "}
          {player0.state}
        </p>
        <p>
          player1: {player1.isHost == true ? "[Host]" : ""} {player1.name}{" "}
          {player1.state}
        </p>
        <p>observer: {observerCount}</p>
        <p>chat: {chat}</p>
      </div>
    </div>
  );
}
