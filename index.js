const fs = require('fs');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});

/**
 * 读取文件
 */
const getFileData = (src) => {
    return fs.readFileSync(src, 'utf8');
}
/**
 * 往指定文件中写入内容
 */
const writeFile = (destFile, content) => {
    fs.writeFileSync(destFile, content);
}
/**
 * 解析 markdown 文件
 */
const parse = (content) => {
    let contentArr = content.split('\n');
    let postTitle = contentArr[1].slice(7).trim();
    let date = contentArr[2].slice(6).trim();
    let author = contentArr[3].slice(8).trim();
    let mdBodyContent = contentArr.slice(5).join('\n');
    return {
        postTitle,
        date,
        author,
        mdBodyContent
    };
}

const data = parse(getFileData('./posts/about.md'));
console.log(data)