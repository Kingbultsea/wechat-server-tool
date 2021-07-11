/// <reference types="koa-bodyparser" />
/// <reference types="koa-xml-body" />
/// <reference types="node" />
import { Server } from 'http';
import Koa from 'koa';
import _Router from 'koa-router';
import { FSWatcher } from 'chokidar';
import LRUCache from 'lru-cache';
export interface UserInfo {
    name: string;
    picUrl: string;
    openid: string;
    sex: string;
    all: any;
}
export declare const userInfoCache: LRUCache<string, UserInfo>;
export declare type Plugin = (ctx: PluginContext) => void;
export declare const Router: _Router<any, {}>;
export declare let ROOT: string;
export interface DataType {
    self: {
        Encrypt: string;
    };
    thirdPart: {
        appid: string;
        authorizer_access_token: string;
        refresh_authorizer_refresh_token: string;
        update: number;
        create: number;
        qrcode_url: string;
        name: string;
    }[];
}
export interface ServerConfig {
    root?: string;
    plugins?: Plugin[];
    appid?: string;
    secret?: string;
    encodingAESKey?: string;
    token?: string;
    DATA: DataType;
    input: string;
}
export interface PluginContext {
    encrypt: any;
    appid: string;
    secret: string;
    app?: Koa;
    type: 'koa';
    Router: typeof Router;
    root?: string;
    watcher: FSWatcher;
    DATA: DataType;
    input: string;
}
export declare const internalPlugins: Plugin[];
export declare function createServer({ root, appid, secret, plugins, encodingAESKey, token, DATA, input }: ServerConfig): Server;
