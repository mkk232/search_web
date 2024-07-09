package com.rayful.search.common.vo;

import lombok.Data;

@Data
public class ResponseMessageVO {
    private int status;
    private String message;
    private Object result;

    private ResponseMessageVO() {}

    public ResponseMessageVO(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResponseMessageVO(Object result) {
        this.result = result;
    }

    public ResponseMessageVO(int status, Object result) {
        this.status = status;
        this.result = result;
    }
}
