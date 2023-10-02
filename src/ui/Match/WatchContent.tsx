import { SearchOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Divider, Empty, Input } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { proxy, useSnapshot } from "valtio";

import { getUserInfo } from "@/api";
import { useConfig } from "@/config";

import { ScrollableArea } from "../Shared";
import styles from "./WatchContent.module.scss";

const { athleticWatchUrl } = useConfig();

interface Info {
  event: "init" | "create" | "update" | "delete";
  data: Room | Room[] | string;
}

interface Room {
  id?: string;
  title?: string;
  users?: { username: string; position: number; avatar?: string }[];
  options: Options;
}

interface Options {
  mode: number;
  rule: number;
  start_lp: number;
  start_lp_tag: number;
  start_hand: number;
  draw_count: number;
  duel_rule: number;
  no_check_deck: boolean;
  no_shuffle_deck: boolean;
  lflist?: number;
  time_limit?: number;
  auto_death: boolean;
}

export const watchStore = proxy<{ watchID: string | undefined }>({
  watchID: undefined,
});

export const WatchContent: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { message } = App.useApp();
  const { watchID } = useSnapshot(watchStore);
  const [query, setQuery] = useState("");
  // 暂时只支持竞技匹配的观战，TODO：后面需要加上娱乐匹配的支持
  const url = new URL(athleticWatchUrl);
  url.searchParams.set("filter", "started");

  const { readyState } = useWebSocket(url.toString(), {
    onOpen: () => console.log("watch websocket opened."),
    onClose: () => console.log("watch websocket closed."),
    onMessage: (event) => {
      const info: Info = JSON.parse(event.data);
      switch (info.event) {
        case "init": {
          //@ts-ignore
          const rooms: Room[] = info.data;
          rooms.forEach(
            (room) =>
              room.users?.forEach(
                async (user) =>
                  (user.avatar = (await getUserInfo(user.username))?.avatar),
              ),
          );
          setRooms(rooms);
          break;
        }
        case "create": {
          //@ts-ignore
          const room: Room = info.data;

          room.users?.forEach(
            async (user) =>
              (user.avatar = (await getUserInfo(user.username))?.avatar),
          );
          setRooms((prev) => prev.concat(room));
          break;
        }
        case "update": {
          //@ts-ignore
          const room: Room = info.data;
          room.users?.forEach(
            async (user) =>
              (user.avatar = (await getUserInfo(user.username))?.avatar),
          );
          setRooms((prev) => {
            const target = prev.find((item) => item.id === room.id);
            if (target) {
              Object.assign(target, info.data);
            }
            return prev;
          });
          break;
        }
        case "delete": {
          //@ts-ignore
          const id: string = info.data;
          setRooms((prev) => {
            prev.splice(
              prev.findIndex((room) => room.id === id),
              1,
            );
            return prev;
          });
          break;
        }
      }
    },
    onError: (_e) => message.error("Websocket Error!"),
  });

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Input
          className={styles.input}
          placeholder="通过玩家用户名搜索房间"
          bordered={false}
          suffix={<Button type="text" icon={<SearchOutlined />} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ScrollableArea maxHeight="50vh">
        {readyState === ReadyState.CONNECTING || rooms.length === 0 ? (
          <Empty />
        ) : (
          rooms
            .filter(
              (room) =>
                room.users?.at(0)?.username.includes(query) ||
                room.users?.at(1)?.username.includes(query),
            )
            .map((room) => (
              <div key={room.id}>
                <div
                  className={classNames(styles.item, {
                    [styles["item-selected"]]: watchID && watchID === room.id,
                  })}
                  onClick={() => (watchStore.watchID = room.id)}
                >
                  <div className={styles.avatar}>
                    <Avatar src={room.users?.at(0)?.avatar} />
                    <Avatar src={room.users?.at(1)?.avatar} />
                  </div>
                  <div className={styles.title}>
                    {`${room.users?.at(0)?.username} 与 ${room.users?.at(1)
                      ?.username} 的决斗`}
                  </div>
                  <div className={styles.mode}>竞技匹配</div>
                </div>
                <Divider className={styles.divider} />
              </div>
            ))
        )}
      </ScrollableArea>
    </div>
  );
};
