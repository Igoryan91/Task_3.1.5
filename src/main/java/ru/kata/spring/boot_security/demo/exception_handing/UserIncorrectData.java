package ru.kata.spring.boot_security.demo.exception_handing;

public class UserIncorrectData {
    private String info;

    public UserIncorrectData(String info) {
        this.info = info;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
