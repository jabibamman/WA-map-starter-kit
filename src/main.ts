/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import {playAudioFile, stopAudioFile} from "./audioFile";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
    // let playerName = WA.player.name;
    console.log('Player name: ', WA.player.name);

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })
    WA.room.area.onLeave('clock').subscribe(closePopup)

    WA.room.area.onEnter('jitsiMeetingRoom').subscribe(() => {
        console.log('enter to meeting room');
        playAudioFile(WA.player.name)
    })
    console.log('Exit meeting room');
    WA.room.area.onLeave('jitsiMeetingRoom').subscribe(stopAudioFile);



    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
