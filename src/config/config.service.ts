import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
dotenv.config();

export type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {
  private readonly EnvVarsNames = ['NODE_ENV', 'PORT', 'ALGOD_NODE_URL', 'ALGOD_TOKEN'];
  private readonly envConfig: EnvConfig;

  constructor() {
    const envVars: { [key: string]: string } = {};
    this.EnvVarsNames.forEach((name) => (envVars[name] = this.getEnvVar(name)));
    this.envConfig = this.validateInput(envVars);
  }

  private getEnvVar(name: string): string {
    return process.env[name];
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().default('local').valid('local', 'development', 'production', 'test'),
      PORT: Joi.number().default(3000),
      ALGOD_NODE_URL: Joi.string().required(),
      ALGOD_TOKEN: Joi.string().required()
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {
      console.log(error);

      throw new Error(error);
    }
    return validatedEnvConfig;
  }

  get env(): string {
    return String(this.envConfig.NODE_ENV);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get(name: string): string {
    return process.env[name] || this.envConfig[name];
  }
}
