import { Storage } from "@capacitor/storage";

export const store = {
  async get<T> (key: string) {
    const ret = await Storage.get({ key });
    if (ret.value) {
      return JSON.parse(ret.value) as T;
    }
  },

  async remove (key: string) {
    await Storage.remove({
      key,
    });
  },

  async set (key: string, value: any) {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    });
  },
};
