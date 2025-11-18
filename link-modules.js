const fs = require('fs');
const path = require('path');

function createNodeModulesLink(targetDirName='node_modules') {
    const source = path.join(__dirname, 'node_modules');
    const target = path.join(__dirname, 'public', targetDirName);
    
    try {
        // Check if source directory exists
        if (!fs.existsSync(source)) {
            throw new Error('node_modules directory does not exist, please run npm install first');
        }
        
        // Ensure public directory exists
        const publicDir = path.dirname(target);
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        
        // Check if target already exists
        if (fs.existsSync(target)) {
            const stats = fs.lstatSync(target);
            if (stats.isSymbolicLink()) {
		// If it's a symbolic link, remove it
                fs.unlinkSync(target); // 删除旧的符号链接
		console.log('Removed existing symbolic link');
            } else {
                throw new Error('Target exists and is not a symbolic link');
            }
        }
        
        // 确定链接类型
        let type = 'dir';
        if (process.platform === 'win32') {
            type = 'junction'; // Windows 推荐使用 junction
        }
        
        // 创建符号链接
        fs.symlinkSync(source, target, type);
        console.log(`node_modules symbolic link created successfully: ${target} -> ${source}`);
        
    } catch (error) {
        console.error('Failed to create symbolic link:', error.message);
    }
}

createNodeModulesLink('v');

