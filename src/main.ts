/// <reference types="@workadventure/iframe-api-typings" />

import { Menu, Popup } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: Popup | undefined = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);
    WA.nav.openCoWebSite("/time2chill.html", true);

    const arrayClock = [
      ["13:16", 100, 100],
      ["13:17", 400, 400],
    ];
    //clokMov(arrayClock);

    ondblclick;
    let sleepModeIsActive = false;

    let currentSleepModeButton: Menu | undefined = undefined;

    const changeSleepMode = () => {
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
          // fonctions à rajouter lorsque monsieur ne veut pas travailler

          // Bouger en fonction d'un horraire
          clokMov(arrayClock);

          changeSleepMode();
        },
      }
    );
    /*
        let moveTimeout: NodeJS.Timeout | null = null;

        WA.player.onPlayerMove(() => {
            if (moveTimeout !== null) {
                clearTimeout(moveTimeout);
            }
        
            moveTimeout = setTimeout(() => {
                sendPosition();
            }, 500); // Attendre 500 ms après le dernier mouvement du joueur pour envoyer la position
        });
        
*/

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "Il est " + time, []);
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

function movMap(x: number, y: number) {
  WA.player.moveTo(x, y);
}

function refresh(arrayClock: string | any[]) {
  var t = 60000; // rafraîchissement en millisecondes
  setTimeout(clokMov, t, arrayClock); // Passer la référence de la fonction directement
}

function clokMov(arrayClock: string | any[]) {
  const todayClock = new Date();
  const timeClock = todayClock.getHours() + ":" + todayClock.getMinutes();

  for (let i = 0; i < arrayClock.length; i++) {
    if (timeClock == arrayClock[i][0]) {
      movMap(arrayClock[i][1], arrayClock[i][2]);
    }
  }

  refresh(arrayClock);
}

/*
function sendPosition() {
    WA.player.getPosition().then(position => {
        var posX = position.x;
        var posY = position.y;
        window.parent.postMessage({ type: 'my_message', posX, posY }, '*');
    });
};
*/

export {};
