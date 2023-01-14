export interface IHatcherSoundTrack {
	id: string;

    displayLabel: string;
	displayColor: string;
	displayIcon: string;

	playbackDuration: number; // in milliseconds
	playbackTriggeredAt: Date | null;
	playbackStartTime: number; // in milliseconds ?

    songTitle: string;
	songArtist: string;

	filePath: string;
	fileSize: number;
	fileOriginalName: string;
	fileOrginalType: string;
	fileUrl: string;

	tags: string[];
	data: { [key: string]: any };

	updatedAt: Date;
	createdAt: Date;
}
