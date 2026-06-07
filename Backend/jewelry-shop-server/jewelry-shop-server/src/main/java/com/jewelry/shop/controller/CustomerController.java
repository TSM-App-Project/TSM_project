package com.jewelry.shop.controller;

import com.jewelry.shop.dto.CustomerRequest;
import com.jewelry.shop.entity.Customer;
import com.jewelry.shop.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    // Đã thay thế CustomerRepository bằng CustomerService
    private final CustomerService customerService;

    // Inject qua Constructor
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAll();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Integer id) {
        // Logic kiểm tra tồn tại (orElseThrow) đã được đem xuống viết bên trong Service
        return customerService.getById(id);
    }

    @PostMapping
    public Customer createCustomer(@Valid @RequestBody CustomerRequest request) {
        return customerService.create(request);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerRequest request) {
        return customerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Integer id) {
        // Tương tự, logic kiểm tra existsById đã được ẩn đi, Controller chỉ cần ra lệnh "xóa"
        customerService.delete(id);
    }
}