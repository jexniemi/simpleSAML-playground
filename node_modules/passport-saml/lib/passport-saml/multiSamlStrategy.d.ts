import SamlStrategy = require('./strategy');
import type { Request } from 'express';
import { AuthenticateOptions, AuthorizeOptions, RequestWithUser, SamlConfig, VerifyWithoutRequest, VerifyWithRequest } from './types';
declare type SamlOptionsCallback = (err: Error | null, samlOptions?: SamlConfig) => void;
interface MultiSamlConfig extends SamlConfig {
    getSamlOptions(req: Request, callback: SamlOptionsCallback): void;
}
declare class MultiSamlStrategy extends SamlStrategy {
    _options: MultiSamlConfig;
    constructor(options: MultiSamlConfig, verify: VerifyWithRequest | VerifyWithoutRequest);
    authenticate(req: RequestWithUser, options: AuthenticateOptions & AuthorizeOptions): void;
    logout(req: RequestWithUser, callback: (err: Error | null, url?: string | null | undefined) => void): void;
    generateServiceProviderMetadata(req: Request, decryptionCert: string | null, signingCert: string | null, callback: (err: Error | null, metadata?: string) => void): void;
}
export = MultiSamlStrategy;
