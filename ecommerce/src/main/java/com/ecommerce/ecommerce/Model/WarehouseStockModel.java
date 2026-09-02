package com.ecommerce.ecommerce.Model;

import lombok.Data;

@Data
public class WarehouseStockModel {
    private Long productId;
    private String productName;
    private String brand;
    private Long availableStock;
    private String stockStatus;
}
