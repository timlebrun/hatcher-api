export interface IHatcherPageTchatMessage {
    id: number;

    type: string;
    content: Record<string, any>;

    createdAt: Date;
}

export interface IHatcherPageTchatThread {
    messages: IHatcherPageTchatMessage[];
    date: Date;
}