const fs = require('fs');
const path = require('path');
const copyDir = require('copy-dir');
const markdown = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});

/**
 * 从指定路径读取文件内容
 */
const getFileData = (srcPath) => {
    return fs.readFileSync(srcPath, 'utf8');
}

const writeFile = (destPath, content) => {
    fs.writeFileSync(destPath, content);
}

const mkdirIfNotExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

/**
 * 解析单个 markdown 文件，获取元数据
 */
const parseMarkdownFile = (content) => {
    let contentArr = content.split('\n');
    let postTitle = contentArr[1].slice(7).trim();
    let date = contentArr[2].slice(6).trim();
    let author = contentArr[3].slice(8).trim();
    let bodyContent = markdown.render(contentArr.slice(5).join('\n'));
    return {
        "metaData": {
            postTitle,
            date,
            author
        },
        "bodyContent": bodyContent
    };
}
/**
 * 填充 post.html 模板文件
 */
const fillPostTemplate = (postHtml, parsedMdData) => {
    let bodyContent = parsedMdData.bodyContent;
    let { postTitle, date, author } = parsedMdData.metaData;
    let resHtml = postHtml.replace(/{{postTitle}}/g, postTitle)
        .replace('{{createdDate}}', date)
        .replace('{{author}}', author)
        .replace('{{content}}', bodyContent);
    return resHtml;
}

/**
 * 生成博文 html 文件
 */
const generatePostHtml = (postTempPath, srcDir, destDir) => {
    //获取源路径下需要进行解析的所有 md 文件名
    let postFiles = fs.readdirSync(srcDir);
    mkdirIfNotExists(destDir);
    let postsMeataData = postFiles.map(mdFileName => {
        let fullPath = path.join(srcDir, mdFileName);
        let parsedMdData = parseMarkdownFile(getFileData(fullPath));
        let resHtml = fillPostTemplate(getFileData(postTempPath), parsedMdData);
        let htmlFileName = mdFileName.replace('.md', '.html');
        let destFilePath = path.join(destDir, htmlFileName);
        writeFile(destFilePath, resHtml);
        parsedMdData.metaData.htmlFileName = htmlFileName;
        return parsedMdData.metaData;
    });
    return postsMeataData;
}

/**
 * 生成 index.html 文件
 */
const generateIndexHtml = (postsMeataData, indexTempPath, destDir, title) => {
    //将数组转成字符串
    let postListHtml = postsMeataData.map(post => {
        let { htmlFileName, postTitle, date, author } = post;
        return `
        <div class="index-post-wrapper">
          <a class="index-post-title" href="./${htmlFileName}">${postTitle}</a>
          <span class="date">${date} by ${author}</span>
        </div>`;
    }).join('');
    let indexContent = getFileData(indexTempPath);
    let resHtml = indexContent.replace(/{{title}}/g, title)
        .replace('{{postList}}', postListHtml);
    writeFile(path.join(destDir, 'index.html'), resHtml);
}

const generate = (templateBaseDir, postDir, destDir, title) => {
    let templateAssetsPath = path.join(templateBaseDir, 'assets');
    let destAssetsPath = path.join(destDir, 'assets')
    //资源文件复制
    copyDir.sync(templateAssetsPath, destAssetsPath);
    let indexTempPath = path.join(templateBaseDir, 'index.html');
    let postTempPath = path.join(templateBaseDir, 'post.html');
    //解析指定路径下的 md 文件，填充 post.html 模板，生成博文
    let postsMeataData = generatePostHtml(postTempPath, postDir, destDir);
    //根据博文的元信息，生成首页
    generateIndexHtml(postsMeataData, indexTempPath, destDir, title);
    console.log("generate successful!");
}


module.exports = { getFileData, writeFile, generate };