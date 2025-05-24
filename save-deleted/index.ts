import { before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const MessageStore = findByProps("deleteMessage", "getMessage");

let unpatch;

export const onLoad = () => {
  if (!storage.deletedMessages) storage.deletedMessages = {};

  unpatch = before("deleteMessage", MessageStore, ([channelId, messageId]) => {
    const msg = MessageStore.getMessage(channelId, messageId);
    if (msg) {
      if (!storage.deletedMessages[channelId])
        storage.deletedMessages[channelId] = {};
      storage.deletedMessages[channelId][messageId] = msg;
    }
  });
};

export const onUnload = () => {
  unpatch?.();
};
