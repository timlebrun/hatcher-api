import { Injectable } from '@nestjs/common';
import { IHatcherSoundTrack } from './sound.interfaces';

import * as uuid from 'uuid';

@Injectable()
export class HatcherSoundService {
	public async listTracks(): Promise<IHatcherSoundTrack[]> {
        return [
            {
                id: uuid.v1(),
            
                displayLabel: 'Musique',
                displayColor: '#2222ff',
                displayIcon: '🪓',
            
                songTitle: 'BlablRusse',
                songArtist: 'Mec Russe',
            
                filePath: '1381ff30-403e-11ed-a93a-079028c5a20b.mp3',
                fileSize: 12,
                fileOriginalName: 'hehe.mp3',
                fileOrginalType: 'sound/mp3',
                
                tags: ['russent'],
                data: { },
            
                updatedAt: new Date(),
                createdAt: new Date(),
            },
            {
                id: uuid.v1(),
            
                displayLabel: 'Musique',
                displayColor: '#2222ff',
                displayIcon: '🪓',
            
                songTitle: 'BlablRusse',
                songArtist: 'Mec Russe',
            
                filePath: '1381ff30-403e-11ed-a93a-079028c5a20b.mp3',
                fileSize: 12,
                fileOriginalName: 'hehe.mp3',
                fileOrginalType: 'sound/mp3',
                
                tags: ['russent'],
                data: { },
            
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        ];
    }

    public async readFile(): Promise<Buffer> {
        return Buffer.from([]);
    }
}
