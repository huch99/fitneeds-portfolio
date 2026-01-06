package com.project.app.sportTypes.service;

import com.project.app.sportTypes.dto.SportTypeDto.*;
import com.project.app.sportTypes.entity.SportType;
import com.project.app.sportTypes.repository.SportTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportTypeService {

    private final SportTypeRepository repo;

    @Transactional
    public List<Resp> list() {
        List<SportType> list = repo.findAll();

        return list.stream().map(this::toResp).toList();
    }

    @Transactional
    public Resp create(CreateReq req) {
        SportType st = repo.save(
                SportType.builder()
                        .sportNm(req.name().trim())
                        .sportMemo(req.memo() == null ? null : req.memo().trim())
                        .useYn(true)
                        .build()
        );

        return toResp(st);
    }

    @Transactional
    public Resp update(Long id, UpdateReq req) {
        SportType st = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("SportType not found: " + id));

        st.update(req.name().trim(), req.memo() == null ? null : req.memo().trim());
        return toResp(st);
    }

    @Transactional
    public void deactivate(Long id) {
        SportType st = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("SportType not found: " + id));
        st.deactivate();
    }

    private Resp toResp(SportType e) {
        return new Resp(
                e.getSportId(),
                e.getSportNm(),
                e.getSportMemo(),
                Boolean.TRUE.equals(e.getUseYn()),
                e.getRegDt(),
                e.getUpdDt(),
                e.getDelDt()
        );
    }
}
