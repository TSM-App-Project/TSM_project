package com.jewelry.shop.repository;

import com.jewelry.shop.entity.RevenueReportDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevenueReportDetailRepository extends JpaRepository<RevenueReportDetail, Integer> {
}
