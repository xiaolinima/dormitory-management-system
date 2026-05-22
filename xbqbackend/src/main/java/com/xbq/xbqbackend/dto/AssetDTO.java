package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class AssetDTO {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String buildingName;
    private String name;
    private Integer quantity;
    private String conditionStatus;
    private String lastCheckTime;
    private String description;
}
