import {Sound} from "@workadventure/iframe-api-typings";

export class AudioFile {
    public mySound: Sound;
    public isSleepModeActive: boolean = false;

    public config: SoundConfig = {
        volume: 50,
        loop: false,
        rate: 1,
        detune: 1,
        delay: 0,
        seek: 0,
        mute: false
    }

    constructor() {
        this.mySound = {} as Sound; // Initialize mySound
    }

    // Function to play audio file
    public playAudioFile(WA: any,playerName: string): void {
        console.log('before' + this.isSleepModeActive);

        if (!this.isSleepModeActive){
            return;
        }
        console.log('after'+this.isSleepModeActive);
        console.log('starting playing audio');
        const directory = '/public/audio/';
        console.log('directory of file', directory);
        const fileName = `${directory}${playerName}.ogg`;
        console.log('file name', fileName);
        console.log("starting playing for " + playerName);
        WA.player.proximityMeeting.playSound(fileName).then(() =>
        console.log('audio playing'));

        WA.player.proximityMeeting.onLeave().subscribe(async () => {
            WA.room.area.onLeave('jitsiMeetingRoom').subscribe(() => {
                if (this.mySound && this.mySound.stop) {
                    this.mySound.stop();
                    console.log("Audio stopped.");
                }
            });
            WA.chat.sendChatMessage("You left the proximity chat", "System");
            console.log('I m leaving');
        });
    }

    // Function to stop playing audio file
}

interface SoundConfig {
    volume: number;
    loop: boolean;
    rate: number;
    detune: number;
    delay: number;
    seek: number;
    mute: boolean;
}
