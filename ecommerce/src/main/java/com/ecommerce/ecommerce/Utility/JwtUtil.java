package com.ecommerce.ecommerce.Utility;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.ecommerce.ecommerce.Entity.User;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String secret =
            "jhfuegshfuefjksdbfuefhweufgheufhdfjghuidr";

    private final long expiration =
            30L * 24 * 60 * 60 * 1000;

    private final Key key =
            Keys.hmacShaKeyFor(secret.getBytes());

    // Generate JWT with email + role
    public String generateToken(User user) {

        return Jwts.builder()
                .setSubject(user.getEmail())

                // IMPORTANT: Add role to JWT
                .claim("role", user.getRole())

                // Optional user information
                .claim("id", user.getId())

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        key,
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // Extract email
    public String extractUsername(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Extract role
    public String extractRole(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // Validate token
    public boolean validateToken(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }
}