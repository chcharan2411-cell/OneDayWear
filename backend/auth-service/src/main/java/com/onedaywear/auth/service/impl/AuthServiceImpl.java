package com.onedaywear.auth.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onedaywear.auth.client.NotificationClient;
import com.onedaywear.auth.dto.ChangePasswordRequest;
import com.onedaywear.auth.dto.LoginRequest;
import com.onedaywear.auth.dto.LoginResponse;
import com.onedaywear.auth.dto.NotificationRequest;
import com.onedaywear.auth.dto.RegisterRequest;
import com.onedaywear.auth.dto.RegisterResponse;
import com.onedaywear.auth.dto.RegisterVerifyRequest;
import com.onedaywear.auth.dto.UpdateRoleRequest;
import com.onedaywear.auth.dto.UserProfileResponse;
import com.onedaywear.auth.dto.UserResponse;
import com.onedaywear.auth.entity.PendingRegistration;
import com.onedaywear.auth.entity.Role;
import com.onedaywear.auth.entity.User;
import com.onedaywear.auth.exception.UserAlreadyExistsException;
import com.onedaywear.auth.repository.PendingRegistrationRepository;
import com.onedaywear.auth.repository.UserRepository;
import com.onedaywear.auth.service.AuthService;
import com.onedaywear.auth.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final NotificationClient notificationClient;

    private final SecureRandom secureRandom = new SecureRandom();

    public AuthServiceImpl(
            UserRepository userRepository,
            PendingRegistrationRepository pendingRegistrationRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            NotificationClient notificationClient) {

        this.userRepository = userRepository;
        this.pendingRegistrationRepository =
                pendingRegistrationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.notificationClient = notificationClient;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid Email or Password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                token,
                "Login Successful",
                user.getRole().name()
        );
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        // Check if email already belongs to a registered user
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email already exists");
        }

        // Check if phone already belongs to a registered user
        if (userRepository.existsByPhoneNumber(
                request.getPhoneNumber())) {

            throw new UserAlreadyExistsException(
                    "Phone Number already exists");
        }

        /*
         * Remove any previous pending registration
         * for this email.
         */
        pendingRegistrationRepository
                .deleteByEmail(request.getEmail());

        // Generate 6-digit OTP
        String otp = generateOtp();

        /*
         * Store registration temporarily.
         *
         * Password is encoded before storing.
         */
        PendingRegistration pendingRegistration =
                PendingRegistration.builder()
                        .fullName(request.getFullName())
                        .email(request.getEmail())
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()))
                        .phoneNumber(request.getPhoneNumber())
                        .otp(otp)
                        .otpExpiry(
                                LocalDateTime.now()
                                        .plusMinutes(5))
                        .createdAt(LocalDateTime.now())
                        .build();

        pendingRegistrationRepository.save(
                pendingRegistration);

        /*
         * Create notification request for
         * Notification Service.
         */
        NotificationRequest notificationRequest =
                NotificationRequest.builder()
                        .to(request.getEmail())
                        .customerName(request.getFullName())
                        .otp(otp)
                        .notificationType(
                                "EMAIL_VERIFICATION_OTP")
                        .build();

        try {

            /*
             * Auth Service -> Notification Service
             *
             * Notification Service will send
             * the OTP email.
             */
            notificationClient.sendEmail(
                    notificationRequest);

        } catch (Exception e) {

            /*
             * Log the REAL error so we can identify
             * whether the problem is:
             *
             * - Notification Service not running
             * - wrong port
             * - email configuration
             * - request mapping
             * - connection problem
             * - notification service exception
             */
            System.err.println(
                    "========================================");

            System.err.println(
                    "NOTIFICATION SERVICE ERROR");

            System.err.println(
                    "Email: " + request.getEmail());

            System.err.println(
                    "Error: " + e.getMessage());

            e.printStackTrace();

            System.err.println(
                    "========================================");

            /*
             * Since the OTP email was not sent,
             * remove the pending registration.
             */
            pendingRegistrationRepository
                    .deleteByEmail(request.getEmail());

            throw new RuntimeException(
                    "Unable to send verification email. Please try again.",
                    e);
        }

        return new RegisterResponse(
                "OTP sent successfully to your email");
    }

    @Override
    @Transactional
    public RegisterResponse verifyRegistrationOtp(
            RegisterVerifyRequest request) {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration request not found. Please register again."));

        /*
         * Check OTP expiry.
         */
        if (LocalDateTime.now().isAfter(
                pendingRegistration.getOtpExpiry())) {

            pendingRegistrationRepository
                    .deleteByEmail(request.getEmail());

            throw new RuntimeException(
                    "OTP has expired. Please register again.");
        }

        /*
         * Check OTP.
         */
        if (!pendingRegistration.getOtp()
                .equals(request.getOtp())) {

            throw new RuntimeException(
                    "Invalid OTP");
        }

        /*
         * Double-check email uniqueness.
         */
        if (userRepository.existsByEmail(
                pendingRegistration.getEmail())) {

            pendingRegistrationRepository
                    .deleteByEmail(request.getEmail());

            throw new UserAlreadyExistsException(
                    "Email already exists");
        }

        /*
         * Double-check phone uniqueness.
         */
        if (userRepository.existsByPhoneNumber(
                pendingRegistration.getPhoneNumber())) {

            pendingRegistrationRepository
                    .deleteByEmail(request.getEmail());

            throw new UserAlreadyExistsException(
                    "Phone Number already exists");
        }

        /*
         * Create actual user only after
         * successful OTP verification.
         */
        User user = User.builder()
                .fullName(
                        pendingRegistration.getFullName())
                .email(
                        pendingRegistration.getEmail())
                .password(
                        pendingRegistration.getPassword())
                .phoneNumber(
                        pendingRegistration.getPhoneNumber())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        /*
         * Registration is complete,
         * so remove temporary OTP record.
         */
        pendingRegistrationRepository
                .deleteByEmail(request.getEmail());

        return new RegisterResponse(
                "Email verified. User registered successfully");
    }

    private String generateOtp() {

        int otp =
                100000 +
                secureRandom.nextInt(900000);

        return String.valueOf(otp);
    }

    @Override
    public UserProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"));

        return new UserProfileResponse(
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().name()
        );
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getRole().name()
                ))
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"));

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().name()
        );
    }

    @Override
    public UserResponse updateUserRole(
            Long id,
            UpdateRoleRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"));

        user.setRole(request.getRole());

        userRepository.save(user);

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().name()
        );
    }

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Old Password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    public Long getUserCount() {
        return userRepository.count();
    }
}