// server.ts
import app from "./app";
import { config } from "dotenv";

config();

const PORT = process.env.PORT_SERVEUR || 3000;
const GLOBAL_IP = process.env.GLOBAL_IP || "localhost";

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}. http://${GLOBAL_IP}:${PORT}`);
});