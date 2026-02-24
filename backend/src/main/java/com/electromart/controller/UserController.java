package com.electromart.controller;

import com.electromart.entity.User;
import com.electromart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(Map.of(
                        "id",       u.getId(),
                        "fullName", u.getFullName(),
                        "email",    u.getEmail(),
                        "phone",    u.getPhone() != null ? u.getPhone() : "",
                        "address",  u.getAddress() != null ? u.getAddress() : "",
                        "role",     u.getRole().name()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody Map<String, String> body) {
        return userRepository.findById(id)
                .map(user -> {
                    if (body.containsKey("fullName"))  user.setFullName(body.get("fullName"));
                    if (body.containsKey("phone"))     user.setPhone(body.get("phone"));
                    if (body.containsKey("address"))   user.setAddress(body.get("address"));
                    if (body.containsKey("password") && !body.get("password").isBlank()) {
                        user.setPassword(passwordEncoder.encode(body.get("password")));
                    }
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
