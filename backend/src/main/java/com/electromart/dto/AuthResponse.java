package com.electromart.dto;

import com.electromart.entity.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private Long userId;

    public AuthResponse(String token, User user) {
        this.token    = token;
        this.email    = user.getEmail();
        this.fullName = user.getFullName();
        this.role     = user.getRole().name();
        this.userId   = user.getId();
    }
}
