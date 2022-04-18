const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

const VALID_IMAGE_EXTS = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.jp2', '.tiff', '.avif', '.heif']

function getImagesInDir(dirpath) {
  var images = []
  fs.readdirSync(dirpath).forEach(file => {
    var ext = path.extname(file)
    if (!ext || !ext.length) {
      console.log('Not file', file)
      return
    }
    if (!VALID_IMAGE_EXTS.includes(ext.toLowerCase())) {
      console.warn(`WARN: Non-image file found in directory "${file}"`)
    } else {
      images.push(path.join(dirpath, file))
    }
  })
  return images
}

function ensureDir(dirpath) {
  try {
    fs.accessSync(dirpath)
  } catch (e) {
    console.log(`Creating output folder "${dirpath}"`)
    fs.mkdirSync(dirpath)
  }
}

module.exports.run = async (options) => {
  const INPUT_DIR = options.input // Directory of images you want to resize
  const OUTPUT_DIR = options.output // Directory where resized images will be outputted 
  const RESIZE_WIDTH = options.width || 1500
  const JPEG_QUALITY = options.quality || 90

  var images = getImagesInDir(INPUT_DIR)
  ensureDir(OUTPUT_DIR) // Make sure output directory is created

  for (let i = 0; i < images.length; i++) {
    const _image = images[i]
    var fileName = path.basename(_image, path.extname(_image))
    var outputPath = path.join(OUTPUT_DIR, `${fileName}.jpg`).toLowerCase().split(' ').join('_')
    await sharp(_image).resize({ width: RESIZE_WIDTH }).jpeg({ quality: JPEG_QUALITY }).toFile(outputPath)
    console.log(`Resized image "${outputPath}"`)
  }
}
