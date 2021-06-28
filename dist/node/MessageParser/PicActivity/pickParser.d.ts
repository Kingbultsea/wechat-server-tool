import LRUCache from 'lru-cache';
interface UserInfoCache {
    name: string;
    picUrl: string;
    unionid: string;
    sex: string;
    all: any;
}
export declare const userInfoCache: LRUCache<string, UserInfoCache>;
declare function sendMediaDataCopy({ targetInfo, uid, root, frameName, dir }?: any): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid, platFormName }: {
    serveAccessToken: string;
    uid: string;
    platFormName: string;
}): Promise<{
    name: string;
    picUrl: string;
} | undefined>;
export default sendMediaDataCopy;
