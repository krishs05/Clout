import {
    AudioPlayer,
    VoiceConnection,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    joinVoiceChannel
} from '@discordjs/voice';
import play from 'play-dl';
import { TextBasedChannel } from 'discord.js';

export interface Song {
    title: string;
    url: string;
    duration: string;
    requestedBy: string;
}

export class GuildQueue {
    public songs: Song[] = [];
    public connection: VoiceConnection | null = null;
    public player: AudioPlayer;
    public playing: boolean = false;
    public textChannel: TextBasedChannel | null = null;

    constructor(public textChannelRef: TextBasedChannel) {
        this.textChannel = textChannelRef;
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.songs.shift();
            this.playNext();
        });

        this.player.on('error', error => {
            console.error('Audio Player Error:', error);
            this.songs.shift();
            this.playNext();
        });
    }

    public async playNext() {
        if (this.songs.length === 0) {
            this.playing = false;
            return;
        }

        this.playing = true;
        const song = this.songs[0];

        try {
            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, { inputType: stream.type });

            this.player.play(resource);
            if (this.connection) {
                this.connection.subscribe(this.player);
            }

            if (this.textChannel) {
                (this.textChannel as any).send(`🎶 Now playing: **${song.title}** requested by ${song.requestedBy}`).catch(() => null);
            }
        } catch (error) {
            console.error('Error playing song:', error);
            this.songs.shift();
            this.playNext();
        }
    }

    public stop() {
        this.songs = [];
        this.player.stop();
        this.playing = false;
        if (this.connection) {
            this.connection.destroy();
            this.connection = null;
        }
    }
}

export const queues = new Map<string, GuildQueue>();
