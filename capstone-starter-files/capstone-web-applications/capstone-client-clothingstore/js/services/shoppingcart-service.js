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
        if(!data)
            return;

        this.cart.total = data.total ?? 0;

        for (const [key, value] of Object.entries(data.items || {})) {
            this.cart.items.push(value);
        }

        // Fallback: compute total if backend didn't include it
        if (!this.cart.total && this.cart.items.length > 0) {
            this.cart.total = this.cart.items.reduce((sum, item) => {
                return sum + (parseFloat(item.product.price) * item.quantity);
            }, 0);
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
        // templateBuilder.build("cart", this.cart, "main");

        const main = document.getElementById("main")
        main.innerHTML = "";

        let div = document.createElement("div");
        div.classList="filter-box";
        main.appendChild(div);

        const contentDiv = document.createElement("div")
        contentDiv.id = "content";
        contentDiv.classList.add("content-form");

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

        // Display cart items
        if (this.cart.items.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.innerText = "Your cart is empty";
            emptyMsg.style.fontSize = "18px";
            emptyMsg.style.color = "#666";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.padding = "40px 20px";
            contentDiv.appendChild(emptyMsg);
        } else {
            // Display each cart item
            this.cart.items.forEach(item => {
                this.buildItem(item, contentDiv)
            });

            // Add cart summary section
            const summaryDiv = document.createElement("div");
            summaryDiv.style.backgroundColor = "#f0f0f0";
            summaryDiv.style.border = "2px solid #333";
            summaryDiv.style.borderRadius = "5px";
            summaryDiv.style.padding = "20px";
            summaryDiv.style.marginTop = "30px";
            summaryDiv.style.textAlign = "right";

            const itemCountDiv = document.createElement("div");
            itemCountDiv.style.fontSize = "14px";
            itemCountDiv.style.color = "#666";
            itemCountDiv.style.marginBottom = "10px";
            itemCountDiv.innerText = `Items in Cart: ${this.cart.items.length}`;
            summaryDiv.appendChild(itemCountDiv);

            const totalLabel = document.createElement("h2");
            totalLabel.innerText = `Cart Total: $${parseFloat(this.cart.total).toFixed(2)}`;
            totalLabel.style.fontSize = "28px";
            totalLabel.style.fontWeight = "bold";
            totalLabel.style.color = "#28a745";
            totalLabel.style.margin = "15px 0";
            summaryDiv.appendChild(totalLabel);

            const checkoutBtn = document.createElement("button");
            checkoutBtn.classList.add("btn", "btn-success");
            checkoutBtn.innerText = "Proceed to Checkout";
            checkoutBtn.style.marginTop = "15px";
            checkoutBtn.style.fontSize = "16px";
            checkoutBtn.style.padding = "12px 30px";
            checkoutBtn.style.width = "100%";
            summaryDiv.appendChild(checkoutBtn);

            contentDiv.appendChild(summaryDiv);
        }
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

    clearCart()
    {

        const url = `${config.baseUrl}/cart`;

        axios.delete(url)
             .then(response => {
                 this.cart = { items: [], total: 0 };
                 this.updateCartDisplay();
                 this.loadCartPage();

             })
             .catch(error => {

                 const data = {
                     error: "Empty cart failed."
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
