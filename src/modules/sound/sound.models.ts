import { ApiProperty } from '@nestjs/swagger';
import { IHatcherSoundTrack } from './sound.interfaces';

export class HatcherSoundTrackModel implements IHatcherSoundTrack {
	@ApiProperty({
        description: 'Unique Track ID'
    })
	id: string;

	@ApiProperty({
        description: ''
    })
	displayLabel: string;

	@ApiProperty({
        description: ''
    })
	displayColor: string;

	@ApiProperty({
        description: ''
    })
	displayIcon: string;

	@ApiProperty({
        description: ''
    })
	songTitle: string;

	@ApiProperty({
        description: ''
    })
	songArtist: string;

	@ApiProperty({
        description: ''
    })
	filePath: string;

	@ApiProperty({
        description: ''
    })
	fileSize: number;

	@ApiProperty({
        description: ''
    })
	fileOriginalName: string;

	@ApiProperty({
        description: ''
    })
	fileOrginalType: string;

	@ApiProperty({
        description: ''
    })
	tags: string[];

	@ApiProperty({
        description: ''
    })
	data: { [key: string]: any };

	@ApiProperty({
        description: ''
    })
	updatedAt: Date;

	@ApiProperty({
        description: ''
    })
	createdAt: Date;
}
