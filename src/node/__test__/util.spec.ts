import { writeFile } from '../util';
import { parseBlockTypeAvatar } from '../Activity/Avatar'

describe('node util(writeFile)', () => {
    test('服务器返回相同的连续时间', async () => {
        const resultPath = await parseBlockTypeAvatar({ root: process.cwd(), frameName: '1.png', userPicUrl: 'http://thirdwx.qlogo.cn/mmopen/z8djpHic5fg2OhxQpiafs6icOlNDiaJfj3HicSbxGAKSxOhvADJG3WafgGj1g01p5mXrmDY8SSpshHtFScZEYhG0xmzHOez2H84jJ/132' })

        writeFile(process.cwd(), { test: 'test' })
    })
})
