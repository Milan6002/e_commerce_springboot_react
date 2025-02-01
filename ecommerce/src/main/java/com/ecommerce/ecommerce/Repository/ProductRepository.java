package com.ecommerce.ecommerce.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.CategoryEntity;
import com.ecommerce.ecommerce.Entity.ProductEntity;

@Repository
public interface ProductRepository extends  JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategory(CategoryEntity category);
}
