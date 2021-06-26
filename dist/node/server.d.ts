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
    appid: string;
    secret: string;
    app?: Koa;
    type: 'express' | 'koa';
    Router: any;
}
export declare const internalPlugins: Plugin[];
export declare function createServer({ root, appid, secret, plugins }?: ServerConfig): Server;
