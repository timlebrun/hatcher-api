import ReconnectingWebSocket from 'reconnecting-websocket';
import Alpine from 'alpinejs';

import { createAlpineStore, guessIntlLanguage } from './helpers';
import { HatcherAuthState } from './auth';

import 'bootstrap';
import { HatcherRenderer } from './renderer';

const authState = new HatcherAuthState('/api/auth', 'test');

const hatcherRenderer = new HatcherRenderer();

interface IHatcherAuthStoreData {
	hasSession: boolean | null;
	currentUser: any | null;
}

const alpineAuthStore = createAlpineStore<IHatcherAuthStoreData>('auth', {
	hasSession: null,
	currentUser: null,
});

async function syncStore() {
	alpineAuthStore.hasSession = authState.hasSession();

	alpineAuthStore.currentUser = alpineAuthStore.hasSession
		? await authState.fetchCurrentUser()
		: null;
}

authState.onChange(async () => syncStore());

hatcherRenderer.beforeBoot(() => {
	syncStore();
});

hatcherRenderer.onBoot(() => {
	Alpine.start();
});

const windowHatcherNamespace = {
	renderer: hatcherRenderer,
};

Object.assign(window, {
	Alpine,
	ReconnectingWebSocket,
	guessIntlLanguage,
	hatcher: windowHatcherNamespace,
});
