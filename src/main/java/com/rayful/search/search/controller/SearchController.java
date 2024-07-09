package com.rayful.search.search.controller;

import com.rayful.search.common.vo.DetailSearchVO;
import com.rayful.search.common.vo.ResponseMessageVO;
import com.rayful.search.search.service.SearchService;
import com.rayful.search.search.vo.SearchVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.net.ConnectException;
import java.util.Map;

@Slf4j
@RestController
public class SearchController {

    @Autowired
    private SearchService searchService;

    /**
     * 검색 페이지 이동
     */
    @GetMapping("/")
    public ModelAndView goPage() {
        return new ModelAndView("search");
    }

    /**
     * 통합검색 요청 처리
     */
    @PostMapping("/search.json")
    public ResponseEntity<ResponseMessageVO> getSearch(@RequestBody SearchVO searchVO) {

        try {
            Map<String, Object> resultMap = this.searchService.getSearch(searchVO);
            return ResponseEntity.ok(new ResponseMessageVO(resultMap));
        } catch (ConnectException ce) {
            log.error("search error: {}", ce.getMessage());
            return ResponseEntity.badRequest().body(new ResponseMessageVO(1, ce.getMessage()));
        } catch (Exception e) {
            log.error("search error: ", e);
            return ResponseEntity.internalServerError().body(new ResponseMessageVO(e.getMessage()));
        }
    }

    /**
     * 자동완성 요청 처리
     */
    // TODO - 첫단어 / 끝단어
    @PostMapping("/autoComplete.json")
    public ResponseEntity<ResponseMessageVO> getAutoComplete(@RequestParam String kwd) {
        try {
            return ResponseEntity.ok(new ResponseMessageVO(""));
        } catch (Exception e) {
            log.error("search error: ", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
