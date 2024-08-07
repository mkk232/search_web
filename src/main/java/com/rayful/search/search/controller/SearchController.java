package com.rayful.search.search.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rayful.search.common.vo.ResponseMessageVO;
import com.rayful.search.config.JavascriptConfig;
import com.rayful.search.search.service.SearchService;
import com.rayful.search.search.vo.SearchVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.Response;
import java.io.IOException;
import java.net.ConnectException;
import java.net.URLEncoder;
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

    /**
     * 검색 페이지 이동
     */
    @GetMapping("/rayful")
    public void goTestPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getServletContext().getRequestDispatcher("/removeCookie").forward(request, response);
    }

    @GetMapping("/removeCookie")
    public void goRemoveCookie(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Cookie LtpaToken = new Cookie("LtpaToken", null);
        Cookie usernamelist = new Cookie("usernamelist", null);
        LtpaToken.setMaxAge(0);
        usernamelist.setMaxAge(0);
        response.addCookie(LtpaToken);
        response.addCookie(usernamelist);

        request.getServletContext().getRequestDispatcher("/addCookie").forward(request, response);
    }

    @GetMapping("/addCookie")
    public void goAddCookie(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userNameListStr = ("CN=schadmin/OU=schadmin/O=PHA, schadmin, *, */OU=schadmin/O=PHA, " +
                "*/O=PHA, LocalDomainAdmins, CN=PHA[AZZZZ]/O=PHA, PHA[AZZZZ], 근태미적용그룹, CN=PHA[A]/O=PHA, " +
                "PHA[A], CN=#평화정공/O=PHA, #평화정공, [SystemAdmin]");

        Cookie LtpaToken = new Cookie("LtpaToken", "rayfulCookie");
        String encodedStr = URLEncoder.encode(userNameListStr, "UTF-8");
        Cookie usernamelist = new Cookie("usernamelist", encodedStr);
        response.addCookie(LtpaToken);
        response.addCookie(usernamelist);

        request.getServletContext().getRequestDispatcher("/search").forward(request, response);
    }

    /**
     * 검색 페이지 이동
     */
    @GetMapping("/")
    public void goPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getServletContext().getRequestDispatcher("/search").forward(request, response);
    }

    @GetMapping("/search")
    public ModelAndView search(@RequestParam(value = "q", required = false) String q) {
        ModelAndView mav = new ModelAndView("search");
        String keyword = q;
        if(keyword == null || keyword.trim().length() == 0) {
            keyword = "";
        }

        mav.addObject("jsConfig", this.javascriptConfig);
        mav.addObject("q", keyword);
        return mav;
    }

    /**
     * 통합검색 요청 처리
     */
    // TODO - cookie, usernamelist : required true 설정 필요
    @PostMapping("/search.json")
    public ResponseEntity<ResponseMessageVO> getSearch(@RequestBody SearchVO searchVO,
                                                       @CookieValue(value = "LtpaToken", required = false) String cookie,
                                                       @CookieValue(value = "usernamelist", required = false) String userNameList) {

        log.debug("cookie: {} ", cookie);
        log.debug("userNameList : {} ", userNameList);

        if(userNameList != null) {
            searchVO.setUserInfo(userNameList);
        } else {
            searchVO.setUserId("schadmin");
        }

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
