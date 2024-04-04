import {GenerateMessage} from "./GenerateMessage";
import {Message} from "./Message";

export class TypingHandler {
    private isTyping: boolean = false;
    public isSleepModeActive: boolean = false;
    private messagesToRespond: Message[] = [];
    private generateMessage = new GenerateMessage(
        "Tu t'appelles " + WA.player.name + ", tu es un développeur en télétravail. " +
        "Répond à ces messages pour montrer que tu es en train de travailler et coupe court à la conversation pour gagner du temps. " +
        "Si possible fait quelques fautes de frappes et utilise quand tu peux des abréviations comme \"tkt\" pour \"t'inquiète\" et rajoute des ticks de langages crédibles. " +
        "Évite la ponctuation. \n" +
        "Si on te demande, tu n'es pas disponible pour un call, tu dois aller faire caca\n"
        //"ATTENTION : Dès qu'il y a écrit 'toi:' ou 'unNom:' c'est juste pour t'aider dans la compréhension du prompt, ne le met surtout pas dans la réponse\n"
    );

    respondToMessage(WA: any, message: Message) {
        if (!this.isSleepModeActive) {
            return;
        }
        this.messagesToRespond.push(message);
        if (this.isTyping) {
            return;
        }
        this.isTyping = true;

        let randomTime = Math.floor(Math.random() * 15000) + 1000;
        let typingSpeed = 4000.8 * ((Math.random() * 80) + 40);
        console.log("randomTime", randomTime);
        console.log("typingSpeed", typingSpeed);

        setTimeout(async () => {
            WA.chat.startTyping({ scope: 'bubble', author: WA.player.name });
            let response = await this.generateMessage.respondTo(this.messagesToRespond);

            setTimeout(() => {
                WA.chat.sendChatMessage(
                    response,
                    {scope: 'bubble', author: WA.player.name});
                WA.chat.stopTyping({scope: 'bubble', author: WA.player.name});
                this.isTyping = false;
                this.messagesToRespond = [];
            }, typingSpeed);
        }, randomTime);
    }
}
