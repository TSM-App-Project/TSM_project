package com.jewelry.shop.repository;

import com.jewelry.shop.entity.RevenueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevenueReportRepository extends JpaRepository<RevenueReport, Integer> {
}
