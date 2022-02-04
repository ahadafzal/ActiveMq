package com.activemq.jms.producer;

import com.activemq.jms.dto.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
@Component
@Slf4j
public class Producer {
    @Autowired
    private JmsTemplate jmsTemplate;
    public void sendTo(String destination, Person student) {
        jmsTemplate.convertAndSend(destination, student);
        log.info("Producer> Message Sent");
    }
}
