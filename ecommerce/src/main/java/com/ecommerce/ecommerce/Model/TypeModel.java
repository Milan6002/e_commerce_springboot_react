package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypeModel {
    private Long type_id;  
    private String type_name;
    private Long category_id; // This is the new field for types associated with this category
}

