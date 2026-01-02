// utils/fileUtils.js
const fs = require('fs').promises;
const path = require('path');

const deleteFile = async (filePath) => {
    if (!filePath) return;

    try {
        // Construct absolute path. Assuming uploads are in 'public/uploads' or 'uploads'
        // Based on server.js: app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        // And controllers: imageUrl = `/uploads/${req.file.filename}`

        const filename = path.basename(filePath);
        const absolutePath = path.join(__dirname, '..', 'uploads', filename);

        await fs.access(absolutePath);
        await fs.unlink(absolutePath);
        console.log(`Successfully deleted file: ${absolutePath}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found, skipping deletion: ${filePath}`);
        } else {
            console.error(`Error deleting file: ${filePath}`, error);
        }
    }
};

module.exports = { deleteFile };
