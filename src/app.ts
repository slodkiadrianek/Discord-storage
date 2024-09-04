import e from "express";
import {
  client,
  BOT_TOKEN,
  createThreadInChannel,
  fetchData,
} from "./model/discord.js";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the filename from the module URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the filename
const __dirname = dirname(__filename);
const app = e();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  e.urlencoded({
    extended: true,
  })
);
import App from "./routes/routes.js";

app.use(App);

app.listen(3300, () => {
  console.log(`Server is running on port 3300`);
  client.once("ready", () => {
    console.log(`BOT IS ONLINE`);
  });

  client.login(BOT_TOKEN);
});
