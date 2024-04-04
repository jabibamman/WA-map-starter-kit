import OpenAI from 'openai';
import {Message} from "./Message";
import axios from 'axios'; 

export class GenerateMessage {
    private openai: OpenAI | null = null;
    private readonly descriptionOfUser: string
    private chatHistory: Message[];

    constructor(descriptionOfUser: string) {
        this.descriptionOfUser = descriptionOfUser;
        this.chatHistory = [];
        this.initializeOpenAI();
    }

    private async initializeOpenAI() {
        try {
            const response = await axios.get('https://key-getter-b64d10ddaae7.herokuapp.com/api/key');
            const key = response.data.key;
            this.openai = new OpenAI({
                dangerouslyAllowBrowser: true,
                apiKey: key
            });
        } catch (error) {
            console.error("Error initializing OpenAI:", error);
        }
    }

    async respondTo(messages: Message[]) {
        let prompt = this.generatePrompt(messages);
        console.log(prompt);

        const chatCompletion = await this.openai.chat.completions.create({
            messages: [{
                role: 'user',
                content: prompt
            }],
            model: 'gpt-3.5-turbo',
        });

        const response = chatCompletion.choices[0]?.message.content;
        if (response === null || response === undefined) {
            throw new Error("OpenAI returned no response: " + JSON.stringify(chatCompletion))
        }
        console.log("OpenAI response:", response);

        messages.forEach(message => {
            this.chatHistory.push(message);
        });
        this.chatHistory.push(new Message("Toi", response));
        return response;
    }

    private generatePrompt(newMessage: Message[]): string {
        if (newMessage.length === 0) {
            return "";
        }

        let prompt = this.descriptionOfUser;
        if (this.chatHistory.length != 0) {
            prompt += "Voici l'historique de la discussion :\n"
            this.chatHistory.forEach(message => {
                prompt += "- " + message.content + "\n";
            });
        }

        if (newMessage.length === 1) {
            if (this.chatHistory.length === 0) {
                prompt += "Répond à ce message de " + newMessage[0].author + " : " + newMessage[0].content;
            }
            else {
                prompt += "Répond à ce message : " + newMessage[0].content;
            }
            return prompt;
        }
        prompt += "Fait une seule réponse pour les messages suivants :\n";
        newMessage.forEach(message => {
            prompt += "- " + message.content + "\n";
        });

        return prompt;
    }
}
