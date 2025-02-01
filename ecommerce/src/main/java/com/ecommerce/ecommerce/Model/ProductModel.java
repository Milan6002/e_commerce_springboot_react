package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel {

    private Long product_id;
    private String product_name;
    private String description;
    private Long quantity;
    private Long price;
    private Long category_id;
    private byte[] product_image;

}
