package com.ecommerce.ecommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommerce.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
