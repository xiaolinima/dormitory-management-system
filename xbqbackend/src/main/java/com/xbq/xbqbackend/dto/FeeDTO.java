package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class FeeDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String semester;
    private Double amount;
    private String status;
    private String dueDate;
    private String paidTime;
}
