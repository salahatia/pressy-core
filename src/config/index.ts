import { readFileSync } from 'fs';

interface MultiEnvSetting<T> {
  local: T;
  staging: T;
  production: T;
  [key: string]: T;
}

interface MailingConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string
  }
}

interface MailingOptions {
  defaultSender: string;
  senders: string[];
}

type ServiceHost = MultiEnvSetting<string>;

interface RuntimeConfig {
  port: {
    [key: string]: number;
    "mobile-api": number;
    "driver-api": number;
    "admin-api": number;
    "laundry-api": number;
  },
  hosts: {
    [key: string]: ServiceHost;
    "mobile-api": ServiceHost;
    "driver-api": ServiceHost;
    "admin-api": ServiceHost;
    "laundry-api": ServiceHost;
  }
}

interface StripeConfig {
  apiKey: string;
}

export interface Config {

  logEntriesLoggerAPIKey: string;
  googleMapsAPIKey: string;
  authenticationPublicKey: string;
  authenticationPrivateKey: string;
  mailingServiceConfig: MailingConfig;
  mailingServiceOptions: MailingOptions;
  runtime: RuntimeConfig;
  stripeConfig: MultiEnvSetting<StripeConfig>;

}

export namespace Config {

  export function getHost(): string | undefined {
    let config = getConfig();
    let service = process.env.SERVICE;
    if (!service) {
      return undefined;
    }
    return getConfig().runtime.hosts[service][process.env.NODE_ENV || "local"];
  }

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