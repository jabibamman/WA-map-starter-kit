import {GenerateMessage} from "./GenerateMessage";
import {Message} from "./Message";

export class TypingHandler {
    private isTyping: boolean = false;
    public isSleepModeActive: boolean = false;
    private messagesToRespond: Message[] = [];
    private generateMessage = new GenerateMessage(
        "Tu t'appelles " + WA.player.name + ", tu es un développeur en télétravail. " +
        "Répond à ces messages pour montrer que tu es en train de travailler et coupe court à la conversation pour gagner du temps. " +
        "Si possible fait quelques fautes de frappes et utilise quand tu peux des abréviations comme \"tkt\" pour \"t'inquiète\" et rajoute des ticks de langages crédibles mais différents à chaque réponses que tu donnes. " +
        "Évite la ponctuation. Évite de te répéter avec tes anciens messages. " +
        "Si on te demande, tu n'es pas disponible pour un call, tu dois aller faire caca\n"
        //"ATTENTION : Dès qu'il y a écrit 'toi:' ou 'unNom:' c'est juste pour t'aider dans la compréhension du prompt, ne le met surtout pas dans la réponse\n"
    );
    private responseTime: number = 0;

    respondToMessage(WA: any, message: Message) {
        if (!this.isSleepModeActive) {
            return;
        }
        this.messagesToRespond.push(message);
        this.responseTime = Math.floor(Math.random() * 15000) + 10000;
        console.log("randomTime", this.responseTime);
        if (this.isTyping) {
            return;
        }
        this.isTyping = true;

        setTimeout(async () => {
            WA.chat.startTyping({ scope: 'bubble', author: WA.player.name });
            let response = await this.generateMessage.respondTo(this.messagesToRespond);

            if(response === null || response === undefined) {
                WA.chat.sendChatMessage(
                    "Désolé, je n'ai pas pu répondre à ta question. Je suis en train de travailler.",
                    {scope: 'bubble', author: WA.player.name});
                WA.chat.stopTyping({scope: 'bubble', author: WA.player.name});
                this.isTyping = false;
                this.messagesToRespond = [];
                return;
            }


            let typingSpeed = this.getResponseTime(response);
            console.log(response);
            console.log("time to type the message", typingSpeed);

            setTimeout(() => {
                WA.chat.sendChatMessage(
                    response,
                    {scope: 'bubble', author: WA.player.name});
                WA.chat.stopTyping({scope: 'bubble', author: WA.player.name});
                this.isTyping = false;
                this.messagesToRespond = [];
            }, typingSpeed);
        }, this.responseTime);
    }

    private getResponseTime(message: string): number {
        const millisecondPerWord = (60 / (40 + Math.floor(Math.random() * (121 - 40)))) * 1000;
        return message.split(' ').length * message.length / 4.8 * millisecondPerWord;
    }
}
