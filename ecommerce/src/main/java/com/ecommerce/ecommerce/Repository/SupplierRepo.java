package com.ecommerce.ecommerce.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ecommerce.ecommerce.Entity.Supplier;

@Repository


public interface SupplierRepo extends JpaRepository<Supplier, Long> {
    Supplier findByEmail(String email);
}
