package com.rayful.search.search.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.rayful.search.common.vo.ResponseMessageVO;
import com.rayful.search.config.JavascriptConfig;
import com.rayful.search.search.service.SearchService;
import com.rayful.search.search.vo.SearchVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.util.Map;

@Slf4j
@RestController
public class SearchController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private JavascriptConfig javascriptConfig;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${search.client-auth}")
    private String clientAuthYn;


    /**
     * 검색 페이지 이동
     */
    @GetMapping("/")
    public void goPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getServletContext().getRequestDispatcher("/search").forward(request, response);
    }

    @GetMapping("/search")
    public ModelAndView search(@RequestParam(value = "q", required = false) String q,
                               @RequestParam(value = "t", required = false) String t,
                               @CookieValue(value = "LtpaToken", required = false) String ltpaToken,
                               @CookieValue(value = "usernamelist", required = false) String userNameList) {

        log.debug("ltpaToken : {} ", ltpaToken);
        log.debug("userNameList : {} ", userNameList);

        ModelAndView mav = new ModelAndView("search");
        String keyword = q;
        if(keyword == null || keyword.trim().length() == 0) {
            keyword = "";
        }

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        String jsonMenu = gson.toJson(this.javascriptConfig.getMenu());
        String jsonPagination = gson.toJson(this.javascriptConfig.getPagination());

        mav.addObject("companyName", this.javascriptConfig.getCompanyName());
        mav.addObject("menuMap", jsonMenu);
        mav.addObject("pagination", jsonPagination);
        mav.addObject("q", keyword);
        mav.addObject("code", t);

        return mav;
    }

    /**
     * 통합검색 요청 처리
     */
    @PostMapping("/search.json")
    public ResponseEntity<ResponseMessageVO> getSearch(@RequestBody SearchVO searchVO,
                                                       @CookieValue(value = "LtpaToken", required = false) String ltpaToken,
                                                       @CookieValue(value = "usernamelist", required = false) String userNameList) throws UnsupportedEncodingException {

        if("Y".equals(clientAuthYn)) {
//            AuthUtils.checkValidAuth(clientAuthYn);
        }

        if(ltpaToken == null || userNameList == null) {
            return ResponseEntity.badRequest().body(new ResponseMessageVO(1, "cookie must be not null"));
        }

        searchVO.setUserInfo(userNameList);

        log.debug("ltpaToken : {} ", ltpaToken);
        log.debug("userNameList : {} ", userNameList);

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
