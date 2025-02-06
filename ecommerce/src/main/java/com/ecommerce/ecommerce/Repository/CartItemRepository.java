package com.ecommerce.ecommerce.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.CartEntity;
import com.ecommerce.ecommerce.Entity.CartItemEntity;
import com.ecommerce.ecommerce.Entity.ProductEntity;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity,Long>{
    List<CartItemEntity> findByCart(CartEntity cartEntity);
    Optional<CartItemEntity> deleteByProduct(ProductEntity product);
}
