package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.entity.Bed;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.entity.User;
import com.xbq.xbqbackend.dto.BedDTO;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.BedRepository;
import com.xbq.xbqbackend.repository.RoomRepository;
import com.xbq.xbqbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BedService {

    private final BedRepository bedRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Bed createBed(Long roomId, String bedNumber) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException("房间不存在"));

        if (bedRepository.findByRoomIdAndBedNumber(roomId, bedNumber).isPresent()) {
            throw new BusinessException("该床位号已存在");
        }

        Bed bed = new Bed();
        bed.setRoom(room);
        bed.setBedNumber(bedNumber);
        bed.setStatus("AVAILABLE");
        return bedRepository.save(bed);
    }

    public List<Bed> findByRoomId(Long roomId) {
        return bedRepository.findByRoomId(roomId);
    }

    public List<Bed> findAll() {
        return bedRepository.findAll();
    }

    public List<BedDTO> findAllDTOs() {
        return bedRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BedDTO convertToDTO(Bed bed) {
        BedDTO dto = new BedDTO();
        dto.setId(bed.getId());
        dto.setBedNumber(bed.getBedNumber());
        dto.setStatus(bed.getStatus());
        if (bed.getRoom() != null) {
            dto.setRoomId(bed.getRoom().getId());
            dto.setRoomNumber(bed.getRoom().getRoomNumber());
            dto.setGender(bed.getRoom().getGender());
            if (bed.getRoom().getFloor() != null && bed.getRoom().getFloor().getBuilding() != null) {
                dto.setBuildingName(bed.getRoom().getFloor().getBuilding().getName());
            }
        }
        if (bed.getStudent() != null) {
            dto.setStudentId(bed.getStudent().getId());
            dto.setStudentName(bed.getStudent().getRealName());
        }
        return dto;
    }

    public List<Bed> findAvailableByGender(String gender) {
        return bedRepository.findAvailableBedsByGender(gender);
    }

    @Transactional
    public Bed assignBed(Long bedId, Long studentId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new BusinessException("床位不存在"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException("学生不存在"));

        if (!"AVAILABLE".equals(bed.getStatus())) {
            throw new BusinessException("该床位不可用");
        }

        if (bedRepository.findOccupiedBedByStudentId(studentId).isPresent()) {
            throw new BusinessException("该学生已有床位");
        }

        bed.setStatus("OCCUPIED");
        bed.setStudent(student);
        Bed saved = bedRepository.save(bed);

        roomRepository.incrementCurrentCount(bed.getRoom().getId());
        return saved;
    }

    @Transactional
    public void vacateBed(Long bedId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new BusinessException("床位不存在"));
        if ("OCCUPIED".equals(bed.getStatus())) {
            roomRepository.decrementCurrentCount(bed.getRoom().getId());
        }
        bed.setStatus("AVAILABLE");
        bed.setStudent(null);
        bedRepository.save(bed);
    }
}
