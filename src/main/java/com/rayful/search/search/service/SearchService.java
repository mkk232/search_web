package com.rayful.search.search.service;

import com.rayful.search.common.utils.ConvertUtils;
import com.rayful.search.common.utils.HttpUtils;
import com.rayful.search.search.vo.SearchVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.ConnectException;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
public class SearchService {

    @Autowired
    private WebClient webClient;

    public Map<String, Object> getSearch(SearchVO searchVO) throws ConnectException {
        HttpHeaders reqHeaders = HttpUtils.getHeaders(searchVO.getUserId());

        if("N".equals(searchVO.getRegDtmYn())) {
            searchVO.setPeriod();
        }

        log.debug("searchVO = {}", searchVO);

        LinkedHashMap<String, Object> apiResultMap = (LinkedHashMap<String, Object>) this.webClient.post()
                .headers(headers -> headers.addAll(reqHeaders))
                .bodyValue(searchVO)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> {
                    log.error("Error: ", e);
                    return null;
                })
                .block();

        ConvertUtils.convertResultMap(apiResultMap);

        return apiResultMap;
    }

    public Map<String, Object> getAutoComplete() {
//        HttpHeaders reqHeaders = HttpUtils.getHeaders();

        // TODO - API 구현 필요
//        Map<String, Object> apiResultMap = this.webClient.post()
//                .headers(headers -> headers.addAll(reqHeaders))
//                .body(null)
//                .retrieve()
//                .bodyToMono(Map.class)
//                .block();

        return null;
    }

}
