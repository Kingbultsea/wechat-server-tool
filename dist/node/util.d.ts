declare const getPostData: (ctx: any) => Promise<string>;
declare const writeFile: (ROOT: string | undefined, data: Record<any, any>) => void;
declare const getData: (ctx: any, encrypt: any, tagName?: string | undefined) => Promise<{
    result: any;
    bodyXML: any;
}>;
export { getPostData, writeFile, getData };
