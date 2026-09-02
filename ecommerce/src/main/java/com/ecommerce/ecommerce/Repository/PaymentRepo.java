package com.ecommerce.ecommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.PaymentEntity;
import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentEntity, Long> {
    List<PaymentEntity> findByUserEmailIgnoreCase(String userEmail);
    PaymentEntity findByOrderId(Long orderId);
}
