package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.RepairDTO;
import com.xbq.xbqbackend.entity.Repair;
import com.xbq.xbqbackend.service.RepairService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repairs")
@RequiredArgsConstructor
public class RepairController {

    private final RepairService repairService;

    @PostMapping
    public Result<Repair> apply(@RequestBody RepairDTO dto, @RequestParam Long studentId) {
        return Result.success(repairService.apply(dto, studentId));
    }

    @GetMapping
    public Result<List<Repair>> findAll() {
        return Result.success(repairService.findAll());
    }

    @GetMapping("/student/{studentId}")
    public Result<List<Repair>> findByStudentId(@PathVariable Long studentId) {
        return Result.success(repairService.findByStudentId(studentId));
    }

    @GetMapping("/status/{status}")
    public Result<List<Repair>> findByStatus(@PathVariable String status) {
        return Result.success(repairService.findByStatus(status));
    }

    @PostMapping("/handle")
    public Result<Repair> handle(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String result = params.get("result").toString();
        Long handlerId = Long.valueOf(params.get("handlerId").toString());
        return Result.success(repairService.handle(id, result, handlerId));
    }

    @PostMapping("/reject")
    public Result<Repair> reject(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String reason = params.get("reason").toString();
        Long handlerId = Long.valueOf(params.get("handlerId").toString());
        return Result.success(repairService.reject(id, reason, handlerId));
    }

    @DeleteMapping("/{id}")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam Long studentId) {
        repairService.cancelRepair(id, studentId);
        return Result.success();
    }
}
