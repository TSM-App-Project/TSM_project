package com.jewelry.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<com.jewelry.shop.entity.Service, Integer> {

    // Bổ sung hàm kiểm tra trùng lặp tên dịch vụ
    boolean existsByServiceName(String serviceName);
}