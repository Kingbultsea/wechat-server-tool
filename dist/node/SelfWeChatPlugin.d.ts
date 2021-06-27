import { Plugin } from './server';
import DATA from "../../DATA.json";
export { DATA };
export declare let EnctypeTicket: any;
declare const SelfWeChatPlugin: Plugin;
export declare function getComponentAccessToken({ appid, secret, enctypeTicket }?: Record<string, string>): Promise<string>;
export declare function getPreCode({ appid, access_token }?: Record<string, string>): Promise<void>;
export default SelfWeChatPlugin;
