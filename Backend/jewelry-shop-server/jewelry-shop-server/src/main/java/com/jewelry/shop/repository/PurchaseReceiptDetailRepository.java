package com.jewelry.shop.repository;

import com.jewelry.shop.entity.PurchaseReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseReceiptDetailRepository extends JpaRepository<PurchaseReceiptDetail, Integer> {
}
