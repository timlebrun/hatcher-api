export class IHatcherTchatMessage {
	id: string;

	type: string;

	author: string;
	recipient: string;

	content: { [key: string]: any };

	createdAt: Date;
}
