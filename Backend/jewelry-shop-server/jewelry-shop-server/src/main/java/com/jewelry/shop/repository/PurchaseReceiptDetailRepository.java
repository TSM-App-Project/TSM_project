package com.jewelry.shop.repository;

import com.jewelry.shop.entity.PurchaseReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseReceiptDetailRepository extends JpaRepository<PurchaseReceiptDetail, Integer> {
	List<PurchaseReceiptDetail> findByPurchaseReceipt_PurchaseId(Integer purchaseId);
}
