import { writeFile } from '../util';

describe('node util(writeFile)', () => {
    test('服务器返回相同的连续时间', () => {
        writeFile(process.cwd(), { test: 'test' })
    })
})
