declare function sendMediaDataCopy({ targetInfo, uid, content, root }?: any): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid, platFormName }: {
    serveAccessToken: string;
    uid: string;
    platFormName: string;
}): Promise<{
    name: string;
    picUrl: string;
} | undefined>;
export default sendMediaDataCopy;
