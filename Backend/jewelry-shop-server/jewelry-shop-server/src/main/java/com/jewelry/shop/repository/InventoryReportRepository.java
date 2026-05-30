package com.jewelry.shop.repository;

import com.jewelry.shop.entity.InventoryReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InventoryReportRepository extends JpaRepository<InventoryReport, Integer> {
	Optional<InventoryReport> findByReportMonthAndReportYear(Integer reportMonth, Integer reportYear);
}
