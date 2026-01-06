package com.project.app.sportTypes.controller;

import com.project.app.sportTypes.dto.SportTypeDto.*;
import com.project.app.sportTypes.service.SportTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sport-types")
public class SportTypeController {

    private final SportTypeService sportTypeService;

    @GetMapping
    public List<Resp> list() {
        return sportTypeService.list();
    }

    @PostMapping("/new")
    public Resp create(@RequestBody @Valid CreateReq req) {
        return sportTypeService.create(req);
    }

    @PutMapping("/{id}")
    public Resp update(@PathVariable Long id, @RequestBody @Valid UpdateReq req) {
        return sportTypeService.update(id, req);
    }

    @PatchMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        sportTypeService.deactivate(id);
    }
}
