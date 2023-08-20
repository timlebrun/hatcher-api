export class HatcherAuthManager {

    private storageCache: any = null;

    private readonly changeListeners: Array<() => any> = [];

	constructor(
        private readonly serverUrl: string,
        private readonly clientId: string,
    ) {}

    public hasSession() {
        const refreshToken = this.storageGet('refresh_token');

        return !! refreshToken;
    }

    public async login(username: string, password: string) {
        const refreshToken = this.storageGet('refresh_token');
        if (refreshToken) return;

        const loginResponse = await this.fetchLogin(username, password);

        this.storageSet('refresh_token', loginResponse.refresh_token);
        this.dispatchChange();
    }

    public async logout() {
        await this.fetchLogout();
        this.storageSet('refresh_token', null);
        this.storageSet('access_token', null);
        this.storageSet('access_expires_at', null);

        this.dispatchChange();
    }

    public async resolveAccessToken() {
        if (!this.hasSession()) return null;

        const currentTimestamp = HatcherAuthManager.getTimestamp();

        let accessToken = this.storageGet('access_token');
        let accessExpiresAt = this.storageGet<number>('access_expires_at');

        const accessExpired = accessExpiresAt && accessExpiresAt < currentTimestamp;

        if (!accessToken || accessExpired) {
            const refreshToken = this.storageGet('refresh_token');
            const tokenSet = await this.fetchRefresh(refreshToken);

            accessToken = this.storageSet('access_token', tokenSet.access_token);
            accessExpiresAt = this.storageSet('access_expires_at', tokenSet.expires_at);
            this.dispatchChange();
        }

        return accessToken;
    }

    public getRefreshToken() {
        return this.storageGet('refresh_token');
    }

    public onChange(listener: () => any) {
        this.changeListeners.push(listener);
    }

    private dispatchChange() {
        for (const listener of this.changeListeners) listener();
    }

    public async fetchLogout() {
        const currentToken = await this.resolveAccessToken();
        if (!currentToken) return null;

        const logoutResponse = await this.sendPostRequest('logout', { }, currentToken);

        return logoutResponse;
    }

	public async fetchLogin(username: string, password: string) {
        const loginResponse = await this.sendPostRequest('tokens', {
            grant_type: 'password',
            username: username,
            password: password,
            client_id: this.clientId,
        });

        return loginResponse;
    }

	public async fetchRefresh(refreshToken: string) {
        const refreshResponse = await this.sendPostRequest('tokens', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: this.clientId,
        });

        return refreshResponse;
	}

    public async fetchCurrentUser() {
        const currentToken = await this.resolveAccessToken();
        if (!currentToken) return null;

        const currentUserResponse = await this.sendGetRequest('me', currentToken);

        return currentUserResponse;
    }

    public async fetchCurrentUserSessions() {
        const currentToken = await this.resolveAccessToken();
        if (!currentToken) return null;

        const currentUserResponse = await this.sendGetRequest('me/sessions', currentToken);

        return currentUserResponse;
    }

    private async sendGetRequest(url: string, token?: string) {
        const requestInit: RequestInit = {
            headers: {},
            method: 'get',
		};

        if (token) requestInit.headers!['authorization'] = `Bearer ${token}`;
		const response = await fetch(`${this.serverUrl}/${url}`, requestInit);

        return await response.json();
    }

    private async sendPostRequest(url: string, body: any, token?: string) {
        const requestInit: RequestInit = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
			method: 'post',
		};

        if (token) requestInit.headers!['authorization'] = `Bearer ${token}`;

		const response = await fetch(`${this.serverUrl}/${url}`, requestInit);

        return await response.json();
    }

    private storageSet<T = string | number | null>(key: string, value: T): T {
        this.storageCache[key] = value;
        localStorage.setItem('hatcher:auth', JSON.stringify(this.storageCache));

        return this.storageCache[key];
    }

    private storageGet<T = string>(key: string): T {
        if (!this.storageCache) {
            const localStorageItem = localStorage.getItem('hatcher:auth');
            this.storageCache = localStorageItem ? JSON.parse(localStorageItem) : {};
        }

        return this.storageCache[key];
    }

    private static getTimestamp(date = new Date) {
        return Math.floor(date.getTime() / 1000);
    }
}
