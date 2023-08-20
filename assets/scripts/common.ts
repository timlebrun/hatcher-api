import ReconnectingWebSocket from 'reconnecting-websocket';
import Alpine from 'alpinejs';

import { createAlpineStore, guessIntlLanguage } from './helpers';
import { HatcherAuthManager } from './auth';
import { HatcherRenderer } from './renderer';

import 'bootstrap';

const authManager = new HatcherAuthManager('/api/auth', 'test');

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
	alpineAuthStore.hasSession = authManager.hasSession();

	alpineAuthStore.currentUser = alpineAuthStore.hasSession
		? await authManager.fetchCurrentUser()
		: null;
}

authManager.onChange(async () => {
	if (alpineAuthStore.hasSession !== authManager.hasSession())
		window.location.reload();

	syncStore()
});

hatcherRenderer.beforeBoot(() => {
	syncStore();
});

hatcherRenderer.onBoot(() => {
	Alpine.start();
});

const windowHatcherNamespace = {
	auth: authManager,
	renderer: hatcherRenderer,
};

Object.assign(window, {
	Alpine,
	ReconnectingWebSocket,
	guessIntlLanguage,
	hatcher: windowHatcherNamespace,
});
