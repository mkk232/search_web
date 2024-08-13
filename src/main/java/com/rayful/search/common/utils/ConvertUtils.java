package com.rayful.search.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.jasper.tagplugins.jstl.core.Url;

import java.net.ConnectException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
public class ConvertUtils {

    private static final String BASE_URL = "https://pt.phakr.com";
    private ConvertUtils() {}

    @SuppressWarnings("unchecked")
    public static Map<String, Object> convertResultMap(Map<String, Object> apiResultMap) throws ConnectException {
        Map<String, Object> resultMap = (Map<String, Object>) apiResultMap.get("result");
        if(resultMap != null) {
            if (Integer.parseInt(String.valueOf(resultMap.get("totalCnt"))) > 0) {
                for (Map<String, Object> sectionMap : (List<Map<String, Object>>) resultMap.get("sectionList")) {
                    for (Map<String, Object> docMap : (List<Map<String, Object>>) sectionMap.get("docList")) {
                        if(Integer.parseInt(String.valueOf(sectionMap.get("sectionCnt"))) > 0) {

                            addViewPersonImgLink(docMap);

                            addViewDate(docMap);

                            addViewContent(docMap);

                            addViewDocLink(docMap);

                            addViewDocDownloadLink(docMap);
                        }
                    }
                }
            }
        } else {
            log.error("Search API connection error");
            throw new ConnectException("Search API connection error");
        }

        return apiResultMap;
    }

    /* 수정자 / 작성자 비교 후 추가 */
    private static void addViewDate(Map<String, Object> docMap)  {
        try {
            String regDtm = (String) docMap.get("reg_dtm");
            String updDtm = (String) docMap.get("upd_dtm");

            if(regDtm != null) {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

                Date viewDate = simpleDateFormat.parse(regDtm);
                String viewWriterNm = (String) docMap.get("writer_nm");

                if (updDtm != null && docMap.get("updator_nm") != null) {
                    Date updDate = simpleDateFormat.parse(updDtm);
                    if (updDate.compareTo(viewDate) > 0) {
                        viewDate = updDate;
                        viewWriterNm = (String) docMap.get("updator_nm");
                    }
                }

                docMap.put("view_dtm", simpleDateFormat.format(viewDate));
                docMap.put("view_writer_nm", viewWriterNm);
            }

        } catch (ParseException e) {
            log.error("Fail to compare date", e);
        }
    }

    // 본문 하이라이트 -> 첨부 하이라이트 -> 본문 -> 첨부
    private static void addViewContent(Map<String, Object> docMap) {
        String viewContent = (String) docMap.get("content_highlight");

        if (viewContent == null || viewContent.isEmpty()) {
            viewContent = (String) docMap.get("attach_body_highlight");
        }

        if (viewContent == null || viewContent.isEmpty()) {
            viewContent = (String) docMap.get("content");
        }

        if (viewContent == null || viewContent.isEmpty()) {
            viewContent = (String) docMap.get("attach_body");
        }

        if (viewContent == null || viewContent.isEmpty()) {
            viewContent = "";
        }

        docMap.put("view_content", viewContent);
    }

    /* 문서 링크 추가 */
    private static void addViewDocLink(Map<String, Object> docMap) {
        String docLink = "";
        String nsfName = (String) docMap.get("nsf_name");
        if(nsfName != null) {
            String baseUrl = BASE_URL + "/egate/global/eip/home/home.nsf/openpage?readform&url=/";
            String docId = (String) docMap.get("docid");
            String urlParam = "?opendocument&isundock=1";
            docLink = baseUrl + nsfName + "/0/" + docId + urlParam;

            docMap.put("view_docLink", docLink);
        } else {
            docMap.put("view_docLink", "#");
        }
    }

    /* 첨부파일 다운로드 링크 추가 */
    @SuppressWarnings("unchecked")
    private static void addViewDocDownloadLink(Map<String, Object> docMap) {
        List<Map<String, Object>> attachList = (List<Map<String, Object>>) docMap.get("attach_info");
        if(attachList != null && attachList.size() > 0) {
            String docId = (String) docMap.get("docid");
            String nsfName = (String) docMap.get("nsf_name");

            for(Map<String, Object> attachMap : attachList) {
                String attachNm = (String) attachMap.get("attach_nm");
                String downloadLink = BASE_URL + "/" + nsfName + "/0/" + docId + "/$FILE/" + attachNm;

                attachMap.put("view_downloadUrl", downloadLink);
            }
        }
    }

    /* 임직원 이미지 링크 추가 */
    private static void addViewPersonImgLink(Map<String, Object> docMap) {
        String personId = (String) docMap.get("person_id");
        if(personId != null) {
            String nsfName = "/egate/global/eip/home/pref.nsf/photo_by_empno/";
            String imgLink = BASE_URL + nsfName + personId + "/$file/" + personId + ".jpg";

            docMap.put("view_personImg", imgLink);
        }
    }
}


