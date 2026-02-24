package com.electromart.controller;

import com.electromart.entity.CartItem;
import com.electromart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body) {
        try {
            Long userId    = Long.valueOf(body.get("userId").toString());
            Long productId = Long.valueOf(body.get("productId").toString());
            Integer qty    = Integer.valueOf(body.getOrDefault("quantity", 1).toString());
            CartItem item  = cartService.addToCart(userId, productId, qty);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateQty(@PathVariable Long cartItemId,
                                       @RequestBody Map<String, Integer> body) {
        try {
            CartItem item = cartService.updateQuantity(cartItemId, body.get("quantity"));
            return ResponseEntity.ok(item != null ? item : Map.of("message", "Item removed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long cartItemId) {
        try {
            cartService.removeFromCart(cartItemId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
