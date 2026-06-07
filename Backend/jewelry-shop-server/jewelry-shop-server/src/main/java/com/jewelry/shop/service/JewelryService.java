package com.jewelry.shop.service;

import com.jewelry.shop.dto.ServiceRequest;
import com.jewelry.shop.repository.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class JewelryService {

    private final ServiceRepository serviceRepository;

    public JewelryService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<com.jewelry.shop.entity.Service> getAll() {
        return serviceRepository.findAll();
    }

    public com.jewelry.shop.entity.Service getById(Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));
    }

    @Transactional
    public com.jewelry.shop.entity.Service create(ServiceRequest request) {
        // Kiểm tra xem tên dịch vụ đã tồn tại chưa
        if (serviceRepository.existsByServiceName(request.getServiceName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên dịch vụ gia công đã tồn tại");
        }

        // Tạo mới dịch vụ bằng Builder
        com.jewelry.shop.entity.Service newService = com.jewelry.shop.entity.Service.builder()
                .serviceName(request.getServiceName())
                .basePrice(request.getBasePrice())
                .unitName(request.getUnitName())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        return serviceRepository.save(newService);
    }

    @Transactional
    public com.jewelry.shop.entity.Service update(Integer id, ServiceRequest request) {
        com.jewelry.shop.entity.Service existingService = getById(id);

        // Nếu cập nhật tên mới, phải kiểm tra xem tên đó có bị trùng với dịch vụ khác không
        if (request.getServiceName() != null && !existingService.getServiceName().equals(request.getServiceName())) {
            if (serviceRepository.existsByServiceName(request.getServiceName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên dịch vụ gia công đã tồn tại");
            }
            existingService.setServiceName(request.getServiceName());
        }

        if (request.getBasePrice() != null) existingService.setBasePrice(request.getBasePrice());
        if (request.getUnitName() != null) existingService.setUnitName(request.getUnitName());
        if (request.getStatus() != null) existingService.setStatus(request.getStatus());

        return serviceRepository.save(existingService);
    }

    @Transactional
    public void delete(Integer id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ để xóa");
        }
        serviceRepository.deleteById(id);
    }
}