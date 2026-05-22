package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.RepairDTO;
import com.xbq.xbqbackend.entity.Repair;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.RepairRepository;
import com.xbq.xbqbackend.repository.RoomRepository;
import com.xbq.xbqbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairService {

    private final RepairRepository repairRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Repair apply(RepairDTO dto, Long studentId) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new BusinessException("房间不存在"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException("学生不存在"));

        Repair repair = new Repair();
        repair.setRoom(room);
        repair.setStudent(student);
        repair.setType(dto.getType());
        repair.setDescription(dto.getDescription());
        repair.setStatus("PENDING");
        return repairRepository.save(repair);
    }

    public List<Repair> findAll() {
        return repairRepository.findAll();
    }

    public List<Repair> findByStudentId(Long studentId) {
        return repairRepository.findByStudentId(studentId);
    }

    public List<Repair> findByStatus(String status) {
        return repairRepository.findByStatus(status);
    }

    public Repair handle(Long id, String result, Long handlerId) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));

        repair.setStatus("COMPLETED");
        repair.setHandleResult(result);
        repair.setHandleTime(LocalDateTime.now());
        repair.setHandler(handler);
        return repairRepository.save(repair);
    }

    public Repair reject(Long id, String reason, Long handlerId) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));

        repair.setStatus("REJECTED");
        repair.setHandleResult(reason);
        repair.setHandleTime(LocalDateTime.now());
        repair.setHandler(handler);
        return repairRepository.save(repair);
    }

    public void cancelRepair(Long id, Long studentId) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new BusinessException("申请不存在"));
        if (!repair.getStudent().getId().equals(studentId)) {
            throw new BusinessException("无权限取消");
        }
        if (!"PENDING".equals(repair.getStatus())) {
            throw new BusinessException("只能取消待处理的申请");
        }
        repairRepository.deleteById(id);
    }
}
