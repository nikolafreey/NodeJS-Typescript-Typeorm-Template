import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import i18next from 'i18next';
import morgan from 'morgan';
import errorMiddleware from './middleware/error.middleware';
import translationEn from './translations/en';
import translationSr from './translations/sr';
import { myDataSource } from './utils/appDataSource';
import Controller from './utils/interfaces/controller.interface';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
    this.initialiseTranslation();
  }

  private async initialiseTranslation(): Promise<void> {
    const resources = {
      en: {
        translation: translationEn,
      },
      sr: {
        translation: translationSr,
      },
    };

    await i18next.init({
      lng: 'sr',
      debug: true,
      resources,
      fallbackLng: 'sr',
      keySeparator: '.',
      interpolation: {
        escapeValue: false,
      },
      supportedLngs: ['en', 'sr'],
    });
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  private async initialiseDatabaseConnection(): Promise<void> {
    myDataSource
      .initialize()
      .then(async () => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err);
      });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
