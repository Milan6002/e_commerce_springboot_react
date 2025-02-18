package com.ecommerce.ecommerce.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommerce.Model.CategoryModel;
import com.ecommerce.ecommerce.Services.AdminService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:8080/ecommerce")
public class CategoryController {

    @Autowired
    AdminService adminService;

    @PostMapping("/addCategory")
    public String addCategory(@RequestBody CategoryModel categoryModel) {
        return adminService.addCategory(categoryModel);
    }

    @GetMapping("/getCategory")
    public List<CategoryModel> getAllCategory() {
        return adminService.getAllCategory();
    }

    @GetMapping("/getCategoryById/{category_id}")
    public CategoryModel getMethodName(@PathVariable Long category_id) {
        return adminService.getCategoryById(category_id);
    }

    @DeleteMapping("/deleteCategory/{category_id}")
    public String deleteCategoryById(@PathVariable Long category_id) {
        return adminService.deleteCategory(category_id);
    }

    @PutMapping("/updateCategory/{category_id}")
    public String putMethodName(@PathVariable Long category_id, @RequestBody CategoryModel categoryModel) {
        return adminService.updateCategory(categoryModel, category_id);
    }
}
