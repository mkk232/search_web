package com.rayful.search.common;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class EncryptorTestClass {

    public static void main(String[] args) {
        String attachNm = "2024年<em>1</em>季度盘点报告.xls";
        System.out.println("before attachNm = " + attachNm);
        attachNm = attachNm.replace("<em>", "").replace("</em>", "");
        System.out.println("after attachNm = " + attachNm);
        /*// 암호화에 사용할 마스터 비밀번호
        String masterPassword = "@standardSecurityKey";
        String algorithm = "PBEWithMD5AndDES";

        // 암호화 인스턴스 생성
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword(masterPassword);
        encryptor.setAlgorithm(algorithm);

        // 암호화할 원본 문자열
        String userId = "mkk232";

        // 원본 문자열 암호화
        String encryptedUserId = encryptor.encrypt(userId);

        // 암호화 문자열 복호화
        String decryptedUserId = encryptor.decrypt(encryptedUserId);

        System.out.println("암호화된 문자열: " + encryptedUserId);
        System.out.println("복호화된 문자열: " + decryptedUserId);*/
    }
}
