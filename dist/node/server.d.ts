/// <reference types="koa-bodyparser" />
/// <reference types="koa-xml-body" />
/// <reference types="node" />
import { Server } from 'http';
import Koa from 'koa';
import _Router from 'koa-router';
import { FSWatcher } from 'chokidar';
import LRUCache from 'lru-cache';
interface UserInfoCache {
    name: string;
    picUrl: string;
    openid: string;
    sex: string;
    all: any;
}
export declare const userInfoCache: LRUCache<string, UserInfoCache>;
export declare type Plugin = (ctx: PluginContext) => void;
export declare const Router: _Router<any, {}>;
export declare let ROOT: string;
export interface ServerConfig {
    root?: string;
    plugins?: Plugin[];
    appid?: string;
    secret?: string;
    encodingAESKey?: string;
    token?: string;
}
export interface PluginContext {
    encrypt: any;
    appid: string;
    secret: string;
    app?: Koa;
    type: 'express' | 'koa';
    Router: typeof Router;
    root?: string;
    watcher: FSWatcher;
}
export declare const internalPlugins: Plugin[];
export declare function createServer({ root, appid, secret, plugins, encodingAESKey, token }?: ServerConfig): Server;
export {};
