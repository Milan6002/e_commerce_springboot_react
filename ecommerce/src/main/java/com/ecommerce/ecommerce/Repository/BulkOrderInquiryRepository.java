package com.ecommerce.ecommerce.Repository;

import com.ecommerce.ecommerce.Entity.BulkOrderInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BulkOrderInquiryRepository extends JpaRepository<BulkOrderInquiry, Long> {
}
