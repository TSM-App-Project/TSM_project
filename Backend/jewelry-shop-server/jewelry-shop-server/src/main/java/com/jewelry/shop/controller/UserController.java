package com.jewelry.shop.controller;

import com.jewelry.shop.dto.LoginRequest;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        // Trả về thẳng chuỗi Token JWT
        String token = userService.login(request);
        return ResponseEntity.ok(token);
    }

    @GetMapping
    public java.util.List<User> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping
    public User createUser(@Valid @RequestBody com.jewelry.shop.dto.UserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id, @Valid @RequestBody com.jewelry.shop.dto.UserRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.delete(id);
    }
}
