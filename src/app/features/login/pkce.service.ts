import { Injectable } from '@angular/core';
import { encode as base64encode } from 'base64-arraybuffer';
import { CodeChallenge } from 'src/app/models/common/code-challenge.type';

@Injectable()
export class PkceService {
    private readonly encoder = new TextEncoder();
    private readonly charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

    async generate(): Promise<CodeChallenge> {
        const state = await this._generateState();
        const verifier = this._generateCodeVerifier();
        const challenge = await this._generateCodeChallenge(verifier);

        return {
            state,
            verifier,
            challenge,
        };
    }

    private _generateRandom(length: number = 43): string {
        let result = '';

        for (let i = 0; i < length; i++) {
            result += this.charMap.charAt(Math.floor(Math.random() * this.charMap.length));
        }

        return result;
    }

    private _generateState(): Promise<string> {
        return this._generateCodeChallenge(this._generateRandom(43));
    }

    private _generateCodeVerifier(): string {
        return this._generateRandom(43);
    }

    private async _generateCodeChallenge(codeVerifier: string): Promise<string> {
        const data = this.encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return this._toBase64Url(digest);
    }

    private _toBase64Url(digest: any): string {
        const base64Digest: string = base64encode(digest);
        return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
}
