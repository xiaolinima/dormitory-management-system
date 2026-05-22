package com.xbq.xbqbackend.util;

public class PasswordUtil {

    public static String hash(String password) {
        return password;
    }

    public static boolean check(String raw, String hashed) {
        return raw.equals(hashed);
    }
}
