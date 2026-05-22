package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByRole(String role);

    List<User> findByRoleAndGender(String role, String gender);

    List<User> findByRoleAndGrade(String role, Integer grade);
}
