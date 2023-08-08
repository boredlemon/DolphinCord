import {
    AblyMessageCallback,
    assertConfiguration,
    ChannelNameAndOptions,
} from "@ably-labs/react-hooks";
import type { Types } from "ably";

export type ChannelAndClient = [
    channel: Types.RealtimeChannelPromise,
    message: Types.RealtimePromise
];

export type UseChannelParam = ChannelNameAndOptions & {
    /**
     * Accepted events or message filter
     */
    events?: string | string[] | Types.MessageFilter;
    enabled?: boolean;
};

/**
 * Customized use channel hook
 */
export function useChannel(
    options: UseChannelParam,
    listener: AblyMessageCallback
): ChannelAndClient {
    const ably = assertConfiguration();
    const channel = ably.channels.get(options.channelName, options.options);
    const enabled = options.enabled ?? true;

    if (enabled) {
        if (options.events != null) {
            channel.subscribe(options.events as any, listener);
        } else {
            channel.subscribe(listener);
        }
    }

    const onUnmount = () => {
        channel.unsubscribe(listener);
    };

    return [channel, ably];
}

export function useChannels(
    channelList: Types.RealtimeChannelPromise[],
    onEvent: AblyMessageCallback
) {
    for (const channel of channelList) {
        channel.subscribe(onEvent);
    }

    return () => {
        for (const channel of channelList) {
            channel.unsubscribe(onEvent);
        }
    };
}
