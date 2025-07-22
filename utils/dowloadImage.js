const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(imageUrl, outputFolder) {
    try {
        const urlObj = new URL(imageUrl);
        const fileName = path.basename(urlObj.pathname);
        const filePath = path.join(outputFolder, fileName);

        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream',
        });

        fs.mkdirSync(outputFolder, { recursive: true });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fileName));
            writer.on('error', (err) => {
                fs.unlink(filePath, () => { });

                reject(new Error('Write file fail.' + err.message));
            });
        });
    } catch (error) {
        throw new Error(`Upload file fail."${imageUrl}": ${error.message}`);
    }
}

module.exports = { downloadImage }
