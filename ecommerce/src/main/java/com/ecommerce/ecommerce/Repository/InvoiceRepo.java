package com.ecommerce.ecommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;

@Repository
public interface InvoiceRepo extends JpaRepository<InvoiceEntity, Long> {
    InvoiceEntity findByOrderId(Long orderId);
}