/// <reference types="@workadventure/iframe-api-typings" />

import { Menu, Popup } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: Popup | undefined = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    let sleepModeIsActive = false;

    let currentSleepModeButton: Menu | undefined = undefined;

    const changeSleepMode = () => {
      console.log("Test boutton !");
      sleepModeIsActive = !sleepModeIsActive;
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

    WA.chat.onChatMessage(
      (message, event) => {
        console.log("The local user typed a message", message);
        if (event.author !== undefined) {
          console.log("Message author: ", event.author.name);
        }
      },
      { scope: "bubble" }
    );

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "Ronan " + time, []);
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

export {};
