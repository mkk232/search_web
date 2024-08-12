package com.rayful.search.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "javascript")
@Data
public class JavascriptConfig {
    private LinkedHashMap<String, Object> menu;
    private List<String> attachExt;
    private Map<String, Object> pagination;

}
