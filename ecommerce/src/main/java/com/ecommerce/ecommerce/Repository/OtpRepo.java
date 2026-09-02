package com.ecommerce.ecommerce.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.OtpEntity;

@Repository
public interface OtpRepo extends JpaRepository<OtpEntity, Long> {
    OtpEntity findTopByEmailOrderByExpiryTimeDesc(String email);
}
