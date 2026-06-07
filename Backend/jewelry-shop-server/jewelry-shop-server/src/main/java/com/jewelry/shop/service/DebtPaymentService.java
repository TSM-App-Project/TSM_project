package com.jewelry.shop.service;

import com.jewelry.shop.dto.DebtPaymentRequest;
import com.jewelry.shop.entity.DebtPayment;
import com.jewelry.shop.entity.Supplier;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.repository.DebtPaymentRepository;
import com.jewelry.shop.repository.SupplierRepository;
import com.jewelry.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DebtPaymentService {
    private final DebtPaymentRepository debtPaymentRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    public DebtPaymentService(DebtPaymentRepository debtPaymentRepository, SupplierRepository supplierRepository, UserRepository userRepository) {
        this.debtPaymentRepository = debtPaymentRepository;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
    }

    public List<DebtPayment> getAll() {
        return debtPaymentRepository.findAll();
    }

    public DebtPayment getById(Integer id) {
        return debtPaymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiếu quỹ"));
    }

    @Transactional
    public DebtPayment create(DebtPaymentRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhà cung cấp"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        DebtPayment payment = DebtPayment.builder()
                .supplier(supplier)
                .user(user)
                .amount(request.getAmount())
                .documentType(request.getDocumentType())
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "HOÀN THÀNH")
                .createdAt(LocalDateTime.now())
                .build();

        // Cập nhật công nợ nhà cung cấp
        if ("CHI".equalsIgnoreCase(request.getDocumentType())) {
            supplier.setTotalDebt(supplier.getTotalDebt().subtract(request.getAmount()));
        } else if ("THU".equalsIgnoreCase(request.getDocumentType())) {
            supplier.setTotalDebt(supplier.getTotalDebt().add(request.getAmount()));
        }

        supplierRepository.save(supplier);
        return debtPaymentRepository.save(payment);
    }
}