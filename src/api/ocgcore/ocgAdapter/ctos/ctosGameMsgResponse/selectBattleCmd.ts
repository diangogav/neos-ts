import { ygopro } from "../../../idl/ocgcore";
import { BufferWriter } from "rust-src";

export default (
  response: ygopro.CtosGameMsgResponse.SelectBattleCmdResponse
) => {
  const writer = new BufferWriter();

  writer.writeUint32(response.selected_cmd);

  return writer.toArray();
};
