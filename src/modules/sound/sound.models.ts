import { ApiProperty } from '@nestjs/swagger';
import { IHatcherSoundTrack } from './sound.interfaces';

export class HatcherSoundTrackModel implements IHatcherSoundTrack {
	@ApiProperty({
        description: 'Unique Track ID'
    })
	id: string;

    @ApiProperty({
        description: 'Duration of the track in milliseconds'
    })
    playbackDuration: number;

    @ApiProperty({
        description: 'Date and time of the last playback start trigger event. When paused should be set to null.'
    })
    playbackTriggeredAt: Date | null;

    @ApiProperty({
        description: 'Playback head starting position at the time of the start trigger event',
    })
    playbackStartTime: number = 0;

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

    fileUrl: string;

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
