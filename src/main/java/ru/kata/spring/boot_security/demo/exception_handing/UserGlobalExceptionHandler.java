package ru.kata.spring.boot_security.demo.exception_handing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserGlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<UserIncorrectData> handleException(UsernameAlreadyTakenException exception) {
        return new ResponseEntity<>(new UserIncorrectData(exception.getMessage()), HttpStatus.CONFLICT);
    }
}
