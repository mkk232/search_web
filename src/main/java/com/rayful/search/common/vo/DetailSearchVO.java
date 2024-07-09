package com.rayful.search.common.vo;

import lombok.Data;

/**
 * 상세검색 VO
 */
@Data
public class DetailSearchVO {
    private String menu;
    private String area;
    private String period;
    private String startDt;
    private String endDt;
    private String orderBy;
    private String attach;
    private String writer;
}
