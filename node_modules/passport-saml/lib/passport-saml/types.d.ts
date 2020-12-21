import type * as express from 'express';
import * as passport from 'passport';
import type { CacheProvider } from './inmemory-cache-provider';
export declare type CertCallback = (callback: (err: Error | null, cert?: string | string[]) => void) => void;
export interface AuthenticateOptions extends passport.AuthenticateOptions {
    additionalParams?: Record<string, any>;
}
export interface AuthorizeOptions extends AuthenticateOptions {
    samlFallback?: 'login-request' | 'logout-request';
}
export interface SamlConfig {
    callbackUrl?: string;
    path?: string;
    protocol?: string;
    host?: string;
    entryPoint?: string;
    issuer?: string;
    privateCert?: string;
    cert?: string | string[] | CertCallback;
    decryptionPvk?: string;
    signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512';
    additionalParams?: any;
    additionalAuthorizeParams?: any;
    identifierFormat?: string;
    acceptedClockSkewMs?: number;
    attributeConsumingServiceIndex?: string | null;
    disableRequestedAuthnContext?: boolean;
    authnContext?: string;
    forceAuthn?: boolean;
    skipRequestCompression?: boolean;
    authnRequestBinding?: string;
    RACComparison?: 'exact' | 'minimum' | 'maximum' | 'better';
    providerName?: string;
    passive?: boolean;
    idpIssuer?: string;
    audience?: string;
    scoping?: SamlScopingConfig;
    validateInResponseTo?: boolean;
    requestIdExpirationPeriodMs?: number;
    cacheProvider?: CacheProvider;
    name?: string;
    passReqToCallback?: boolean;
    logoutUrl?: string;
    additionalLogoutParams?: any;
    logoutCallbackUrl?: string;
}
export interface SamlScopingConfig {
    idpList: SamlIDPListConfig[];
    proxyCount?: number;
    requesterId?: string[];
}
export declare type XMLValue = string | number | boolean | null | XMLObject | XMLValue[];
export declare type XMLObject = {
    [key: string]: XMLValue;
};
export declare type XMLInput = XMLObject;
export interface AuthorizeRequestXML {
    'samlp:AuthnRequest': XMLInput;
}
export interface LogoutRequestXML {
    'samlp:LogoutRequest': {
        'saml:NameID': XMLInput;
        [key: string]: XMLValue;
    };
}
export interface ServiceMetadataXML {
    EntityDescriptor: {
        [key: string]: XMLValue;
        SPSSODescriptor: XMLObject;
    };
}
export interface AudienceRestrictionXML {
    Audience?: XMLObject[];
}
export declare type XMLOutput = Record<string, any>;
export interface SamlIDPListConfig {
    entries: SamlIDPEntryConfig[];
    getComplete?: string;
}
export interface SamlIDPEntryConfig {
    providerId: string;
    name?: string;
    loc?: string;
}
export declare type Profile = {
    issuer?: string;
    sessionIndex?: string;
    nameID?: string;
    nameIDFormat?: string;
    nameQualifier?: string;
    spNameQualifier?: string;
    ID?: string;
    mail?: string;
    email?: string;
    ['urn:oid:0.9.2342.19200300.100.1.3']?: string;
    getAssertionXml(): string;
    getAssertion(): Record<string, unknown>;
    getSamlResponseXml(): string;
} & {
    [attributeName: string]: unknown;
};
export interface RequestWithUser extends express.Request {
    samlLogoutRequest: any;
    user?: Profile;
}
export declare type VerifiedCallback = (err: Error | null, user?: Record<string, unknown>, info?: Record<string, unknown>) => void;
export declare type VerifyWithRequest = (req: express.Request, profile: Profile | null | undefined, done: VerifiedCallback) => void;
export declare type VerifyWithoutRequest = (profile: Profile | null | undefined, done: VerifiedCallback) => void;
