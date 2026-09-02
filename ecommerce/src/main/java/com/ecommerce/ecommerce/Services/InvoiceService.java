package com.ecommerce.ecommerce.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.ecommerce.ecommerce.Entity.SalesOrder;
import com.ecommerce.ecommerce.Repository.InvoiceRepo;
import java.time.LocalDateTime;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepo repo;

    public InvoiceEntity createInvoice(SalesOrder order) {

        InvoiceEntity i = new InvoiceEntity();

        i.setOrderId(order.getId());

        // ✅ FIXED
        i.setCustomerName(order.getCustomerName());
        // i.setCustomerEmail(order.getCustomerEmail());

        i.setProductName(order.getProductName());
        i.setQuantity(order.getQuantity());
        i.setPrice(order.getPrice());
        i.setTotalAmount(order.getTotalAmount());
        i.setPaymentMethod(order.getPaymentMethod());

        i.setInvoiceNumber("INV-" + System.currentTimeMillis());
        i.setInvoiceDate(LocalDateTime.now());

        return repo.save(i);
    }
}