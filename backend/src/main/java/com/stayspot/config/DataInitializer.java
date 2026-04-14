package com.stayspot.config;

import com.stayspot.model.User;
import com.stayspot.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create or update admin user
        String adminUsername = "anmjain";
        String adminPassword = "AnmolJ14@";
        
        Optional<User> existingAdmin = userRepository.findByUsername(adminUsername);
        if (existingAdmin.isPresent()) {
            // Update existing admin
            User admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEmail("anmjain@stayspot.local");
            admin.setFullName("Administrator");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Updated admin user: username=anmjain password=AnmolJ14@");
        } else {
            // Check if there's an old admin to update
            Optional<User> oldAdmin = userRepository.findByUsername("admin");
            if (oldAdmin.isPresent()) {
                User admin = oldAdmin.get();
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setEmail("anmjain@stayspot.local");
                admin.setFullName("Administrator");
                userRepository.save(admin);
                System.out.println("Updated old admin to: username=anmjain password=AnmolJ14@");
            } else {
                // Create new admin
                User admin = User.builder()
                        .username(adminUsername)
                        .email("anmjain@stayspot.local")
                        .password(passwordEncoder.encode(adminPassword))
                        .fullName("Administrator")
                        .role("ADMIN")
                        .build();
                userRepository.save(admin);
                System.out.println("Created admin user: username=anmjain password=AnmolJ14@");
            }
        }
    }
}
