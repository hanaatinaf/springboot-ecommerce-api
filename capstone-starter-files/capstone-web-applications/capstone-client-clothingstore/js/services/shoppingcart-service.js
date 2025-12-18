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
        cartHeader.classList.add("cart-header")

        const h1 = document.createElement("h1")
        h1.innerText = "Cart";
        cartHeader.appendChild(h1);

        const button = document.createElement("button");
        button.classList.add("btn")
        button.classList.add("btn-danger")
        button.innerText = "Clear";
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

    buildItem(item, parent)
    {
        let itemDiv = document.createElement("div");
        itemDiv.style.border = "1px solid #ddd";
        itemDiv.style.borderRadius = "5px";
        itemDiv.style.padding = "15px";
        itemDiv.style.marginBottom = "15px";
        itemDiv.style.backgroundColor = "#f9f9f9";

        // Row 1: Image, Name, Price
        let row1 = document.createElement("div");
        row1.style.display = "flex";
        row1.style.gap = "20px";
        row1.style.marginBottom = "10px";

        // Image
        let imgContainer = document.createElement("div");
        imgContainer.style.flexShrink = "0";
        let img = document.createElement("img");
        img.src = `/images/products/${item.product.imageUrl}`;
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.objectFit = "cover";
        img.style.border = "1px solid #ddd";
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            showImageDetailForm(item.product.name, img.src)
        })
        imgContainer.appendChild(img);
        row1.appendChild(imgContainer);

        // Product info
        let infoDiv = document.createElement("div");
        infoDiv.style.flex = "1";

        let nameH3 = document.createElement("h3");
        nameH3.innerText = item.product.name;
        nameH3.style.margin = "0 0 8px 0";
        nameH3.style.fontSize = "20px";
        infoDiv.appendChild(nameH3);

        let priceSpan = document.createElement("span");
        priceSpan.innerText = `$${parseFloat(item.product.price).toFixed(2)}`;
        priceSpan.style.fontSize = "18px";
        priceSpan.style.fontWeight = "bold";
        priceSpan.style.color = "#28a745";
        infoDiv.appendChild(priceSpan);

        let descP = document.createElement("p");
        descP.innerText = item.product.description;
        descP.style.fontSize = "14px";
        descP.style.color = "#666";
        descP.style.margin = "10px 0";
        infoDiv.appendChild(descP);

        row1.appendChild(infoDiv);
        itemDiv.appendChild(row1);

        // Row 2: Quantity, Line Total, Remove Button
        let row2 = document.createElement("div");
        row2.style.display = "flex";
        row2.style.gap = "20px";
        row2.style.alignItems = "center";
        row2.style.paddingTop = "10px";
        row2.style.borderTop = "1px solid #ddd";

        // Quantity Control
        let qtyLabel = document.createElement("label");
        qtyLabel.innerText = "Quantity: ";
        qtyLabel.style.fontWeight = "bold";
        row2.appendChild(qtyLabel);

        let qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = "1";
        qtyInput.value = item.quantity;
        qtyInput.style.width = "70px";
        qtyInput.style.padding = "8px";
        qtyInput.style.border = "1px solid #ddd";
        qtyInput.style.borderRadius = "4px";
        qtyInput.addEventListener("change", () => {
            let newQty = parseInt(qtyInput.value || "0", 10);
            if (isNaN(newQty) || newQty < 0) newQty = 0;

            const url = `${config.baseUrl}/cart/products/${item.product.productId}`;
            axios.put(url, { quantity: newQty })
                .then(response => {
                    this.setCart(response.data);
                    this.updateCartDisplay();
                    this.loadCartPage();
                })
                .catch(error => {
                    const data = {
                        error: "Update quantity failed."
                    };
                    templateBuilder.append("error", data, "errors")
                })
        });
        row2.appendChild(qtyInput);

        // Line Total
        let lineTotalDiv = document.createElement("div");
        lineTotalDiv.style.flex = "1";
        lineTotalDiv.style.textAlign = "right";
        lineTotalDiv.style.fontSize = "16px";
        lineTotalDiv.style.fontWeight = "bold";
        const lineTotal = (item.product.price * item.quantity).toFixed(2);
        lineTotalDiv.innerText = `Line Total: $${lineTotal}`;
        row2.appendChild(lineTotalDiv);

        // Remove Button
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.innerText = "Remove";
        removeBtn.style.padding = "8px 15px";
        removeBtn.style.whiteSpace = "nowrap";
        removeBtn.addEventListener("click", () => {
            this.removeFromCart(item.product.productId);
        });
        row2.appendChild(removeBtn);

        itemDiv.appendChild(row2);
        parent.appendChild(itemDiv);
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
