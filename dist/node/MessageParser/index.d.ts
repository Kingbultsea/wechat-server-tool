import { UserInfo } from '../server';
export declare function sendContent(toUser: any, content: any, serveAccessToken: any, type: 'voice' | 'video' | 'image' | 'text'): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid, platFormName }: {
    serveAccessToken: string;
    uid: string;
    platFormName: string;
}): Promise<UserInfo | undefined>;
