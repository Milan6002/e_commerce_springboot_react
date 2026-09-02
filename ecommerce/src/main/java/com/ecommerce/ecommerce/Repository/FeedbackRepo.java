package com.ecommerce.ecommerce.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.ecommerce.Entity.FeedbackEntity;

@Repository
public interface FeedbackRepo extends JpaRepository<FeedbackEntity, Long> {
}
