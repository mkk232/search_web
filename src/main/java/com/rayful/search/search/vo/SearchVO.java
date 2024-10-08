package com.rayful.search.search.vo;

import lombok.Data;
import org.springframework.web.util.HtmlUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Map;

@Data
public class SearchVO {
    private String kwd;
    private String collapseCd;
    private String reSrchYn;
    private String[] prevKwd;
    private String[] srchArea;
    private String[] attachedType;
    private int sort;
    private int size;
    private int page;
    private int period;

    private String regDtmYn;
    private String regStartDtm;
    private String regEndDtm;

    private String userId;
    private String[] acl01;

    private Map<String, Object> filterOption;

    public SearchVO() {
        this.collapseCd = "99999";
        this.prevKwd = new String[0];
        this.regDtmYn = "N";
    }

    public void setPeriod() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate curDate = LocalDate.now();
        int period = this.getPeriod();
        if (period != 4) {
            this.regDtmYn = "Y";
            this.setRegEndDtm(curDate.format(formatter));

            LocalDate endDate;
            switch (period) {
                case 0:
                    endDate = curDate.minusDays(1);
                    break;
                case 1:
                    endDate = curDate.minusWeeks(1);
                    break;
                case 2:
                    endDate = curDate.minusMonths(1);
                    break;
                case 3:
                    endDate = curDate.minusYears(1);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid period: " + period);
            }

            this.setRegStartDtm(endDate.format(formatter));
        }
    }

    public void setUserInfo(String userNameList) throws UnsupportedEncodingException {
        String decoded = URLDecoder.decode(userNameList, "UTF-8");
        String unescaped  = HtmlUtils.htmlUnescape(decoded);
        this.acl01 = unescaped.split(", ");
        this.userId = this.acl01[0];
    }
}
