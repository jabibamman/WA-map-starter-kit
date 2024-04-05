import {GenerateMessage} from "./GenerateMessage";
import {Message} from "./Message";

export class TypingHandler {
    private isTyping: boolean;
    public isSleepModeActive: boolean;
    private messagesToRespond: Message[];
    private generateMessage: GenerateMessage;
    private responseTime: number;

    constructor(playerName: string) {
        this.isTyping = false;
        this.isSleepModeActive = false;
        this.messagesToRespond = [];
        this.generateMessage = new GenerateMessage(playerName);
        this.responseTime = 0;
    }

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
        const millisecondPerWord = (((Math.floor(Math.random() * 80)) + 80) / 60) * 1000;
        return message.length * (millisecondPerWord / 4.8);
    }
}
