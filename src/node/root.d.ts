declare module '*.json' {
    const value: any;
    export default value;
}

declare var __TEST__: boolean
declare var __CONFIG__: {
    data: string // 数据文件
    input: string // 入口文件
}
