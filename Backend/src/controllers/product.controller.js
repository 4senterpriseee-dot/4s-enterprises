import { uploadFile, deleteFile } from "../services/storage.service.js";
import productModel from "../models/product.model.js";

const VALID_SUBCATEGORIES = {
  tops: ["tshirts", "shirts", "tanks"],
  bottoms: ["jeans", "trousers"],
};

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      priceAmount,
      priceCurrency,
    } = req.body;
    const sellerId = req.user._id;

    const normalizedName = name?.trim();

    const exists = await productModel.findOne({
      name: { $regex: new RegExp(`^${escapeRegExp(normalizedName)}$`, "i") },
      seller: sellerId,
    });

    if (exists) {
      return res.status(400).json({
        message: "A product with this name already exists",
        success: false,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
        success: false,
      });
    }

    const images = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "E-commerce",
            }),
          ),
        )
      : [];

    const product = await productModel.create({
      name: normalizedName,
      description,
      price: {
        amount: Math.round(Number(priceAmount)),
        currency: priceCurrency || "INR",
      },
      images,
      seller: sellerId,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const {
      name,
      description,
      priceAmount,
      priceCurrency,
    } = req.body;

    // update fields (only if provided)
    if (name) product.name = name.trim();
    if (description) product.description = description.trim();

    if (priceAmount !== undefined && priceAmount !== "") {
      product.price.amount = Math.round(Number(priceAmount));
    }

    if (priceCurrency) {
      product.price.currency = priceCurrency;
    }

    // handle new images (append)
    if (req.files?.length) {
      const uploaded = await Promise.all(
        req.files.map((file) =>
          uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
            folder: "E-commerce",
          })
        )
      );

      product.images.push(...uploaded);
    }

    await product.save();

    res.status(200).json({
      message: "Product updated",
      product,
      success: true,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function removeProductImage(req, res) {
  try {
    const { id } = req.params;
    const { fileId } = req.body;

    const product = await productModel.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const imageToRemove = product.images.find(img => img.fileId === fileId);
    if (!imageToRemove) {
      return res.status(400).json({ message: "Image not found in product", success: false });
    }

    if (imageToRemove.fileId) {
      await deleteFile(imageToRemove.fileId);
    }

    product.images = product.images.filter(img => img.fileId !== fileId);
    await product.save();

    res.status(200).json({ message: "Image removed", success: true, product });
  } catch (error) {
    console.error("Error removing image:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function getSellerProducts(req, res) {
  try {
    const sellerId = req.user._id;
    const products = await productModel.find({ seller: sellerId });

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllProducts(req, res) {
  try {
    const { q } = req.query;

    const filter = {
      ...(q?.trim() && { name: { $regex: q.trim(), $options: "i" } }),
    };

    const products = await productModel.find(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getProductDetails(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function addProductVariant(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // upload images
    const images = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "E-commerce",
            }),
          ),
        )
      : [];

    const { priceAmount, priceCurrency, stock } = req.body;

    const attributes = req.body.attributes
      ? JSON.parse(req.body.attributes)
      : {};

    const parsedVariantPriceAmount = Number(priceAmount);

    const finalPrice = {
      amount: Number.isFinite(parsedVariantPriceAmount)
        ? Math.round(parsedVariantPriceAmount)
        : product.price.amount,
      currency: priceCurrency || product.price.currency || "INR",
    };

    // normalize attributes (SAFE + USED)
    const normalize = (obj = {}) => {
      const plain = JSON.parse(JSON.stringify(obj));
      return JSON.stringify(
        Object.keys(plain)
          .sort()
          .reduce((acc, key) => {
            acc[key] = plain[key];
            return acc;
          }, {}),
      );
    };

    // duplicate check
    const isDuplicate = product.variants.some((v) => {
      return (
        normalize(v.attributes || {}) === normalize(attributes || {}) &&
        Number(v.price?.amount) === Number(finalPrice.amount)
      );
    });

    if (isDuplicate) {
      return res.status(400).json({
        message: "Variant already exists",
        success: false,
      });
    }

    const newVariant = {
      attributes,
      price: finalPrice,
      stock,
      images,
    };

    product.variants.push(newVariant);
    await product.save();

    return res.status(201).json({
      message: "Variant added successfully",
      success: true,
      variant: newVariant,
    });
  } catch (error) {
    console.error("Error adding product variant:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateVariant(req, res) {
  try {
    const { id, variantId } = req.params;
    const product = await productModel.findOne({ _id: id, seller: req.user._id });
    
    if (!product) return res.status(404).json({ message: "Product not found", success: false });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found", success: false });

    const { priceAmount, stock, attributes } = req.body;
    
    if (priceAmount !== undefined && priceAmount !== "") {
      variant.price.amount = Math.round(Number(priceAmount));
    }
    if (stock !== undefined && stock !== "") {
      variant.stock = Number(stock);
    }
    if (attributes !== undefined) {
      variant.attributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
    }

    await product.save();
    res.status(200).json({ message: "Variant updated", success: true, product, variant });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function deleteVariant(req, res) {
  try {
    const { id, variantId } = req.params;
    const product = await productModel.findOne({ _id: id, seller: req.user._id });
    
    if (!product) return res.status(404).json({ message: "Product not found", success: false });

    // Extract images to delete from storage if needed
    const variant = product.variants.id(variantId);
    if (variant && variant.images) {
      for (const img of variant.images) {
        if (img.fileId) {
          await deleteFile(img.fileId);
        }
      }
    }

    product.variants.pull(variantId);
    await product.save();

    res.status(200).json({ message: "Variant deleted", success: true, product });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
}

export async function searchProducts(req, res) {
  try {
    const { q, category } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({ products: [] });
    }

    const products = await productModel
      .find({
        name: { $regex: q.trim(), $options: "i" },
        ...(category ? { category } : {}),
      })
      .limit(10)
      .select("name images price category");

    res.status(200).json({ products, success: true });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed", success: false });
  }
}
