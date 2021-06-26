const getPostData = (ctx: any) => {
    return new Promise(function (resolve, reject) {
        try {
            let str = ''
            ctx.request.on('data', function (data: any) {
                str += data;
            })
            ctx.request.on('end', function () {
                resolve(str)
            })
        }catch (e) {
            reject(e)
        }
    })
}

export { getPostData }
