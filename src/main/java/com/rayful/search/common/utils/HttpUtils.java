package com.rayful.search.common.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;

public class HttpUtils {
    private HttpUtils() {}

    public static HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("user-id", "ok/6jA3h+1W2nQiXEo/8nw==");
       return headers;
    }
}
