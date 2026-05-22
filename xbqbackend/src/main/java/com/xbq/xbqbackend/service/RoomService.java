package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.RoomDTO;
import com.xbq.xbqbackend.entity.Floor;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.FloorRepository;
import com.xbq.xbqbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final FloorRepository floorRepository;

    public RoomDTO convertToDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setFloorId(room.getFloor().getId());
        dto.setFloorName(room.getFloor().getFloorNumber() + "层");
        dto.setBuildingId(room.getFloor().getBuilding().getId());
        dto.setBuildingName(room.getFloor().getBuilding().getName());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setCapacity(room.getCapacity());
        dto.setCurrentCount(room.getCurrentCount());
        dto.setGender(room.getGender());
        dto.setStatus(room.getStatus());
        dto.setDescription(room.getDescription());
        return dto;
    }

    public RoomDTO create(RoomDTO dto) {
        Floor floor = floorRepository.findById(dto.getFloorId())
                .orElseThrow(() -> new BusinessException("楼层不存在"));

        Room room = new Room();
        room.setFloor(floor);
        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setCurrentCount(0);
        room.setGender(dto.getGender());
        room.setStatus("AVAILABLE");
        room.setDescription(dto.getDescription());
        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public List<RoomDTO> findAllDTOs() {
        return roomRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间不存在"));
    }

    public RoomDTO findByIdDTO(Long id) {
        Room room = findById(id);
        return convertToDTO(room);
    }

    public RoomDTO update(Long id, RoomDTO dto) {
        Room room = findById(id);
        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setGender(dto.getGender());
        room.setStatus(dto.getStatus());
        room.setDescription(dto.getDescription());
        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }

    public List<Room> findAvailableByGender(String gender) {
        return roomRepository.findAvailableRoomsByGender(gender);
    }
}
