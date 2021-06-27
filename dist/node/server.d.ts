/// <reference types="koa-bodyparser" />
/// <reference types="node" />
import { Server } from 'http';
import Koa from 'koa';
import _Router from 'koa-router';
export declare type Plugin = (ctx: PluginContext) => void;
export declare const Router: _Router<any, {}>;
export declare let ROOT: string;
export interface ServerConfig {
    root?: string;
    plugins?: Plugin[];
    appid?: string;
    secret?: string;
}
export interface PluginContext {
    encrypt: any;
    appid: string;
    secret: string;
    app?: Koa;
    type: 'express' | 'koa';
    Router: typeof Router;
    root?: string;
}
export declare const internalPlugins: Plugin[];
export declare function createServer({ root, appid, secret, plugins }?: ServerConfig): Server;
