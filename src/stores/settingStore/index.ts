import { isSSR } from "@react-spring/shared";
import { pick } from "lodash-es";
import { proxy, subscribe } from "valtio";

import { type NeosStore } from "../shared";
import { AudioConfig, defaultAudioConfig } from "./audio";

/** 将设置保存到本地 */
const NEO_SETTING_CONFIG = "__neo_setting_config__";

/** 设置项 */
type SettingStoreConfig = Pick<SettingStore, "audio">;

/** 默认设置 */
const defaultSettingConfig: SettingStoreConfig = {
  audio: defaultAudioConfig,
};

/** 获取默认设置 */
function getDefaultSetting() {
  if (!isSSR()) {
    /** 获取默认设置 */
    const setting = localStorage.getItem(NEO_SETTING_CONFIG);
    if (setting) return JSON.parse(setting) as SettingStoreConfig;
  }
  return defaultSettingConfig;
}

const defaultSetting = getDefaultSetting();

/** 设置模块 */
class SettingStore implements NeosStore {
  /** 音频设置 */
  audio: AudioConfig = defaultSetting.audio;

  /** 保存音频设置 */
  saveAudioConfig(config: Partial<AudioConfig>): void {
    Object.assign(this.audio, config);
  }

  reset(): void {
    const defaultSetting = getDefaultSetting();
    this.audio = defaultSetting.audio;
  }
}

/** 设置项 */
export const settingStore = proxy(new SettingStore());

/** 持久化设置项 */
subscribe(settingStore, () => {
  if (!isSSR()) {
    localStorage.setItem(
      NEO_SETTING_CONFIG,
      JSON.stringify(pick(settingStore, ["audio"])),
    );
  }
});
