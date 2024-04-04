export class TypingHandler {
    private isTyping: boolean = false;
    public isSleepModeActive: boolean = false;

    setupChatListener(WA: any) {
        if (!this.isSleepModeActive) {
            return;
        }
        if (this.isTyping) {
            return;
        }
        this.isTyping = true;
        let randomTime = Math.floor(Math.random() * 15000) + 1000;
        console.log("randomTime", randomTime);
        setTimeout(() => {
            WA.chat.startTyping({ scope: 'bubble', author: WA.player.name });
            setTimeout(() => {
                WA.chat.sendChatMessage(
                    'Bonjour je suis Charles je ne suis pas en train de dormir',
                    { scope: 'bubble', author: WA.player.name });
                WA.chat.stopTyping({ scope: 'bubble', author: WA.player.name });
                this.isTyping = false;
            }, 3000);
        }, randomTime);
    }
}
