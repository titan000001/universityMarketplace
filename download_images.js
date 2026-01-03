const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest);
            reject(err);
        });
    });
};

const images = [
    { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', name: 'textbook.jpg' },
    { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600', name: 'laptop.jpg' },
    { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600', name: 'desk.jpg' }
];

const downloadAll = async () => {
    console.log('Downloading demo images...');
    for (const img of images) {
        const dest = path.join(__dirname, 'public', 'images', 'demos', img.name);
        try {
            await download(img.url, dest);
            console.log(`✅ Downloaded ${img.name}`);
        } catch (err) {
            console.error(`❌ Failed to download ${img.name}:`, err);
        }
    }
};

downloadAll();
