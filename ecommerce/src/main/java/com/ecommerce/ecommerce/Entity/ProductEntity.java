package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Products")
public class ProductEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long product_id;

    private String product_name;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Long quantity;
    
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CategoryEntity category;
    
    private Long price;
    
    @Lob
    private byte[] product_image;
}
