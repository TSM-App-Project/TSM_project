package com.jewelry.shop.repository;

import com.jewelry.shop.entity.InventoryReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryReportRepository extends JpaRepository<InventoryReport, Integer> {
}
