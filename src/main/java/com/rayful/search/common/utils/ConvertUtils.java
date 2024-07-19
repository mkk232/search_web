package com.rayful.search.common.utils;

import lombok.extern.slf4j.Slf4j;

import java.net.ConnectException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
public class ConvertUtils {
    private ConvertUtils() {}

    // 첨부 하이라이트 -> 본문 하이라이트 -> 첨부 -> 본문
    @SuppressWarnings("unchecked")
    public static Map<String, Object> convertResultMap(Map<String, Object> apiResultMap) throws ConnectException {
        Map<String, Object> resultMap = (Map<String, Object>) apiResultMap.get("result");
        Map<String, List<Object>> newAggregation = null;
        List<Map<String, List<Object>>> newAggregationList = new ArrayList<>();
        if(resultMap != null) {
            if (Integer.parseInt(String.valueOf(resultMap.get("totalCnt"))) > 0) {
                for (Map<String, Object> sectionMap : (List<Map<String, Object>>) resultMap.get("sectionList")) {
                    if (Integer.parseInt(String.valueOf(sectionMap.get("sectionCnt"))) > 0
                            && (((String) sectionMap.get("indexName")).startsWith("idx_01_"))
                                || ((String) sectionMap.get("indexName")).startsWith("idx_02_")) {
                        for (Map<String, Object> docMap : (List<Map<String, Object>>) sectionMap.get("docList")) {

                            addViewDate(docMap);

                            addViewContent(docMap);
                        }

//                        for(Map<String, Object> aggregationMap : (List<Map<String, Object>>) sectionMap.get("aggregations")) {
//                            if(aggregationMap != null) {
//                                newAggregation = getViewAggregation(newAggregation, aggregationMap);
//                            }
//                        }
                    }
                }
//                newAggregationList.add(newAggregation);
//                resultMap.put("view_aggregations", newAggregationList);

            }
        } else {
            log.error("Search API connection error");
            throw new ConnectException("Search API connection error");
        }

        System.out.println("apiResultMap = " + apiResultMap);

        return apiResultMap;
    }

    private static void addViewDate(Map<String, Object> docMap)  {
        try {
            String regDtm = (String) docMap.get("reg_dtm");
            String updDtm = (String) docMap.get("upd_dtm");

            if(regDtm != null) {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

                Date viewDate = simpleDateFormat.parse(regDtm);
                String viewWriterNm = (String) docMap.get("writer_nm");

                if (updDtm != null || docMap.get("updator_nm") != null) {
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

    private static void addViewContent(Map<String, Object> docMap) {
        String viewContent = (String) docMap.get("content.highlight");

        if (viewContent == null) {
            viewContent = (String) docMap.get("attach_body.highlight");
        }

        if (viewContent == null) {
            viewContent = (String) docMap.get("content");
        }

        if (viewContent == null) {
            viewContent = (String) docMap.get("attach_body");
        }

        if (viewContent != null) {
            docMap.put("view_content", viewContent);
        } else {
            docMap.put("view_content", "");
            log.warn("[{}] Content must be not null", docMap.get("title"));
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

        log.debug("newAggregationMap: {}", newAggregationMap);

        return newAggregationMap;
    }
}


