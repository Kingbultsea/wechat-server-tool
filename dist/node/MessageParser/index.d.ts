import { UserInfo } from '../server';
export declare function sendMediaContent(toUser: any, mediaId: any, serveAccessToken: any, type: any): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid, platFormName }: {
    serveAccessToken: string;
    uid: string;
    platFormName: string;
}): Promise<UserInfo | undefined>;
