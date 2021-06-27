declare function sendMediaDataCopy({ targetInfo, uid, content, root }?: any): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid }: {
    serveAccessToken: string;
    uid: string;
}): Promise<{
    name: string;
    picUrl: string;
} | undefined>;
export default sendMediaDataCopy;
