package com.ecommerce.ecommerce.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.CartEntity;
import com.ecommerce.ecommerce.Entity.User;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    Optional<CartEntity> findByUser(User user);

    // NEW METHOD
    Optional<CartEntity> findByUser_Id(Long userId);

}