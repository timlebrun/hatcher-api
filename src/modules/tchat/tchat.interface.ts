export class IHatcherTchatMessage {
	id: number;

	type: IHatcherTchatMessageType | string; // TEXT / ROLL

	// author: string; // hatcher://users/ ?
	// recipient: string; // hatcher://groups/ ?

	content: { [key: string]: any };

	createdAt: Date;
}

export enum IHatcherTchatMessageType {
	text = 'TEXT',
	roll = 'ROLL',
}