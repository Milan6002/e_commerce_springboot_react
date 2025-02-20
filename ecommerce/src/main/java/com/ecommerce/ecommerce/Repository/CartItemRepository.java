package com.ecommerce.ecommerce.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.ecommerce.Entity.CartEntity;
import com.ecommerce.ecommerce.Entity.CartItemEntity;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByCart(CartEntity cartEntity);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItemEntity c WHERE c.product.id = :productId")
    void deleteByProduct(@Param("productId") Long productId);
}
