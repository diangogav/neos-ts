import { ygopro } from "../../../idl/ocgcore";
import { YgoProPacket } from "../../packet";
import { CTOS_RESPONSE } from "../../protoDecl";
import adaptSelectIdleCmdResponse from "./selectIdleCmd";
import adaptSelectPlaceResponse from "./selectPlace";
import adaptSelectCardResponse from "./selectCard";

/*
 * CTOS CTOS_RESPONSE
 *
 * @param response: any - 对于服务端传给端上的`GameMsg`，回传一个`Response`
 *
 * @usage - 告知服务端玩家对局内的操作选择
 *
 * */
export default class CtosResponsePacket extends YgoProPacket {
  constructor(pb: ygopro.YgoCtosMsg) {
    const response = pb.ctos_response;
    let extraData = new Uint8Array(0);

    switch (response.gameMsgResponse) {
      case "select_idle_cmd": {
        extraData = adaptSelectIdleCmdResponse(response.select_idle_cmd);

        break;
      }
      case "select_place": {
        extraData = adaptSelectPlaceResponse(response.select_place);

        break;
      }
      case "select_card": {
        extraData = adaptSelectCardResponse(response.select_card);

        break;
      }
      default: {
        break;
      }
    }

    super(extraData.length + 1, CTOS_RESPONSE, extraData);
  }
}
