package com.jewelry.shop.repository;

import com.jewelry.shop.entity.SupplierCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierCategoryRepository extends JpaRepository<SupplierCategory, Integer> {
    boolean existsByCategoryName(String categoryName);
}