package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "Products")
public class ProductEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long product_id;

    private String product_brand;
    private String product_name;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String product_color;
    private Long quantity;
    
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CategoryEntity category;
    
    private Long price;
    private Long discount;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImageEntity> product_images; // List of images
}
