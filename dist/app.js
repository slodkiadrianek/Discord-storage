import e from "express";
import { client, BOT_TOKEN, } from "./model/discord.js";
const app = e();
app.use(e.urlencoded({
    extended: true,
}));
import App from "./routes/routes.js";
app.use(App);
app.listen(3300, () => {
    console.log(`Server is running on port 3300`);
    client.once("ready", () => {
        console.log(`BOT IS ONLINE`);
    });
    client.login(BOT_TOKEN);
});
