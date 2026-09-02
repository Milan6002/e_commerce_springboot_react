package com.ecommerce.ecommerce.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ecommerce.ecommerce.Entity.SalesOrder;

@Repository

public interface SalesRepo extends JpaRepository<SalesOrder, Long> {}
