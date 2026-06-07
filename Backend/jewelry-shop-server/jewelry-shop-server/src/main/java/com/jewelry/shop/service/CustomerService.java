package com.jewelry.shop.service;

import com.jewelry.shop.dto.CustomerRequest;
import com.jewelry.shop.entity.Customer;
import com.jewelry.shop.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer getById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
    }

    @Transactional
    public Customer create(CustomerRequest request) {
        Customer customer = new Customer();
        customer.setFullName(request.getFullName());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setDob(request.getDob());
        customer.setTotalPoints(request.getTotalPoints() == null ? 0 : request.getTotalPoints());
        customer.setMemberTier(request.getMemberTier() == null ? "Thành viên" : request.getMemberTier());
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Integer id, CustomerRequest request) {
        Customer customer = getById(id);
        if (request.getFullName() != null) {
            customer.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            customer.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getDob() != null) {
            customer.setDob(request.getDob());
        }
        if (request.getTotalPoints() != null) {
            customer.setTotalPoints(request.getTotalPoints());
        }
        if (request.getMemberTier() != null) {
            customer.setMemberTier(request.getMemberTier());
        }
        return customerRepository.save(customer);
    }

    @Transactional
    public void delete(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        customerRepository.deleteById(id);
    }
}
