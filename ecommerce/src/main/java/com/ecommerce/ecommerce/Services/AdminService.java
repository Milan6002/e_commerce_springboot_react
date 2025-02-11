package com.ecommerce.ecommerce.Services;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Model.CategoryModel;
import com.ecommerce.ecommerce.Model.ProductModel;

public interface AdminService {
    
    //Category Services
    String addCategory(CategoryModel categoryModel);
    List<CategoryModel> getAllCategory();
    String deleteCategory(Long category_id);
    String updateCategory(CategoryModel categoryModel,Long category_id);
    CategoryModel getCategoryById(Long category_id);


    //Product Services
    String addProducts(ProductModel productModel,MultipartFile[] image) throws IOException;
    List<ProductModel> getAllProduct();
    String deleteProduct(Long product_id);
    String updateProduct(Long product_id,ProductModel productModel,MultipartFile[] images) throws IOException;
    ProductModel getProductById(Long product_id);
    List<ProductModel> getProductByCategory(Long category_id);

}
