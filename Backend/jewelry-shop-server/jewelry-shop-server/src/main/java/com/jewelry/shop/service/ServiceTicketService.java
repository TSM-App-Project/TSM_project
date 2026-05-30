package com.jewelry.shop.service;

import com.jewelry.shop.dto.ServiceTicketRequest;
import com.jewelry.shop.entity.Customer;
import com.jewelry.shop.entity.ServiceTicket;
import com.jewelry.shop.entity.ServiceTicketDetail;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.repository.CustomerRepository;
import com.jewelry.shop.repository.ServiceRepository;
import com.jewelry.shop.repository.ServiceTicketDetailRepository;
import com.jewelry.shop.repository.ServiceTicketRepository;
import com.jewelry.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceTicketService {
    private final ServiceTicketRepository serviceTicketRepository;
    private final ServiceTicketDetailRepository serviceTicketDetailRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public ServiceTicketService(ServiceTicketRepository serviceTicketRepository,
                                ServiceTicketDetailRepository serviceTicketDetailRepository,
                                CustomerRepository customerRepository,
                                UserRepository userRepository,
                                ServiceRepository serviceRepository) {
        this.serviceTicketRepository = serviceTicketRepository;
        this.serviceTicketDetailRepository = serviceTicketDetailRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public ServiceTicket create(ServiceTicketRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ServiceTicket ticket = new ServiceTicket();
        ticket.setCustomer(customer);
        ticket.setUser(user);
        if (request.getCreatedAt() != null) {
            ticket.setCreatedAt(request.getCreatedAt());
        }

        BigDecimal grandTotal = BigDecimal.ZERO;
        List<ServiceTicketDetail> details = new ArrayList<>();

        if (request.getDetails() != null) {
            for (ServiceTicketRequest.ServiceTicketDetailRequest item : request.getDetails()) {
                com.jewelry.shop.entity.Service service = serviceRepository.findById(item.getServiceId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

                BigDecimal servicePrice = item.getServicePrice() != null ? item.getServicePrice() : service.getBasePrice();
                BigDecimal extraCost = item.getExtraCost() != null ? item.getExtraCost() : BigDecimal.ZERO;
                int quantity = item.getQuantity() != null ? item.getQuantity() : 0;

                BigDecimal calculatedPrice = servicePrice.add(extraCost);
                BigDecimal subtotal = calculatedPrice.multiply(BigDecimal.valueOf(quantity));
                BigDecimal prepaid = item.getPrepaidAmount() != null ? item.getPrepaidAmount() : BigDecimal.ZERO;
                BigDecimal remaining = subtotal.subtract(prepaid);
                if (remaining.compareTo(BigDecimal.ZERO) < 0) {
                    remaining = BigDecimal.ZERO;
                }

                ServiceTicketDetail detail = new ServiceTicketDetail();
                detail.setServiceTicket(ticket);
                detail.setService(service);
                detail.setServicePrice(servicePrice);
                detail.setExtraCost(extraCost);
                detail.setQuantity(quantity);
                detail.setCalculatedPrice(calculatedPrice);
                detail.setSubtotal(subtotal);
                detail.setPrepaidAmount(prepaid);
                detail.setRemainingAmount(remaining);
                detail.setDeliveryDate(item.getDeliveryDate());
                if (item.getStatus() != null) {
                    detail.setStatus(item.getStatus());
                }

                grandTotal = grandTotal.add(subtotal);
                details.add(detail);
            }
        }

        ticket.setGrandTotal(grandTotal);
        ServiceTicket saved = serviceTicketRepository.save(ticket);
        for (ServiceTicketDetail detail : details) {
            detail.setServiceTicket(saved);
        }
        serviceTicketDetailRepository.saveAll(details);
        return saved;
    }
}
