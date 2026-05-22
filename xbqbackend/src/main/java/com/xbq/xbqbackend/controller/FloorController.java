package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.FloorDTO;
import com.xbq.xbqbackend.entity.Floor;
import com.xbq.xbqbackend.service.FloorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/floors")
@RequiredArgsConstructor
public class FloorController {

    private final FloorService floorService;

    @PostMapping
    public Result<FloorDTO> create(@RequestBody FloorDTO dto) {
        return Result.success(floorService.create(dto));
    }

    @GetMapping
    public Result<List<FloorDTO>> findAll() {
        return Result.success(floorService.findAllDTOs());
    }

    @GetMapping("/building/{buildingId}")
    public Result<List<FloorDTO>> findByBuildingId(@PathVariable Long buildingId) {
        return Result.success(floorService.findByBuildingIdDTOs(buildingId));
    }

    @GetMapping("/{id}")
    public Result<FloorDTO> findById(@PathVariable Long id) {
        return Result.success(floorService.findByIdDTO(id));
    }

    @PutMapping("/{id}")
    public Result<FloorDTO> update(@PathVariable Long id, @RequestBody FloorDTO dto) {
        return Result.success(floorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        floorService.delete(id);
        return Result.success();
    }
}
