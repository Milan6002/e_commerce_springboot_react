package com.ecommerce.ecommerce.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ecommerce.ecommerce.Entity.PurchaseOrder;
@Repository

public interface PurchaseRepo extends JpaRepository<PurchaseOrder, Long> {
    
}
    

