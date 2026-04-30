// Separation of concerns:
// app.ts sets up Express
// server.ts starts the server
// This separation makes testing easier — tests import app, not server

import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Job Tracker API running on http://localhost:${PORT}`);
});
