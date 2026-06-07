package com.jewelry.shop.repository;

import com.jewelry.shop.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    // Bổ sung: Kiểm tra trùng mã số thuế hoặc tên nhà cung cấp
    boolean existsByTaxCode(String taxCode);
    boolean existsBySupplierName(String supplierName);
}