import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'public', 'assets');

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

async function convertImages() {
    const files = getFiles(directoryPath);
    const imageFiles = files.filter(file => /\.(png|jpe?g)$/i.test(file));

    console.log(`Found ${imageFiles.length} images to convert.`);

    for (const file of imageFiles) {
        const ext = path.extname(file);
        const newFile = file.replace(ext, '.webp');

        try {
            await sharp(file)
                .webp({ quality: 80 })
                .toFile(newFile);

            console.log(`Converted: ${path.basename(file)} -> ${path.basename(newFile)}`);

            // Optional: Delete original file
            fs.unlinkSync(file);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }
    console.log('Conversion complete!');
}

convertImages();
