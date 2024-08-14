export type TokenResponse = {
    access_token: string;
    expires_in: number;
    expires_on: number;
    id_token: string;
    id_token_expires_in: number;
    not_before: number;
    profile_info: string;
    refresh_token: string;
    refresh_token_expires_in: number;
    resource: string;
    scope: string;
    token_type: string;
};
