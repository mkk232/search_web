package com.rayful.search.search.service;

import com.rayful.search.common.utils.ConvertUtils;
import com.rayful.search.common.utils.HttpUtils;
import com.rayful.search.common.vo.DetailSearchVO;
import com.rayful.search.config.WebConfig;
import com.rayful.search.search.vo.SearchVO;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.ConnectException;
import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAmount;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SearchService {

    @Autowired
    private WebClient webClient;

    public Map<String, Object> getSearch(SearchVO searchVO) throws ConnectException {
        HttpHeaders reqHeaders = HttpUtils.getHeaders();

        if("N".equals(searchVO.getRegDtmYn())) {
            searchVO.setPeriod();
        }

        searchVO.setUserId("ssh6019");

        System.out.println("searchVO = " + searchVO);

        Map<String, Object> apiResultMap = this.webClient.post()
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
        HttpHeaders reqHeaders = HttpUtils.getHeaders();

        // TODO - API 구현 필요
        Map<String, Object> apiResultMap = this.webClient.post()
                .headers(headers -> headers.addAll(reqHeaders))
                .body(null)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return null;
    }

    private void setPeriod(SearchVO searchVO) {

    }


}
