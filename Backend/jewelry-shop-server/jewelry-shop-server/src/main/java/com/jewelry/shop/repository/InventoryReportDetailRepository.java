package com.jewelry.shop.repository;

import com.jewelry.shop.entity.InventoryReportDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryReportDetailRepository extends JpaRepository<InventoryReportDetail, Integer> {
	List<InventoryReportDetail> findByInventoryReport_ReportId(Integer reportId);
}
