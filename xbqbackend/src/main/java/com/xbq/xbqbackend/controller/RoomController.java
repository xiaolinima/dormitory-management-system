package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.RoomDTO;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public Result<RoomDTO> create(@RequestBody RoomDTO dto) {
        return Result.success(roomService.create(dto));
    }

    @GetMapping
    public Result<List<RoomDTO>> findAll() {
        return Result.success(roomService.findAllDTOs());
    }

    @GetMapping("/{id}")
    public Result<RoomDTO> findById(@PathVariable Long id) {
        return Result.success(roomService.findByIdDTO(id));
    }

    @PutMapping("/{id}")
    public Result<RoomDTO> update(@PathVariable Long id, @RequestBody RoomDTO dto) {
        return Result.success(roomService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return Result.success();
    }

    @GetMapping("/available")
    public Result<List<RoomDTO>> available(@RequestParam String gender) {
        return Result.success(roomService.findAvailableByGender(gender).stream()
                .map(roomService::convertToDTO)
                .collect(java.util.stream.Collectors.toList()));
    }
}
