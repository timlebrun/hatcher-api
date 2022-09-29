export interface IHatcherSoundTrack {
	id: string;

    displayLabel: string;
	displayColor: string;
	displayIcon: string;

    songTitle: string;
	songArtist: string;

	filePath: string;
	fileSize: number;
	fileOriginalName: string;
	fileOrginalType: string;
    
	tags: string[];
	data: { [key: string]: any };

	updatedAt: Date;
	createdAt: Date;
}
