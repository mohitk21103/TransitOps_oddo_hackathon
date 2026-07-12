package com.transitops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class TransitopsApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransitopsApplication.class, args);
	}

}
