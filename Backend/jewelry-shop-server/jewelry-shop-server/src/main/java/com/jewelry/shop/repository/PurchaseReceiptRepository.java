package com.jewelry.shop.repository;

import com.jewelry.shop.entity.PurchaseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseReceiptRepository extends JpaRepository<PurchaseReceipt, Integer> {
}
