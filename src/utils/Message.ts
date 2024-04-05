import OpenAI from "openai";

export class Message {
    public author: string;
    public content: string | OpenAI.Chat.Completions.ChatCompletion;

    constructor(author: string, content: string | OpenAI.Chat.Completions.ChatCompletion) {
        this.author = author;
        this.content = content;
    }

    toString(): string {
        return this.author + ":" + this.content;
    }
}