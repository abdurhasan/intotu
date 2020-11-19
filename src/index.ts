import { $log as Logger } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    Logger.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(AppModule);

    await platform.listen();
    Logger.debug("Server initialized");
  } catch (er) {
    Logger.error(er);
  }
}

bootstrap();
