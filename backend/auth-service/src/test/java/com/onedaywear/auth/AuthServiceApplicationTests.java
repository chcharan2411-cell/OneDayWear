package com.onedaywear.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceApplicationTests {

	@Test
	void printHash() {
		System.out.println("BCRYPT_RESULT:" + new BCryptPasswordEncoder().encode("Charan@33Z"));
	}

}