const getPostData = (ctx: any) => {
    return new Promise(function (resolve, reject) {
        try {
            let str = ''
            ctx.req.on('data', function (data: any) {
                str += data;
            })
            ctx.req.on('end', function () {
                resolve(str)
            })
        }catch (e) {
            reject(e)
        }
    })
}

export { getPostData }
