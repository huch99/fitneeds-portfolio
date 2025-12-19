package com.project.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
	"mybatis.mapper-locations=",
	"mybatis.type-aliases-package="
})
@ActiveProfiles("test")
class AppApplicationTests {

	@Test
	void contextLoads() {
	}

}
