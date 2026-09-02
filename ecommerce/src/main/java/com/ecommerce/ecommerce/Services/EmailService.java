package com.ecommerce.ecommerce.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvoice(String toEmail, byte[] pdfData) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Invoice");
            helper.setText("Please find your invoice attached.");

            helper.addAttachment("invoice.pdf",
                    new ByteArrayResource(pdfData));

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP");
            helper.setText("Your OTP for password reset is: " + otp);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}