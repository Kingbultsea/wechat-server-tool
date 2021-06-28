export declare const userInfoCache: any;
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
