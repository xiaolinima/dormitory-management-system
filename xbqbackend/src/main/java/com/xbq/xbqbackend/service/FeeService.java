package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.FeeDTO;
import com.xbq.xbqbackend.entity.Fee;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.FeeRepository;
import com.xbq.xbqbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final UserRepository userRepository;

    public Fee create(FeeDTO dto) {
        User student = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new BusinessException("学生不存在"));

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setSemester(dto.getSemester());
        fee.setAmount(java.math.BigDecimal.valueOf(dto.getAmount()));
        fee.setStatus("UNPAID");
        fee.setDueDate(java.time.LocalDate.parse(dto.getDueDate()));
        return feeRepository.save(fee);
    }

    public List<Fee> findAll() {
        return feeRepository.findAll();
    }

    public List<Fee> findByStudentId(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public List<Fee> findUnpaid() {
        return feeRepository.findUnpaidFees();
    }

    public Fee pay(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("账单不存在"));
        fee.setStatus("PAID");
        fee.setPaidTime(LocalDateTime.now());
        return feeRepository.save(fee);
    }

    public void delete(Long id) {
        feeRepository.deleteById(id);
    }
}
