package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.entity.Bed;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.entity.Transfer;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.BedRepository;
import com.xbq.xbqbackend.repository.RoomRepository;
import com.xbq.xbqbackend.repository.TransferRepository;
import com.xbq.xbqbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;

    public Transfer apply(com.xbq.xbqbackend.dto.TransferDTO dto, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException("学生不存在"));
        Room fromRoom = dto.getFromRoomId() != null ? roomRepository.findById(dto.getFromRoomId())
                .orElseThrow(() -> new BusinessException("原房间不存在")) : null;
        Room toRoom = dto.getToRoomId() != null ? roomRepository.findById(dto.getToRoomId())
                .orElseThrow(() -> new BusinessException("目标房间不存在")) : null;

        Transfer transfer = new Transfer();
        transfer.setStudent(student);
        transfer.setFromRoom(fromRoom);
        transfer.setToRoom(toRoom);
        transfer.setReason(dto.getReason());
        transfer.setStatus("PENDING");
        return transferRepository.save(transfer);
    }

    public List<Transfer> findAll() {
        return transferRepository.findAll();
    }

    public List<Transfer> findByStudentId(Long studentId) {
        return transferRepository.findByStudentId(studentId);
    }

    public List<Transfer> findByStatus(String status) {
        return transferRepository.findByStatus(status);
    }

    @Transactional
    public Transfer approve(Long id, Long handlerId) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new BusinessException("调宿记录不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));
        User student = transfer.getStudent();

        if (transfer.getFromRoom() != null) {
            bedRepository.findOccupiedBedByStudentId(student.getId())
                    .ifPresent(bed -> {
                        bed.setStatus("AVAILABLE");
                        bed.setStudent(null);
                        bedRepository.save(bed);
                        roomRepository.decrementCurrentCount(transfer.getFromRoom().getId());
                    });
        }

        if (transfer.getToRoom() != null) {
            List<Bed> availableBeds = bedRepository.findAvailableBedsByGender(
                    transfer.getToRoom().getGender());
            availableBeds.stream()
                    .filter(b -> b.getRoom().getId().equals(transfer.getToRoom().getId()))
                    .findFirst()
                    .ifPresent(bed -> {
                        bed.setStatus("OCCUPIED");
                        bed.setStudent(student);
                        bedRepository.save(bed);
                        roomRepository.incrementCurrentCount(transfer.getToRoom().getId());
                    });
        }

        transfer.setStatus("APPROVED");
        transfer.setHandleTime(LocalDateTime.now());
        transfer.setHandler(handler);
        return transferRepository.save(transfer);
    }

    @Transactional
    public Transfer reject(Long id, Long handlerId) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new BusinessException("调宿记录不存在"));
        User handler = userRepository.findById(handlerId)
                .orElseThrow(() -> new BusinessException("处理人不存在"));
        transfer.setStatus("REJECTED");
        transfer.setHandleTime(LocalDateTime.now());
        transfer.setHandler(handler);
        return transferRepository.save(transfer);
    }
}
