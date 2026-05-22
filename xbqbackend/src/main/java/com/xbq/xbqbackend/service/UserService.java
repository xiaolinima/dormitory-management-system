package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.LoginDTO;
import com.xbq.xbqbackend.dto.RegisterDTO;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.UserRepository;
import com.xbq.xbqbackend.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Map<String, Object> login(LoginDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BusinessException("用户名或密码错误"));
        if (!PasswordUtil.check(dto.getPassword(), user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }
        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "realName", user.getRealName() != null ? user.getRealName() : "",
                "role", user.getRole(),
                "token", "fake-jwt-token-" + System.currentTimeMillis()
        );
    }

    public User register(RegisterDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(PasswordUtil.hash(dto.getPassword()));
        user.setRealName(dto.getRealName());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole() != null ? dto.getRole() : "STUDENT");
        user.setGender(dto.getGender());
        user.setGrade(dto.getGrade());
        user.setStudentId(dto.getStudentId());
        return userRepository.save(user);
    }

    public List<User> getStudents() {
        return userRepository.findByRole("STUDENT");
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }
}
