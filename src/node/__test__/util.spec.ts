import { writeFile } from '../util';
import { parseBlockTypeAvatar } from '../Activity/Avatar'
const LRUCache = require('lru-cache')

const userInfoCache = new LRUCache({
    max: 65535
})

describe('node util(writeFile)', () => {
    test('服务器返回相同的连续时间', async () => {
        userInfoCache.set('a', 9999)
        expect(userInfoCache.get('a')).toEqual(9999)
        writeFile(process.cwd(), { test: 'test' })
    })
})
