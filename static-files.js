const path = require('path');

const mime = require('mime');

const fs   = require('mz/fs');


// url: 类似 ’/static/‘
// dir： 类似 __dirname + '/static/'
function staticFiles(url, dir){
    return async (ctx , next) => {
        "use strict";
        // 获取path
        let rpath = ctx.request.path;
        // 判断path 是不是 url 开头的
        if (rpath.startsWith(url)){
            // 获取完整的路径
            let fp = path.join(dir, rpath.substring(url.length));

            // 判断文件是否存在
            if (await fs.exists(fp)){
                // 查找文件的mime
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并且赋值给response.body
                ctx.response.body = await fs.readFile(fp);
            }else{
                // 文件不存在
                ctx.response.status = 404;
            }
        
        }else{

            await next();
        }
    };

}

module.exports = staticFiles;