package com.ecommerce.ecommerce.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Model.WarehouseActionRequest;
import com.ecommerce.ecommerce.Model.WarehouseStockModel;
import com.ecommerce.ecommerce.Repository.ProductRepository;

@RestController
@RequestMapping("/api/warehouse")
@CrossOrigin("*")
public class WarehouseController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/stocks")
    public List<WarehouseStockModel> getAllStocks() {
        return productRepository.findAll().stream()
                .map(this::toStockModel)
                .collect(Collectors.toList());
    }

    @GetMapping("/stock/{productId}")
    public ResponseEntity<?> getStockByProductId(@PathVariable Long productId) {
        ProductEntity product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product Not Found");
        }
        return ResponseEntity.ok(toStockModel(product));
    }

    @PutMapping("/stock/update")
    public ResponseEntity<String> updateStock(@RequestBody WarehouseActionRequest request) {
        ProductEntity product = productRepository.findById(request.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product Not Found");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be greater than 0");
        }

        Long currentQty = product.getQuantity() == null ? 0L : product.getQuantity();
        product.setQuantity(currentQty + request.getQuantity());
        productRepository.save(product);

        return ResponseEntity.ok("Stock updated successfully");
    }

    @PutMapping("/stock/deliver")
    public ResponseEntity<String> deliverStock(@RequestBody WarehouseActionRequest request) {
        ProductEntity product = productRepository.findById(request.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product Not Found");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be greater than 0");
        }

        Long currentQty = product.getQuantity() == null ? 0L : product.getQuantity();
        if (request.getQuantity() > currentQty) {
            return ResponseEntity.badRequest().body("Insufficient stock");
        }

        product.setQuantity(currentQty - request.getQuantity());
        productRepository.save(product);

        return ResponseEntity.ok("Stock delivered successfully");
    }

    private WarehouseStockModel toStockModel(ProductEntity product) {
        WarehouseStockModel stock = new WarehouseStockModel();
        Long quantity = product.getQuantity() == null ? 0L : product.getQuantity();

        stock.setProductId(product.getProduct_id());
        stock.setProductName(product.getProduct_name());
        stock.setBrand(product.getProduct_brand());
        stock.setAvailableStock(quantity);
        stock.setStockStatus(quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK");

        return stock;
    }
}
