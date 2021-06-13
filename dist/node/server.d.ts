/// <reference types="koa-bodyparser" />
/// <reference types="node" />
import { Server } from 'http';
import Koa from 'koa';
import _Router from 'koa-router';
export declare type Plugin = (ctx: PluginContext) => void;
export declare const Router: _Router<any, {}>;
export interface ServerConfig {
    root?: string;
    plugins?: Plugin[];
    appid?: string;
    secret?: string;
}
export interface PluginContext {
    root: string;
    appid: string;
    secret: string;
    app: Koa;
    server: Server;
    Router: typeof Router;
}
export declare function createServer({ appid, secret, root, plugins }?: ServerConfig): Server;
