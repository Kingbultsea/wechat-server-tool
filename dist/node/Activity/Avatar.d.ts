export declare function parseBlockTypeAvatar({ root, frameName, userPicUrl, dir }?: {
    root?: any;
    frameName?: any;
    userPicUrl?: string;
    dir?: string;
}): Promise<unknown>;
declare function avatarPlugins({ targetInfo, uid, frameName, root, dir, index }?: any): Promise<"" | undefined>;
export default avatarPlugins;
