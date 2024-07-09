package com.rayful.search.common.utils;

import org.assertj.core.internal.bytebuddy.asm.Advice;
import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class ConvertUtilsTest {

    @Test
    void convertResultMap() throws ParseException {

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        String regDtm = "2024-05-04T14:29:00";
        String updDtm = "2024-07-04T14:29:00";

        Date regDate = simpleDateFormat.parse(regDtm);
        Date updDate = simpleDateFormat.parse(updDtm);

        System.out.println("regDate = " + regDate.compareTo(updDate));
        System.out.println("regDate = " + updDate.compareTo(regDate));

        
//        LocalDateTime regDt = LocalDateTime.parse(regDtm, formatter);
//        LocalDateTime updDt = LocalDateTime.parse(updDtm, formatter);


//        System.out.println(regDt.compareTo(updDt));
    }
}