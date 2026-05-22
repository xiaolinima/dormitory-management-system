package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.BuildingDTO;
import com.xbq.xbqbackend.entity.Building;
import com.xbq.xbqbackend.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public Result<Building> create(@RequestBody BuildingDTO dto) {
        return Result.success(buildingService.create(dto));
    }

    @GetMapping
    public Result<List<Building>> findAll() {
        return Result.success(buildingService.findAll());
    }

    @GetMapping("/{id}")
    public Result<Building> findById(@PathVariable Long id) {
        return Result.success(buildingService.findById(id));
    }

    @PutMapping("/{id}")
    public Result<Building> update(@PathVariable Long id, @RequestBody BuildingDTO dto) {
        return Result.success(buildingService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        buildingService.delete(id);
        return Result.success();
    }
}
