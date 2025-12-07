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

import com.ecommerce.ecommerce.Model.TypeModel;
import com.ecommerce.ecommerce.Services.AdminService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class TypeController {
    @Autowired
    AdminService adminService;

    @PostMapping("/addType")
    public String addType(@RequestBody TypeModel typeModel) {
        return adminService.addType(typeModel);
    }

    @PutMapping("/updateType/{type_id}")
    public String updateType(@RequestBody TypeModel typeModel, @PathVariable Long type_id) {
        return adminService.updateType(typeModel, type_id);
    }

    @GetMapping("/getTypeById/{type_id}")
    public TypeModel getTypeById(@PathVariable Long type_id) {
        return adminService.getTypeById(type_id);
    }

    @GetMapping("/getAllType")
    public List<TypeModel> getAllType() {
        return adminService.getAllType();
    }

    @DeleteMapping("/deleteType/{type_id}")
    public String deleteType(@PathVariable Long type_id) {
        return adminService.deleteType(type_id);
    }

}
