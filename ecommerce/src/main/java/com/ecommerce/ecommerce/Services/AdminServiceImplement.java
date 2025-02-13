package com.ecommerce.ecommerce.Services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Entity.CategoryEntity;
import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Entity.ProductImageEntity;
import com.ecommerce.ecommerce.Model.CategoryModel;
import com.ecommerce.ecommerce.Model.ProductModel;
import com.ecommerce.ecommerce.Repository.CategoryRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;

@Service
public class AdminServiceImplement implements AdminService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public String addCategory(CategoryModel categoryModel) {
        CategoryEntity categoryEntity = new CategoryEntity();
        BeanUtils.copyProperties(categoryModel, categoryEntity);
        categoryRepository.save(categoryEntity);
        return "Category Added Successfully";
    }

    @Override
    public List<CategoryModel> getAllCategory() {
        List<CategoryEntity> categoryEntity = categoryRepository.findAll();
        List<CategoryModel> categoryModels = new ArrayList<>();
        for (CategoryEntity cateEntity : categoryEntity) {
            CategoryModel categoryModel = new CategoryModel();
            categoryModel.setCategory_id(cateEntity.getCategory_id());
            categoryModel.setCategory_name(cateEntity.getCategory_name());
            categoryModels.add(categoryModel);
        }
        return categoryModels;
    }

    @Override
    public String deleteCategory(Long category_id) {
        categoryRepository.deleteById(category_id);
        return "Category Deleted Successfully";
    }

    @Override
    public String updateCategory(CategoryModel categoryModel, Long category_id) {
        CategoryEntity categoryEntity = categoryRepository.findById(category_id).get();
        categoryEntity.setCategory_name(categoryModel.getCategory_name());
        categoryRepository.save(categoryEntity);
        return "Category Updated Successfully";
    }

    @Override
    public CategoryModel getCategoryById(Long id) {
        CategoryEntity categoryEntity = categoryRepository.findById(id).get();
        CategoryModel categoryModel = new CategoryModel();
        BeanUtils.copyProperties(categoryEntity, categoryModel);
        return categoryModel;
    }

    @Override
    public String addProducts(ProductModel productModel, MultipartFile[] product_images) throws IOException {
        CategoryEntity categoryEntity = categoryRepository.findById(productModel.getCategory_id())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        ProductEntity productEntity = new ProductEntity();
        BeanUtils.copyProperties(productModel, productEntity);
        productEntity.setCategory(categoryEntity);

        List<ProductImageEntity> images = new ArrayList<>();
        for (MultipartFile file : product_images) {
            ProductImageEntity imageEntity = new ProductImageEntity();
            imageEntity.setImage(file.getBytes());
            imageEntity.setProduct(productEntity);
            images.add(imageEntity);
        }

        productEntity.setProduct_images(images);

        productRepository.save(productEntity);
        return "Product Added Successfully";
    }

    @Override
    public List<ProductModel> getAllProduct() {

        List<ProductEntity> allProduct = productRepository.findAll();
        List<ProductModel> listOfProduct = new ArrayList<>();

        for (ProductEntity allProductList : allProduct) {
            ProductModel productModel = new ProductModel();
            productModel.setProduct_id(allProductList.getProduct_id());
            productModel.setProduct_name(allProductList.getProduct_name());
            productModel.setDescription(allProductList.getDescription());
            productModel.setQuantity(allProductList.getQuantity());
            productModel.setPrice(allProductList.getPrice());
            productModel.setCategory_id(allProductList.getCategory().getCategory_id());

            // Convert List<ProductImageEntity> to List<byte[]>
            List<byte[]> imageList = allProductList.getProduct_images()
                    .stream()
                    .map(ProductImageEntity::getImage)
                    .toList();

            productModel.setProduct_images(imageList); // Set multiple images

            listOfProduct.add(productModel);
        }

        return listOfProduct;
    }

    @Override
    public String deleteProduct(Long product_id) {
        productRepository.deleteById(product_id);
        return "Product Deleted Successfully";
    }

    @Override
    public String updateProduct(Long product_id, ProductModel productModel, MultipartFile[] images) throws IOException {
        ProductEntity existingProduct = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Copy only non-null properties
        if (productModel.getProduct_brand() != null) {
            existingProduct.setProduct_brand(productModel.getProduct_brand());
        }
        if (productModel.getProduct_name() != null) {
            existingProduct.setProduct_name(productModel.getProduct_name());
        }
        if (productModel.getPrice() != null) {
            existingProduct.setPrice(productModel.getPrice());
        }
        if (productModel.getDescription() != null) {
            existingProduct.setDescription(productModel.getDescription());
        }
        if (productModel.getDiscount() != null) {
            existingProduct.setDiscount(productModel.getDiscount());
        }
        if (productModel.getProduct_color() != null) {
            existingProduct.setProduct_color(productModel.getProduct_color());
        }
        CategoryEntity categoryEntity = categoryRepository.findById(productModel.getCategory_id()).get();
        if (productModel.getCategory_id() != null) {
            existingProduct.setCategory(categoryEntity);
        }

        // Update product images (if new images are provided)
        if (images != null && images.length > 0) {
            List<ProductImageEntity> newImages = new ArrayList<>();

            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    ProductImageEntity imageEntity = new ProductImageEntity();
                    imageEntity.setImage(image.getBytes());
                    imageEntity.setProduct(existingProduct);
                    newImages.add(imageEntity);
                }
            }

            // Option 1: Append new images to the existing ones
            // existingProduct.getProduct_images().addAll(newImages);

            // Option 2: Replace all images (It Will Delete ALl the old Image)
            // existingProduct.getProduct_images().clear();
            // existingProduct.setProduct_images(newImages);

            existingProduct.getProduct_images().clear(); // If you want to remove all images
            existingProduct.getProduct_images().addAll(newImages);
            newImages.forEach(image -> image.setProduct(existingProduct));
        }

        productRepository.save(existingProduct);
        return "Product Updated Successfully";
    }

    @Override
    public ProductModel getProductById(Long product_id) {
        ProductEntity getProductByid = productRepository.findById(product_id).get();
        ProductModel displayProductById = new ProductModel();
        BeanUtils.copyProperties(getProductByid, displayProductById);
        displayProductById.setCategory_id(getProductByid.getCategory().getCategory_id());

        List<byte[]> imageList = getProductByid.getProduct_images()
                .stream()
                .map(ProductImageEntity::getImage)
                .toList();
        displayProductById.setProduct_images(imageList);

        return displayProductById;
    }

    @Override
    public List<ProductModel> getProductByCategory(Long category_id) {
        CategoryEntity categoryEntity = categoryRepository.findById(category_id).get();
        List<ProductEntity> productByCategory = productRepository.findByCategory(categoryEntity);
        List<ProductModel> listOfProduct = new ArrayList<>();
        for (ProductEntity productEntity : productByCategory) {

            ProductModel productModel = new ProductModel();
            BeanUtils.copyProperties(productEntity, productModel);
            listOfProduct.add(productModel);
        }
        return listOfProduct;
    }

}
