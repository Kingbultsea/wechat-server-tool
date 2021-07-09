export declare function sendMediaContent(toUser: any, mediaId: any, serveAccessToken: any, type: any): Promise<unknown>;
export declare function getUserInfo({ serveAccessToken, uid, platFormName }: {
    serveAccessToken: string;
    uid: string;
    platFormName: string;
}): Promise<{
    name: string;
    picUrl: string;
} | undefined>;
