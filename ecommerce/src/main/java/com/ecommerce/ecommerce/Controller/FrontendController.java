package com.ecommerce.ecommerce.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class FrontendController {

    @GetMapping("/ecommerce/{path}")
    public String forwardReactRoutes(@PathVariable String path) {
        return "index";
    }
}
