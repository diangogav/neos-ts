import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ygopro } from "./api/idl/ocgcore";

export default function WaitRoom() {
  const params = useParams<{
    player?: string;
    passWd?: string;
    ip?: string;
  }>();

  const [joined, setJoined] = useState<string>("false");
  const [chat, setChat] = useState<string>("");

  const ws = useRef<WebSocket | null>(null);

  const { player, passWd, ip } = params;
  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("ws://" + ip);
    }

    ws.current.onopen = () => {
      console.log("websocket open");

      if (
        player != null &&
        player.length != 0 &&
        passWd != null &&
        passWd.length != 0 &&
        ws.current
      ) {
        const wsCurrent = ws.current;

        wsCurrent.binaryType = "arraybuffer";

        sendPlayerInfo(wsCurrent, player);
        sendJoinGame(wsCurrent, 4947, passWd);
      }
    };

    ws.current.onclose = () => {
      console.log("websocket closed");
    };

    ws.current.onmessage = e => {
      const pb = ygopro.YgoStocMsg.deserializeBinary(e.data);

      switch (pb.msg) {
        case "stoc_join_game": {
          const msg = pb.stoc_join_game;

          console.log("joinGame msg=" + msg);

          setJoined("true");
          break;
        }
        case "stoc_chat": {
          const chat = pb.stoc_chat;

          setChat(chat.msg);
          break;
        }
        default: {
          break;
        }
      }
    };

    const wsCurrent = ws.current;

    return () => {
      if (wsCurrent.readyState == 1) {
        wsCurrent.close();
      }
    };
  }, [ws]);

  return (
    <div>
      <p>joined: {joined}</p>
      <p>chat: {chat}</p>
    </div>
  );
}

function sendPlayerInfo(ws: WebSocket, player: string) {
  const playerInfo = new ygopro.YgoCtosMsg({
    ctos_player_info: new ygopro.CtosPlayerInfo({
      name: player
    })
  });

  ws.send(playerInfo.serialize());
}

function sendJoinGame(ws: WebSocket, version: number, passWd: string) {
  const joinGame = new ygopro.YgoCtosMsg({
    ctos_join_game: new ygopro.CtosJoinGame({
      version, // todo: use config
      gameid: 0,
      passwd: passWd
    })
  });

  ws.send(joinGame.serialize());
}
