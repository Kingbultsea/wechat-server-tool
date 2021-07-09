import { Plugin } from '../server';
export declare const DATA: any;
export declare let EnctypeTicket: any;
declare const SelfWeChatPlugin: Plugin;
export declare function getComponentAccessToken({ appid, secret, enctypeTicket }?: Record<string, string>): Promise<string>;
export declare function getPreCode({ appid, access_token }?: Record<string, string>): Promise<unknown>;
export default SelfWeChatPlugin;
