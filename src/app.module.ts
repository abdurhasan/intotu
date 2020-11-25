import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import * as helmet from "helmet";

import { Config } from './helpers/config.helper';
import { AuthMiddleware } from './middleware/auth.middleware';
import "@tsed/typeorm";
import "@tsed/ajv";
import "@tsed/platform-express"; // /!\ keep this import


export const rootDir = __dirname;

@Configuration({
  rootDir,
  httpPort: Config.getNumber('APP_PORT') || 8083,
  mount: {
    '/': [
      `${rootDir}/controllers/**/*.ts`
    ]
  },
  componentsScan: [
    `${rootDir}/services/**/**.ts`,
    `${rootDir}/middlewares/**/**.ts`
  ],
  typeorm: [{
    name: "default",
    type: 'mysql',
    host: Config.get('DB_HOST'),
    port: Config.getNumber('DB_PORT'),
    username: Config.get('DB_USERNAME'),
    password: Config.get('DB_PASSWORD'),
    database: Config.get('DB_DATABASE'),
    logging: Config.getBoolean('DB_LOGGING'),
    synchronize: false,
    entities: [`${__dirname}/models/saas/*{.ts,.js}`],
    charset: 'utf8mb4',
    timezone: 'Z',
  }]

})
export class AppModule {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(helmet())
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
    .use(AuthMiddleware)
  }
}
