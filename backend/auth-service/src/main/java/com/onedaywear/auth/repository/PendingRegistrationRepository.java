package com.onedaywear.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.onedaywear.auth.entity.PendingRegistration;

public interface PendingRegistrationRepository
        extends JpaRepository<PendingRegistration, Long> {

    Optional<PendingRegistration> findByEmail(String email);

    boolean existsByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
}