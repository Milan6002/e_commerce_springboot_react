package com.ecommerce.ecommerce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("==================================================");
        System.out.println("EXECUTING DATABASE FIX: Expanding column sizes...");
        
        try {
            jdbcTemplate.execute("ALTER TABLE sales_order ALTER COLUMN product_name VARCHAR(2000)");
            System.out.println("✅ sales_order product_name column expanded!");
        } catch (Exception e) {
            System.out.println("⚠️ Could not alter sales_order: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE Products ALTER COLUMN product_name VARCHAR(2000)");
            System.out.println("✅ Products product_name column expanded!");
        } catch (Exception e) {
            System.out.println("⚠️ Could not alter Products: " + e.getMessage());
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE purchase_order ALTER COLUMN product_name VARCHAR(2000)");
            System.out.println("✅ purchase_order product_name column expanded!");
        } catch (Exception e) {
            System.out.println("⚠️ Could not alter purchase_order: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE invoice ALTER COLUMN product_name VARCHAR(2000)");
            System.out.println("✅ invoice product_name column expanded!");
        } catch (Exception e) {
            System.out.println("⚠️ Could not alter invoice: " + e.getMessage());
        }
        
        System.out.println("==================================================");
    }
}
