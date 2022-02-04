package com.activemq.jms;

import com.activemq.jms.dto.Person;
import com.activemq.jms.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class JmsApplication {
	@Autowired
	Producer producer;

	@Value("${activemq.destination}")
	private String destination;

	public static void main(String[] args) {
		SpringApplication.run(JmsApplication.class, args);
	}
	@RestController
	public class StudentController {
		@GetMapping("/")
		public String sendMessage() {
			Person person = new Person();
			person.setName("AFZal");
			producer.sendTo(destination, person);
			return "success";
		}
	}

}
