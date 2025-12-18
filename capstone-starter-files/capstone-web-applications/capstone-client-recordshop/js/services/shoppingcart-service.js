let cartService;

class ShoppingCartService {

    cart = {
        items:[],
        total:0
    };

    addToCart(productId)
    {
        const url = `${config.baseUrl}/cart/products/${productId}`;
        // const headers = userService.getHeaders();

        axios.post(url, {})// ,{headers})
            .then(response => {
                this.setCart(response.data)

                this.updateCartDisplay()

            })
            .catch(error => {

                const data = {
                    error: "Add to cart failed."
                };

                templateBuilder.append("error", data, "errors")
            })
    }

    setCart(data)
    {
        this.cart = {
            items: [],
            total: 0
        }

        this.cart.total = data.total;

        for (const [key, value] of Object.entries(data.items)) {
            this.cart.items.push(value);
        }
    }

    loadCart()
    {

        const url = `${config.baseUrl}/cart`;

        axios.get(url)
            .then(response => {
                this.setCart(response.data)

                this.updateCartDisplay()

            })
            .catch(error => {

                const data = {
                    error: "Load cart failed."
                };

                templateBuilder.append("error", data, "errors")
            })

    }

    loadCartPage()
    {
        const main = document.getElementById("main")
        main.innerHTML = "";

        let div = document.createElement("div");
        div.classList="filter-box";
        main.appendChild(div);

        const contentDiv = document.createElement("div")
        contentDiv.id = "content";
        contentDiv.classList.add("content-form");
        contentDiv.style.maxWidth = "1200px";
        contentDiv.style.margin = "0 auto";

        const cartHeader = document.createElement("div")
        cartHeader.style.display = "flex";
        cartHeader.style.justifyContent = "space-between";
        cartHeader.style.alignItems = "center";
        cartHeader.style.marginBottom = "30px";
        cartHeader.style.paddingBottom = "20px";
        cartHeader.style.borderBottom = "2px solid #e0e0e0";

        const h1 = document.createElement("h1")
        h1.innerText = "Shopping Cart";
        h1.style.margin = "0";
        h1.style.fontSize = "28px";
        h1.style.color = "#111";
        cartHeader.appendChild(h1);

        const button = document.createElement("button");
        button.classList.add("btn")
        button.innerText = "Clear Cart";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#d73212";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.fontWeight = "500";
        button.addEventListener("click", () => this.clearCart());
        cartHeader.appendChild(button)

        contentDiv.appendChild(cartHeader)
        main.appendChild(contentDiv);

        // Main container for items and summary
        const mainContent = document.createElement("div");
        mainContent.style.display = "flex";
        mainContent.style.gap = "30px";
        mainContent.style.maxWidth = "1200px";
        mainContent.style.margin = "0 auto";

        // Items container (left side)
        const itemsContainer = document.createElement("div");
        itemsContainer.style.flex = "1";

        // Display cart items
        if (this.cart.items.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.padding = "60px 20px";
            emptyMsg.style.backgroundColor = "#f9f9f9";
            emptyMsg.style.borderRadius = "8px";
            
            let emptyIcon = document.createElement("p");
            emptyIcon.innerText = "🛒";
            emptyIcon.style.fontSize = "48px";
            emptyIcon.style.margin = "0 0 15px 0";
            emptyMsg.appendChild(emptyIcon);

            let emptyText = document.createElement("p");
            emptyText.innerText = "Your cart is empty";
            emptyText.style.fontSize = "18px";
            emptyText.style.color = "#666";
            emptyText.style.margin = "0";
            emptyMsg.appendChild(emptyText);

            itemsContainer.appendChild(emptyMsg);
        } else {
            this.cart.items.forEach(item => {
                this.buildItem(item, itemsContainer)
            });
        }

        mainContent.appendChild(itemsContainer);

        // Summary section (right side - sticky)
        const summaryDiv = document.createElement("div");
        summaryDiv.style.width = "320px";
        summaryDiv.style.backgroundColor = "#f9f9f9";
        summaryDiv.style.border = "1px solid #e0e0e0";
        summaryDiv.style.borderRadius = "8px";
        summaryDiv.style.padding = "20px";
        summaryDiv.style.height = "fit-content";
        summaryDiv.style.position = "sticky";
        summaryDiv.style.top = "20px";

        // Order summary title
        const summaryTitle = document.createElement("h2");
        summaryTitle.innerText = "Order Summary";
        summaryTitle.style.fontSize = "18px";
        summaryTitle.style.margin = "0 0 20px 0";
        summaryTitle.style.color = "#111";
        summaryDiv.appendChild(summaryTitle);

        // Subtotal
        const subtotalDiv = document.createElement("div");
        subtotalDiv.style.display = "flex";
        subtotalDiv.style.justifyContent = "space-between";
        subtotalDiv.style.marginBottom = "12px";
        subtotalDiv.style.fontSize = "14px";

        let subtotalLabel = document.createElement("span");
        subtotalLabel.innerText = `Subtotal (${this.cart.items.length} item${this.cart.items.length !== 1 ? 's' : ''}):`;
        subtotalLabel.style.color = "#555";
        subtotalDiv.appendChild(subtotalLabel);

        let subtotalAmount = document.createElement("span");
        subtotalAmount.innerText = `$${parseFloat(this.cart.total).toFixed(2)}`;
        subtotalAmount.style.color = "#111";
        subtotalDiv.appendChild(subtotalAmount);
        summaryDiv.appendChild(subtotalDiv);

        // Shipping
        const shippingDiv = document.createElement("div");
        shippingDiv.style.display = "flex";
        shippingDiv.style.justifyContent = "space-between";
        shippingDiv.style.marginBottom = "12px";
        shippingDiv.style.fontSize = "14px";

        let shippingLabel = document.createElement("span");
        shippingLabel.innerText = "Shipping:";
        shippingLabel.style.color = "#555";
        shippingDiv.appendChild(shippingLabel);

        let shippingAmount = document.createElement("span");
        shippingAmount.innerText = "Free";
        shippingAmount.style.color = "#28a745";
        shippingAmount.style.fontWeight = "bold";
        shippingDiv.appendChild(shippingAmount);
        summaryDiv.appendChild(shippingDiv);

        // Tax
        const taxDiv = document.createElement("div");
        taxDiv.style.display = "flex";
        taxDiv.style.justifyContent = "space-between";
        taxDiv.style.marginBottom = "20px";
        taxDiv.style.fontSize = "14px";
        taxDiv.style.paddingBottom = "20px";
        taxDiv.style.borderBottom = "1px solid #ddd";

        let taxLabel = document.createElement("span");
        taxLabel.innerText = "Tax (est.):";
        taxLabel.style.color = "#555";
        taxDiv.appendChild(taxLabel);

        let taxAmount = document.createElement("span");
        const tax = (this.cart.total * 0.08).toFixed(2);
        taxAmount.innerText = `$${tax}`;
        taxAmount.style.color = "#111";
        taxDiv.appendChild(taxAmount);
        summaryDiv.appendChild(taxDiv);

        // Total
        const totalDiv = document.createElement("div");
        totalDiv.style.display = "flex";
        totalDiv.style.justifyContent = "space-between";
        totalDiv.style.alignItems = "center";
        totalDiv.style.marginBottom = "20px";

        let totalLabel = document.createElement("span");
        totalLabel.innerText = "Total:";
        totalLabel.style.fontSize = "18px";
        totalLabel.style.fontWeight = "bold";
        totalLabel.style.color = "#111";
        totalDiv.appendChild(totalLabel);

        let totalAmount = document.createElement("span");
        const finalTotal = (parseFloat(this.cart.total) + parseFloat(tax)).toFixed(2);
        totalAmount.innerText = `$${finalTotal}`;
        totalAmount.style.fontSize = "20px";
        totalAmount.style.fontWeight = "bold";
        totalAmount.style.color = "#d73212";
        totalDiv.appendChild(totalAmount);
        summaryDiv.appendChild(totalDiv);

        // Proceed to checkout button
        if (this.cart.items.length > 0) {
            const checkoutBtn = document.createElement("button");
            checkoutBtn.classList.add("btn");
            checkoutBtn.innerText = "Proceed to Checkout";
            checkoutBtn.style.width = "100%";
            checkoutBtn.style.padding = "12px";
            checkoutBtn.style.backgroundColor = "#28a745";
            checkoutBtn.style.color = "#fff";
            checkoutBtn.style.border = "none";
            checkoutBtn.style.borderRadius = "4px";
            checkoutBtn.style.cursor = "pointer";
            checkoutBtn.style.fontSize = "16px";
            checkoutBtn.style.fontWeight = "bold";
            checkoutBtn.style.marginBottom = "10px";
            checkoutBtn.addEventListener("mouseover", () => {
                checkoutBtn.style.backgroundColor = "#218838";
            });
            checkoutBtn.addEventListener("mouseout", () => {
                checkoutBtn.style.backgroundColor = "#28a745";
            });
            summaryDiv.appendChild(checkoutBtn);
        }

        mainContent.appendChild(summaryDiv);
        contentDiv.appendChild(mainContent);
    }

