package com.ecommerce.ecommerce.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Model.ProductModel;
import com.ecommerce.ecommerce.Services.AdminService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class ProductControler {
    @Autowired
    AdminService adminService;

    @PostMapping("/addProduct")
    public String addProduct(@ModelAttribute ProductModel productModel, @RequestParam MultipartFile[] image)
            throws IOException {
        return adminService.addProducts(productModel, image);
    }

    @GetMapping("/getAllProduct")
    public List<ProductModel> getAllProduct() {
        return adminService.getAllProduct();
    }

    @GetMapping("/getProductById/{product_id}")
    public ProductModel getProductById(@PathVariable Long product_id) {
        return adminService.getProductById(product_id);
    }

    @DeleteMapping("/deleteProduct/{product_id}")
    public String deleteProduct(@PathVariable Long product_id) {
        return adminService.deleteProduct(product_id);
    }

    @PutMapping("/updateProduct/{product_id}")
    public String updateProduct(@PathVariable Long product_id, @ModelAttribute ProductModel productModel,
            @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {
        return adminService.updateProduct(product_id, productModel, images);
    }

    @GetMapping("/getProductByCategory/{category_id}")
    public List<ProductModel> getProductByCategory(@PathVariable Long category_id) {
        return adminService.getProductByCategory(category_id);
    }

}
