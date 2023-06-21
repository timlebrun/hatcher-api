import Alpine from 'alpinejs';

type AlpineXData = Parameters<typeof Alpine['store']>[1];

/**
 * Attempts to guess the FULL language from the browser context
 *
 * @returns string
 */
export function guessIntlLanguage(): string | undefined {
	return navigator.languages.find(language => language.length > 4);
}

export function createAlpineStore<T extends AlpineXData>(name: string, data: T): T {
	Alpine.store(name, data);
	return Alpine.store(name) as T;
}