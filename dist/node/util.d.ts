declare const getPostData: (ctx: any) => Promise<string>;
declare const writeFile: (ROOT: string | undefined, data: Record<any, any>) => void;
export { getPostData, writeFile };
