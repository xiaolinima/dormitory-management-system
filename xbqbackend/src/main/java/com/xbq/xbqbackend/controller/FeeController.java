package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.FeeDTO;
import com.xbq.xbqbackend.entity.Fee;
import com.xbq.xbqbackend.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @PostMapping
    public Result<Fee> create(@RequestBody FeeDTO dto) {
        return Result.success(feeService.create(dto));
    }

    @GetMapping
    public Result<List<Fee>> findAll() {
        return Result.success(feeService.findAll());
    }

    @GetMapping("/student/{studentId}")
    public Result<List<Fee>> findByStudentId(@PathVariable Long studentId) {
        return Result.success(feeService.findByStudentId(studentId));
    }

    @GetMapping("/unpaid")
    public Result<List<Fee>> unpaid() {
        return Result.success(feeService.findUnpaid());
    }

    @PostMapping("/pay/{id}")
    public Result<Fee> pay(@PathVariable Long id) {
        return Result.success(feeService.pay(id));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        feeService.delete(id);
        return Result.success();
    }
}
