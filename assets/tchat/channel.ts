import ReconnectingWebSocket from 'reconnecting-websocket';
import Alpine from 'alpinejs';

import { HatcherTchatSocketWrapper } from './wrapper';
import { IHatcherPageTchatMessage, IHatcherPageTchatThread } from './interfaces';

export const HATCHER_TCHAT_PAGE_THREAD_TTL = 120_000; // number of milliseconds before a new message from the same source becomes another thread

/**
 * Takes an array of messages and turns it into an array of threads
 *
 * - date
 * - messages
 */
export function aggregateMessagesToThreads(messages: IHatcherPageTchatMessage[]): IHatcherPageTchatThread[] {
	const threads: IHatcherPageTchatThread[] = [];

	for (const message of messages) {
		let lastThread = threads.length ? threads[threads.length - 1] : null;

        if (!lastThread) {
            lastThread = { messages: [], date: message.createdAt };
            threads.push(lastThread);
        } 

        const lastThreadTime = lastThread.date.getTime();
        const messageCreationTime = message.createdAt.getTime();

        // If last thread is dead, make another one
        if (lastThreadTime + HATCHER_TCHAT_PAGE_THREAD_TTL < messageCreationTime) {
            lastThread = { messages: [], date: message.createdAt };
            threads.push(lastThread);
        }

        lastThread.messages.push(message);
        lastThread.date = message.createdAt;
	}

	return threads;
}

Object.assign(window, {
	Alpine,
	ReconnectingWebSocket,
	HatcherTchatSocketWrapper,
    aggregateMessagesToThreads,
});
