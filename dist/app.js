import e from "express";
import { client, BOT_TOKEN, } from "./model/discord.js";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import App from "./routes/routes.js";
// Get the filename from the module URL
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the filename
const __dirname = dirname(__filename);
const app = e();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(e.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(App);
app.listen(3300, () => {
    console.log(`Server is running on port 3300`);
    client.once("ready", () => {
        console.log(`BOT IS ONLINE`);
    });
    client.login(BOT_TOKEN);
});
