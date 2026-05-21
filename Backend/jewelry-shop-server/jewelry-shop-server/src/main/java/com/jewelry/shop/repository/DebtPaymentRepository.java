package com.jewelry.shop.repository;

import com.jewelry.shop.entity.DebtPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Integer> {
}
