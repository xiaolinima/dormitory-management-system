package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.ApplicationDTO;
import com.xbq.xbqbackend.entity.Application;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.ApplicationRepository;
import com.xbq.xbqbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public Application apply(ApplicationDTO dto, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException("学生不存在"));

        Application application = new Application();
        application.setStudent(student);
        application.setGender(dto.getGender());
        application.setRemark(dto.getRemark());
        application.setStatus("PENDING");
        return applicationRepository.save(application);
    }

    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    public List<Application> findByStudentId(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> findByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    public Application approve(Long id, String result, Long handlerId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));

        application.setStatus("APPROVED");
        application.setHandleResult(result);
        application.setHandleTime(LocalDateTime.now());
        application.setHandler(handler);
        return applicationRepository.save(application);
    }

    public Application reject(Long id, String reason, Long handlerId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));

        application.setStatus("REJECTED");
        application.setHandleResult(reason);
        application.setHandleTime(LocalDateTime.now());
        application.setHandler(handler);
        return applicationRepository.save(application);
    }

    public void cancel(Long id, Long studentId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        if (!application.getStudent().getId().equals(studentId)) {
            throw new BusinessException("无权限取消");
        }
        if (!"PENDING".equals(application.getStatus())) {
            throw new BusinessException("只能取消待处理的申请");
        }
        applicationRepository.deleteById(id);
    }
}
