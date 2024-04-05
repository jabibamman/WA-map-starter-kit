import {Sound} from "@workadventure/iframe-api-typings";

export class AudioFile {

}

// @ts-ignore
let playerName = '';
// @ts-ignore
let playOrStop = false;

// interface AudioConfig {
//     volume?: number;
//     loop?: boolean;
//     rate?: number;
//     detune?: number;
//     delay?: number;
//     seek?: number;
//     mute?: boolean;
// }

var mySound: Sound;
var config = {
    volume: 50,
    loop: false,
    rate: 1,
    detune: 1,
    delay: 0,
    seek: 0,
    mute: false
}
WA.onInit()
    .then(() => {
        playerName = WA.player.name;
        console.log('Player name: ', WA.player.name);
    });


// Function to save audio file
// function saveAudioFile(playerName: string, audioData: Buffer): void {
//     const directory = 'public/audio/';
//     const fileName = `${directory}${playerName}.ogg`;
//     fs.writeFileSync(fileName, audioData);
//     console.log(`Audio file ${fileName} saved successfully.`);
// }

// Function to play audio file
export function playAudioFile(playerName: string): void {
    console.log('starting playing audio');
    const directory = '/public/audio/';
    console.log('directory of file', directory);
    const fileName = `${directory}${playerName}.ogg`;
    console.log('file name', fileName);
    console.log("starting palying for " + playerName);
    mySound = WA.sound.loadSound(fileName);
    mySound.play(config);
}

// Function to stop playing audio file
export function stopAudioFile(): void {
    // Assuming mySound is a reference to an object with stop method
    mySound.stop();
    console.log("Audio stopped.");
}

export {};