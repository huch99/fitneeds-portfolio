package com.project.app.pass.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PassController {

    // 테스트용 API
    @GetMapping("/api/pass/test")
    public String test() {
        System.out.println(">>> PassController TEST API 호출됨");
        return "PASS CONTROLLER TEST OK";
    }
}
