/// <reference types="@workadventure/iframe-api-typings" />

import { Menu, Popup } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { TypingHandler } from "./utils/TypingHandler";
import {Message} from "./utils/Message";

import {bootstrapExtra} from "@workadventure/scripting-api-extra";
import {RemotePlayerInterface} from "@workadventure/iframe-api-typings";
import {playAudioFile, stopAudioFile} from "./audioFile";

console.log('Script started successfully');

let currentPopup: Popup | undefined = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    let sleepModeIsActive: boolean = false;
    let currentSleepModeButton: Menu | undefined = undefined;
    const typingHandler = new TypingHandler();

    const changeSleepMode = () => {
      console.log("Test boutton !");
      sleepModeIsActive = !sleepModeIsActive;
      typingHandler.isSleepModeActive = sleepModeIsActive;

      if (currentSleepModeButton != undefined) {
        currentSleepModeButton.remove();
        currentSleepModeButton = WA.ui.registerMenuCommand(
          sleepModeIsActive ? "Se Réveiller !" : "C'est l'heure de dormir ^^",
          {
            callback: () => {
              changeSleepMode();
            },
          }
        );
      }
    };

    currentSleepModeButton = WA.ui.registerMenuCommand(
      sleepModeIsActive ? "Se Réveiller !" : "C'est l'heure de dormir ^^",
      {
        callback: () => {
          changeSleepMode();
        },
      }
    );

    await WA.players.configureTracking({
      players: true,
      movement: false,
    });

      WA.chat.onChatMessage((message: string, event: any) => {
          console.log("The local user typed a message", message);
          if (event.author !== undefined) {
              console.log("Message author: ", event.author.name);
              let messageData = new Message(event.author.name, message);
              typingHandler.respondToMessage(WA, messageData);
          }
      }, { scope: "bubble" });

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "Ronan " + time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    // WA.room.area.onEnter('jitsiMeetingRoom').subscribe(() => {
    //     console.log('enter to meeting room');
    //     playAudioFile(WA.player.name)
    // })
    // console.log('Exit meeting room');
    // WA.room.area.onLeave('jitsiMeetingRoom').subscribe(stopAudioFile);
    // const directory = '/audio/';
    // console.log('directory of file', directory);
    // let playerName = WA.player.name;
    // const fileName = `${directory}${playerName}.ogg`;
    // console.log('file name', fileName);
    // console.log("starting palying for " + playerName);
    // WA.player.proximityMeeting.playSound(fileName).then(() =>
    // playAudioFile(fileName));

    WA.player.proximityMeeting.onJoin().subscribe(async (players: RemotePlayerInterface[]) => {
        console.log('Player joined :' + players);
        // WA.chat.sendChatMessage("You joined a proximity chat", "System");
        const directory = 'public/audio/';
        console.log('directory of file', directory);
        let playerName = WA.player.name;
        const fileName = `${directory}${playerName}.ogg`;
        console.log('file name', fileName);
        console.log("starting palying for " + playerName);
        // WA.room.area.onEnter('jitsiMeetingRoom').subscribe(() => {
        //     console.log('enter to meeting room');
        //     playAudioFile(WA.player.name)
        // })
        await WA.player.proximityMeeting.playSound(fileName);
        WA.player.proximityMeeting.playSound(fileName).then(() => playAudioFile(fileName));
        WA.player.proximityMeeting.onParticipantJoin().subscribe(async (player: RemotePlayerInterface) => {
            console.log('Player joined :' + player);
            await WA.player.proximityMeeting.playSound(fileName);
            WA.chat.sendChatMessage("A participant joined the proximity chat", "System");

            await WA.player.proximityMeeting.playSound(fileName);
        });
    });

    WA.player.proximityMeeting.onLeave().subscribe(async () => {
        WA.room.area.onLeave('jitsiMeetingRoom').subscribe(stopAudioFile);
        WA.chat.sendChatMessage("You left the proximity chat", "System");
        console.log('I m leaving');
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}





export {};
