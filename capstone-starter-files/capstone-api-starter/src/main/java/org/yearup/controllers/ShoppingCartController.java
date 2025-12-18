package org.yearup.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.ProductDao;
import org.yearup.data.ShoppingCartDao;
import org.yearup.data.UserDao;
import org.yearup.models.Product;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;
import org.yearup.models.User;

// convert this class to a REST controller
// only logged in users should have access to these actions
@RestController
@RequestMapping("cart")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class ShoppingCartController
{
    // a shopping cart requires
    private ShoppingCartDao shoppingCartDao;
    private UserDao userDao;
    private ProductDao productDao;

    @Autowired
    public ShoppingCartController(ShoppingCartDao shoppingCartDao, UserDao userDao, ProductDao productDao)
    {
        this.shoppingCartDao = shoppingCartDao;
        this.userDao = userDao;
        this.productDao = productDao;
    }

    // each method in this controller requires a Principal object as a parameter
    @GetMapping
    public ShoppingCart getCart(Principal principal)
    {
        try
        {
            // get the currently logged in username
            String userName = principal.getName();
            // find database user by userId
            User user = userDao.getByUserName(userName);
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            int userId = user.getId();

            // use the shoppingcartDao to get all items in the cart and return the cart
            return shoppingCartDao.getByUserId(userId);
        }
        catch(ResponseStatusException e)
        {
            throw e;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    // add a POST method to add a product to the cart - the url should be
    // https://localhost:8080/cart/products/15 (15 is the productId to be added
    @PostMapping("/products/{productId}")
    public ShoppingCart addProduct(Principal principal, @PathVariable int productId)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            Product product = productDao.getById(productId);
            if (product == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            shoppingCartDao.addProduct(user.getId(), productId);
            return shoppingCartDao.getByUserId(user.getId());
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    // add a PUT method to update an existing product in the cart - the url should be
    // https://localhost:8080/cart/products/15 (15 is the productId to be updated)
    // the BODY should be a ShoppingCartItem - quantity is the only value that will be updated
    @PutMapping("/products/{productId}")
    public ShoppingCart updateProduct(Principal principal, @PathVariable int productId, @RequestBody ShoppingCartItem item)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            Product product = productDao.getById(productId);
            if (product == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            ShoppingCart cart = shoppingCartDao.getByUserId(user.getId());
            if (!cart.contains(productId))
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not in cart");

            item.setProduct(product);

            if (item.getQuantity() <= 0)
            {
                shoppingCartDao.deleteProduct(user.getId(), productId);
            }
            else
            {
                shoppingCartDao.updateProduct(user.getId(), item);
            }
            return shoppingCartDao.getByUserId(user.getId());
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    @DeleteMapping("/products/{productId}")
    public ShoppingCart deleteProduct(Principal principal, @PathVariable int productId)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            ShoppingCart cart = shoppingCartDao.getByUserId(user.getId());
            if (!cart.contains(productId))
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not in cart");

            shoppingCartDao.deleteProduct(user.getId(), productId);
            return shoppingCartDao.getByUserId(user.getId());
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    // add a DELETE method to clear all products from the current users cart
    // https://localhost:8080/cart
    @DeleteMapping
    public ShoppingCart clearCart(Principal principal)
    {
        try
        {
            User user = userDao.getByUserName(principal.getName());
            if (user == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

            shoppingCartDao.clearCart(user.getId());
            return shoppingCartDao.getByUserId(user.getId());
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

}