    buildItem(cartItem, container) {
        const itemDiv = document.createElement("div");
        itemDiv.innerText = cartItem.name;
        itemDiv.classList.add("cartItem");
        itemDiv.style.marginBottom = "15px";

        const priceDiv = document.createElement("div");
        priceDiv.innerText = "Price: $" + parseFloat(cartItem.price).toFixed(2);

        const quantityDiv = document.createElement("div");
        quantityDiv.innerText = "Quantity: ";

        const quantitySelect = document.createElement("select");
        quantitySelect.name = "quantity";

        for (let i = 1; i <= 10; i++) {
            const option = document.createElement("option");
            option.value = i;
            if (i === cartItem.quantity) {
                option.selected = true;
            }
            option.innerText = i;
            quantitySelect.appendChild(option);
        }

        quantityDiv.appendChild(quantitySelect);

        quantitySelect.addEventListener("change", () => {
            const newQuantity = parseInt(quantitySelect.value);
            if (newQuantity !== cartItem.quantity) {
                this.updateQuantity(cartItem.productId, newQuantity);
            }
        });

        const updateBtn = document.createElement("button");
        updateBtn.innerText = "Update";
        updateBtn.classList.add("btn", "btn-success");
        updateBtn.addEventListener("click", () => {
            const newQuantity = parseInt(quantitySelect.value);
            if (newQuantity !== cartItem.quantity) {
                this.updateQuantity(cartItem.productId, newQuantity);
            }
        });

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.innerText = "Remove from cart";
        removeBtn.addEventListener("click", () => {
            this.removeFromCart(cartItem.productId);
        });

        itemDiv.appendChild(priceDiv);
        itemDiv.appendChild(quantityDiv);
        itemDiv.appendChild(updateBtn);
        itemDiv.appendChild(removeBtn);
        container.appendChild(itemDiv);
    }

    clearCart()
    {

        const url = `${config.baseUrl}/cart`;

        axios.delete(url)
             .then(response => {
                 this.setCart(response.data);
                 this.updateCartDisplay()
                 this.loadCartPage()

             })
             .catch(error => {

                 const data = {
                     error: "Empty cart failed."
                 };

                 templateBuilder.append("error", data, "errors")
             })
    }

    removeFromCart(productId)
    {
        const url = `${config.baseUrl}/cart/products/${productId}`;

        axios.delete(url)
             .then(response => {
                 this.setCart(response.data)
                 this.updateCartDisplay()
                 this.loadCartPage()
             })
             .catch(error => {
                 const data = {
                     error: "Remove from cart failed."
                 };
                 templateBuilder.append("error", data, "errors")
             })
    }

    updateCartDisplay()
    {
        try {
            const itemCount = this.cart.items.length;
            const cartControl = document.getElementById("cart-items")

            cartControl.innerText = itemCount;
        }
        catch (e) {

        }
    }
}





document.addEventListener('DOMContentLoaded', () => {
    cartService = new ShoppingCartService();

    if(userService.isLoggedIn())
    {
        cartService.loadCart();
    }

});
