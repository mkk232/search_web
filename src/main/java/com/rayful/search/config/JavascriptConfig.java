package com.rayful.search.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "javascript")
public class JavascriptConfig {
    private String companyName;
    private LinkedHashMap<String, Object> menu;
    private Map<String, Object> pagination;

}
