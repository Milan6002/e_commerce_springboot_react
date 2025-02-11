package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel {

    private Long product_id;
    private String product_brand;
    private String product_name;
    private String description;
    private String product_color;
    private Long quantity;
    private Long price;
    private Long category_id;
    private Long discount;
    private List<byte[]> product_images; // Changed from single byte[] to list
}
