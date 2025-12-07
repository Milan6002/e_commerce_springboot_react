package com.ecommerce.ecommerce.Services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommerce.Entity.CategoryEntity;
import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Entity.ProductImageEntity;
import com.ecommerce.ecommerce.Entity.TypeEntity;
import com.ecommerce.ecommerce.Model.CategoryModel;
import com.ecommerce.ecommerce.Model.ProductModel;
import com.ecommerce.ecommerce.Model.TypeModel;
import com.ecommerce.ecommerce.Repository.CategoryRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Repository.TypeRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AdminServiceImplement implements AdminService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    TypeRepository typeRepository;

    @Override
    public String addCategory(CategoryModel categoryModel) {
        if (validateCategoryName(categoryModel.getCategory_name())) {
            CategoryEntity categoryEntity = new CategoryEntity();
            BeanUtils.copyProperties(categoryModel, categoryEntity);
            categoryRepository.save(categoryEntity);
            return "Category Added Successfully";
        } else {
            throw new RuntimeException("Invalid name of Category");
        }
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
        CategoryEntity categoryEntity = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
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
            productModel.setProduct_brand(allProductList.getProduct_brand());
            productModel.setProduct_color(allProductList.getProduct_color());
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
        if (productModel.getQuantity() != null) {
            existingProduct.setQuantity(productModel.getQuantity());
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

            existingProduct.getProduct_images().clear(); // If you want to remove all images
            existingProduct.getProduct_images().addAll(newImages);
            newImages.forEach(image -> image.setProduct(existingProduct));
        }

        productRepository.save(existingProduct);
        return "Product Updated Successfully";
    }

    @Override
    public ProductModel getProductById(Long product_id) {
        ProductEntity getProductByid = productRepository.findById(product_id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

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
        CategoryEntity categoryEntity = categoryRepository.findById(category_id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        List<ProductEntity> productByCategory = productRepository.findByCategory(categoryEntity);
        List<ProductModel> listOfProduct = new ArrayList<>();
        for (ProductEntity productEntity : productByCategory) {

            ProductModel productModel = new ProductModel();
            BeanUtils.copyProperties(productEntity, productModel);
            productModel.setCategory_id(productEntity.getCategory().getCategory_id());
            // Convert List<ProductImageEntity> to List<byte[]>
            List<byte[]> imageList = productEntity.getProduct_images()
                    .stream()
                    .map(ProductImageEntity::getImage)
                    .toList();

            productModel.setProduct_images(imageList); // Set multiple images
            listOfProduct.add(productModel);
        }
        return listOfProduct;
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    private boolean validateCategoryName(String name) {
        return name != null && !name.isEmpty();
    }

    @Override
    public String addType(TypeModel typeModel) {
        TypeEntity typeEntity = new TypeEntity();
        BeanUtils.copyProperties(typeModel, typeEntity);
        typeEntity.setCategory(categoryRepository.findById(typeModel.getCategory_id()).get());
        typeRepository.save(typeEntity);
        return "Type Added Successfully";
    }

    @Override
    public String updateType(TypeModel typeModel, Long type_id) {
        TypeEntity typeEntity = typeRepository.findById(type_id).get();
        typeEntity.setType_name(typeModel.getType_name());
        typeRepository.save(typeEntity);
        return "Type Updated Successfully";
    }

    @Override
    public TypeModel getTypeById(Long type_id) {
        TypeEntity typeEntity = typeRepository.findById(type_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found"));

        TypeModel typeModel = new TypeModel();
        BeanUtils.copyProperties(typeEntity, typeModel);
        return typeModel;
    }

    @Override
    public List<TypeModel> getAllType() {
        List<TypeEntity> typeEntity = typeRepository.findAll();
        List<TypeModel> typeModels = new ArrayList<>();
        for (TypeEntity type : typeEntity) {
            TypeModel typeModel = new TypeModel();
            typeModel.setType_id(type.getType_id());
            typeModel.setType_name(type.getType_name());
            typeModels.add(typeModel);
        }
        return typeModels;
    }

    @Override
    public String deleteType(Long type_id) {
        typeRepository.deleteById(type_id);
        return "Type Deleted Successfully";
    }
}
