package com.ecommerce.ecommerce.Entity;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table
@Entity
@Data
public class TypeEntity {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long type_id;
   private String type_name;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CategoryEntity category; // This is the new field for types associated with this category

}
