const path = require('path');
const { Product } = require('../db');
const { categoryService } = require('./categoryService');
const { uploadFile } = require('../utils/file-upload');

class productService {
    static async addProduct({ newProduct, thumbnailFile, contentFile }) {
        const uploadDirectory = path.join('public', 'upload', 'product');
        const [thumbnailInfo, contentInfo] = await Promise.all([
            uploadFile(thumbnailFile, uploadDirectory),
            uploadFile(contentFile, uploadDirectory),
        ]);

        newProduct.thumbnailUsrFileName = thumbnailInfo.userFileName;
        newProduct.thumbnailSrvFileName = thumbnailInfo.serverFileName;
        newProduct.contentUsrFileName = contentInfo.userFileName;
        newProduct.contentSrvFileName = contentInfo.serverFileName;

        const category = await categoryService.findCategory(newProduct.categoryId);

        if (!category) {
            const error = new Error('카테고리를 찾을 수 없습니다.');
            error.statusCode = 400;
            throw error;
        }

        newProduct.category = category;

        return await Product.create(newProduct);
    }

    static async findAllProducts() {
        return await Product.find({});
    }

    static async findProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.statusCode = 400;
            throw error;
        }
        return await Product.findById(id);
    }

    static async removeProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('상품 Id 값이 유효하지 않습니다.');
            error.statusCode = 400;
            throw error;
        }
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = { productService };
