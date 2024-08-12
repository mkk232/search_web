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

//    private static final String COMPANY_URL
    private ConvertUtils() {}

    @SuppressWarnings("unchecked")
    public static Map<String, Object> convertResultMap(Map<String, Object> apiResultMap) throws ConnectException {
        Map<String, Object> resultMap = (Map<String, Object>) apiResultMap.get("result");
        if(resultMap != null) {
            if (Integer.parseInt(String.valueOf(resultMap.get("totalCnt"))) > 0) {
                for (Map<String, Object> sectionMap : (List<Map<String, Object>>) resultMap.get("sectionList")) {
                    String sectionCode = (String) sectionMap.get("sectionCode");
                    for (Map<String, Object> docMap : (List<Map<String, Object>>) sectionMap.get("docList")) {
                        if(Integer.parseInt(String.valueOf(sectionMap.get("sectionCnt"))) > 0) {

                            if ((((String) sectionMap.get("indexName")).startsWith("idx_01_"))
                                    || ((String) sectionMap.get("indexName")).startsWith("idx_02_")) {
                                addViewDate(docMap);

                                addViewContent(docMap);

                                addViewDocLink(docMap, sectionCode);

                                addViewDocDownloadLink(docMap);
                            } else {
                                addViewPersonImgLink(docMap);
                            }
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
    private static void addViewDocLink(Map<String, Object> docMap, String sectionCode) {
        String fullPath = "";
        String frontPath = "";
        String backPath = "";
        String dbPath = (String) docMap.get("nsf_name");
        String docId = (String) docMap.get("docid");
        String viewCode = "0";

        if(dbPath != null) {
            frontPath = "https://pt.phakr.com/egate/global/eip/home/home.nsf/openpage?readform&url=/";

            if("20000".equals(sectionCode) || "40000".equals(sectionCode)) {
                backPath = "?opendocument&isundock=1";
            }

            fullPath = frontPath + dbPath + "/" + viewCode + "/" + docId + backPath;

            docMap.put("view_docLink", fullPath);
        } else {
            docMap.put("view_docLink", "#");
        }
    }

    /* 첨부파일 다운로드 링크 추가 */
    @SuppressWarnings("unchecked")
    private static void addViewDocDownloadLink(Map<String, Object> docMap) {
        String attachNm = null;
        String docId = null;
        String nsfName = null;
        String frontPath = "https://pt.phakr.com/";
        List<Map<String, Object>> attachList = (List<Map<String, Object>>) docMap.get("attach_info");
        if(attachList != null && attachList.size() > 0) {
            docId = (String) docMap.get("docid");
            nsfName = (String) docMap.get("nsf_name");

            for(Map<String, Object> attachMap : attachList) {
                attachNm = (String) attachMap.get("attach_nm");

                String downloadUrl = frontPath + nsfName + "/0/" + docId + "/$FILE/" + attachNm;
                attachMap.put("view_downloadUrl", downloadUrl);
            }
        }
    }

    /* 임직원 이미지 링크 추가 */
    private static void addViewPersonImgLink(Map<String, Object> docMap) {
        // https://pt.phakr.com/egate/global/eip/home/pref.nsf/photo_by_empno/5222010/$file/5222010.jpg
        String personId = (String) docMap.get("person_id");
        if(personId != null) {
            String frontPath = "https://pt.phakr.com/egate/global/eip/home/pref.nsf/photo_by_empno/";
            String nsfName = (String) docMap.get("nsf_name");

            String viewUrl = frontPath + personId + "/$file/" + personId + ".jpg";
            docMap.put("view_personImg", viewUrl);
        }
    }


    @SuppressWarnings("unchecked")
    private static Map<String, List<Object>> getViewAggregation(Map<String, List<Object>> newAggregationMap,
                                                                Map<String, Object> aggregationMap) {
        if(newAggregationMap == null) {
            newAggregationMap = new HashMap<>();
        }


        String fieldName = (String) aggregationMap.get("field");
        List<Object> bucketList = null;
        if(newAggregationMap.containsKey(fieldName)) {
            bucketList = newAggregationMap.get(fieldName);
        } else {
            bucketList = new ArrayList<>();
        }


        for(Map<String, Object> bucket : (List<Map<String, Object>>) aggregationMap.get("buckets")) {
            String key = (String) bucket.get("key");
            int docCnt = (int) bucket.get("doc_count");

            if(bucketList.isEmpty()) {
                Map<String, Object> bucketMap = new HashMap<>();
                bucketMap.put(key, docCnt);
                bucketList.add(bucketMap);
            } else {
                for (Object bucketMap : bucketList) {
                    if (((Map<String, Object>) bucketMap).containsKey(key)) {
                        int oldDocCnt = (int) ((Map<String, Object>) bucketMap).get(key);
                        ((Map<String, Object>) bucketMap).put(key, docCnt + oldDocCnt);
                    } else {
                        ((Map<String, Object>) bucketMap).put(key, docCnt);
                    }

                }
            }

            newAggregationMap.put(fieldName, bucketList);
        }


        return newAggregationMap;
    }
}


