package com.ecommerce.ecommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.CategoryEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
    
}
