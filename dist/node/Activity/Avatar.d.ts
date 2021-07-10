export declare function parseBlockTypeAvatar({ root, frameName, userPicUrl, dir }?: {
    root?: any;
    frameName?: any;
    userPicUrl?: string;
    dir?: string;
}): Promise<unknown>;
declare function activityFlow({ targetInfo, uid, resolve, frameName, root, dir, index }?: any): Promise<void>;
export default activityFlow;
