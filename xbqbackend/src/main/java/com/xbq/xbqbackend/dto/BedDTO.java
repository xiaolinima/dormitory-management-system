package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class BedDTO {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String buildingName;
    private String bedNumber;
    private String status;
    private Long studentId;
    private String studentName;
    private String gender;
}
