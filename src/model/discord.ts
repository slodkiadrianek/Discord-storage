import {
  Client,
  GatewayIntentBits,
  ChannelType,
  AttachmentBuilder,
  IntentsBitField,
} from "discord.js";
import { configDotenv } from "dotenv";
configDotenv();
import path from "path";
import download from "download";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.Guilds,
  ],
});

export const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID ?? ""; // The channel where threads will be created

export async function createThreadInChannel(
  messageName: string,
  filePaths: string[]
) {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      throw new Error("Kanał nie został znaleziony.");
    }
    if (channel.type === ChannelType.GuildText) {
      const thread = await channel.threads.create({
        name: messageName,
      });
      const threadChannel = await client.channels.fetch(thread.id);
      if (threadChannel && threadChannel.isThread()) {
        const files = filePaths.map((filePath) =>
          new AttachmentBuilder(filePath)
            .setName(filePath.split("/")[2])
            .setFile(filePath)
        );
        for (const file of files) {
          await thread.send({
            files: [file],
          });
        }
        console.log("Message sent to thread!");
      } else {
        console.error("Invalid thread ID or thread not found.");
      }
    }
  } catch (error) {
    console.error("Błąd podczas tworzenia wątku:", error);
  }
}

export async function fetchData(threadId: string): Promise<string> {
  const thread = await client.channels.fetch(threadId);

  if (!thread || thread.type !== ChannelType.PublicThread) {
    throw new Error(
      "Wątek nie został znaleziony lub nie jest wątkiem publicznym."
    );
  }
  const fetchedMessages: any = await thread.messages.fetch({
    limit: 100,
  });
  const links: string[] = [];
  fetchedMessages.forEach((message: any) => {
    const attachment = message.attachments;
    attachment.forEach((file: any) => {
      links.push(file.attachment);
    });
  });
  const __dirname = path.resolve();
  const ext = path.join(__dirname, `src/uploads`);
  for (const link of links) {
    await download(link, ext);
  }
  return "Files downloaded successfully";
}
