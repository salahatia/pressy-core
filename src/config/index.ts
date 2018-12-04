import { Config } from './index';
import { readFileSync } from 'fs';

interface MailingConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string
  }
}

export interface Config {

  logEntriesLoggerAPIKey: string;
  googleMapsAPIKey: string;
  authenticationPublicKey: string;
  authenticationPrivateKey: string;
  mailingService: MailingConfig;

}

let cachedConfig: Config;

export function getConfig(): Config {

  if (cachedConfig != undefined)
    return cachedConfig;

  const configJSON = readFileSync("config.json", {encoding: "utf8"});
  const config: Config = JSON.parse(configJSON);

  if (config != undefined)
    cachedConfig = config;

  return config;

}