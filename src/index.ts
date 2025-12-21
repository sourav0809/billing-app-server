import { createApp } from "./app";
import { config } from "./config";

async function main() {
  const app = await createApp();
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
}

main();
