const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // const xxx = require('xxx'); -> import xxx from 'xxx';
    content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, 'import $1 from "$3";');
    
    // const { xxx, yyy } = require('xxx'); -> import { xxx, yyy } from 'xxx';
    content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\((['"`])([^'"`]+)\2\);?/g, 'import { $1 } from "$3";');

    // module.exports = xxx; -> export default xxx;
    content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, 'export default $1;');

    // exports.xxx = async (req, res, next) => -> export const xxx = async (req: any, res: any, next: any) =>
    content = content.replace(/exports\.([a-zA-Z0-9_]+)\s*=\s*async\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)\s*=>/g, 'export const $1 = async (req: any, res: any, next: any) =>');
    
    content = content.replace(/exports\.([a-zA-Z0-9_]+)\s*=\s*async\s*\(\s*req\s*,\s*res\s*\)\s*=>/g, 'export const $1 = async (req: any, res: any) =>');

    fs.writeFileSync(file, content);
});

console.log('Done converting CJS to ESM');
