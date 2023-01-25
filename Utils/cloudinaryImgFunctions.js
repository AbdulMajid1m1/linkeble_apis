const cloudinary = require("./cloudinary.config");


const deleteImage = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.log(error);
    }
}


const uploadImages = async (images) => {
    const urls = []
    if (Array.isArray(images)) {

        for (const image of images) {
            try {

                const newPath = await cloudinary_js_config.uploader.upload(image.tempFilePath, { folder: 'ServiceImages' })
                // urls.push(newPath.url)
                urls.push({ imgUrl: newPath.secure_url, publicId: newPath.public_id })
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message })

            }

        }
    }
    else {
        try {
            const newPath = await cloudinary.uploader.upload(images.tempFilePath, { folder: 'ServiceImages' })
            urls.push({ imgUrl: newPath.secure_url, publicId: newPath.public_id })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    }

    return urls
}
module.exports = {
    deleteImage
    , uploadImages
};