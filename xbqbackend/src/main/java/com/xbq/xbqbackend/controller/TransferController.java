package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.TransferDTO;
import com.xbq.xbqbackend.entity.Transfer;
import com.xbq.xbqbackend.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    public Result<Transfer> apply(@RequestBody TransferDTO dto, @RequestParam Long studentId) {
        return Result.success(transferService.apply(dto, studentId));
    }

    @GetMapping
    public Result<List<Transfer>> findAll() {
        return Result.success(transferService.findAll());
    }

    @GetMapping("/student/{studentId}")
    public Result<List<Transfer>> findByStudentId(@PathVariable Long studentId) {
        return Result.success(transferService.findByStudentId(studentId));
    }

    @GetMapping("/status/{status}")
    public Result<List<Transfer>> findByStatus(@PathVariable String status) {
        return Result.success(transferService.findByStatus(status));
    }

    @PostMapping("/approve")
    public Result<Transfer> approve(@RequestBody Map<String, Long> params) {
        return Result.success(transferService.approve(params.get("id"), params.get("handlerId")));
    }

    @PostMapping("/reject")
    public Result<Transfer> reject(@RequestBody Map<String, Long> params) {
        return Result.success(transferService.reject(params.get("id"), params.get("handlerId")));
    }
}
