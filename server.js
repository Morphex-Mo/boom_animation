import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const basePort = Number(process.env.PORT) || 8000;
let port = basePort;

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/vendor",
  express.static(path.join(__dirname, "node_modules", "three", "build"))
);

function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      port += 1;
      server.close(() => startServer());
      return;
    }
    throw err;
  });
}

startServer();
