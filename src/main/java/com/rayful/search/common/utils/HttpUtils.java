package com.rayful.search.common.utils;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;

public class HttpUtils {
    private HttpUtils() {}

    public static HttpHeaders getHeaders(String userId) {
        // 암호화에 사용할 마스터 비밀번호
        String masterPassword = "@standardSecurityKey";
        String algorithm = "PBEWithMD5AndDES";

        // 암호화 인스턴스 생성
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword(masterPassword);
        encryptor.setAlgorithm(algorithm);

        String encryptedUserId = encryptor.encrypt(userId);


        HttpHeaders headers = new HttpHeaders();
        headers.add("user-id", encryptedUserId);
       return headers;
    }
}
