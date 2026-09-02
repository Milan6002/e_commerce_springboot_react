package com.ecommerce.ecommerce.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ecommerce.ecommerce.Entity.PurchaseOrder;
import com.ecommerce.ecommerce.Repository.PurchaseRepo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/purchase")
@CrossOrigin("*")

public class PurchaseController {
      @Autowired
    private PurchaseRepo repo;

    @PostMapping
    public PurchaseOrder add(@RequestBody PurchaseOrder p){
        return repo.save(p);
    }

    @GetMapping
    public List<PurchaseOrder> getAll(){
        return repo.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        repo.deleteById(id);
    }
}
