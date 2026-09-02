package com.ecommerce.ecommerce.Model;

import lombok.Data;

@Data
public class WarehouseActionRequest {
    private Long productId;
    private Long quantity;
}
