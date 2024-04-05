/// <reference types="@workadventure/iframe-api-typings" />

import { CoWebsite, Menu, Popup, RemotePlayerInterface } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { TypingHandler } from "./utils/TypingHandler";
import { Message } from "./utils/Message";
import {AudioFile} from "./utils/audioFile";

console.log('Script started successfully');

let currentPopup: Popup | undefined = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);
    
    const audioPlay = new AudioFile();

    await WA.players.configureTracking({
      players: true,
      movement: false,
    });

    WA.player.state.isSleepModeActive = false;
    console.log("Sleep mode: ", WA.player.state.isSleepModeActive);

    let currentSleepModeButton: Menu | undefined = undefined;
    let automaticMovementButton: Menu | undefined = undefined;
    let coWebsite: CoWebsite | undefined = undefined;
    let automaticMovementWebSite: Promise<CoWebsite> | undefined = undefined;
    const typingHandler = new TypingHandler(WA.player.name);

    const changeSleepMode = async () => {
      WA.player.state.isSleepModeActive = !WA.player.state.isSleepModeActive;
      audioPlay.isSleepModeActive = WA.player.state.isSleepModeActive as boolean;

      if (currentSleepModeButton != undefined) {
        currentSleepModeButton.remove();
        if (automaticMovementButton) automaticMovementButton.remove();
        if (WA.player.state.isSleepModeActive) {
          coWebsite = await WA.nav.openCoWebSite(`${import.meta.env.BASE_URL}sleepMode.html`);
          automaticMovementButton = WA.ui.registerMenuCommand(
            "Mouvement Automatique",
            {
              callback: () => {
                automaticMovementWebSite = WA.nav.openCoWebSite(`${import.meta.env.BASE_URL}time2chill.html`, true);
              },
            }
          );
        } else {
          if (coWebsite) coWebsite.close();
          if (automaticMovementWebSite)
            (await automaticMovementWebSite).close();
        }
        currentSleepModeButton = WA.ui.registerMenuCommand(
            getSleepModeMenuName(WA),
          {
            callback: () => {
              changeSleepMode();
            },
          }
        );
      }
    };

    currentSleepModeButton = WA.ui.registerMenuCommand(
        getSleepModeMenuName(WA),
      {
        callback: () => {
          // Fonctions à rajouter lorsque monsieur ne veut pas travailler
          // Bouger en fonction d'un horraire
          WA.nav.openCoWebSite(`${import.meta.env.BASE_URL}time2chill.html`, true);
          changeSleepMode();
        },
      }
    );
    
    WA.player.proximityMeeting.onJoin().subscribe(async (players: RemotePlayerInterface[]) => {
        console.log('Player joined :' + players);
        console.log('Player joined :' + WA.player.name);
        audioPlay.playAudioFile(WA,WA.player.name);
    });

    WA.chat.onChatMessage(
      (message: string, event: any) => {
        console.log("The local user typed a message", message);
        if (event.author !== undefined) {
          console.log("Message author: ", event.author.name);
          let messageData = new Message(event.author.name, message);
          typingHandler.respondToMessage(WA, messageData);
        }
      },
      { scope: "bubble" }
    );

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      // set hours/minutes with 0 if < 10
      const hours = today.getHours().toString().padStart(2, "0");
      const minutes = today.getMinutes().toString().padStart(2, "0");
      const time = hours + ":" + minutes;
      currentPopup = WA.ui.openPopup("clockPopup", time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

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


function getSleepModeMenuName(WA: any) {
    return WA.player.state.isSleepModeActive ? "Se Réveiller !" : "C'est l'heure de dormir";
}

export {};
