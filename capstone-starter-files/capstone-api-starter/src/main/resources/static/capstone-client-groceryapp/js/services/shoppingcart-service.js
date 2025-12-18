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

    buildItem(item, parent)
    {
        let itemDiv = document.createElement("div");
        itemDiv.style.border = "1px solid #e0e0e0";
        itemDiv.style.borderRadius = "8px";
        itemDiv.style.padding = "20px";
        itemDiv.style.marginBottom = "15px";
        itemDiv.style.backgroundColor = "#fff";
        itemDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

        // Main flex container for image + details
        let mainRow = document.createElement("div");
        mainRow.style.display = "flex";
        mainRow.style.gap = "20px";
        mainRow.style.alignItems = "flex-start";

        // Image
        let imgContainer = document.createElement("div");
        imgContainer.style.flexShrink = "0";
        let img = document.createElement("img");
        img.src = `images/products/${item.product.imageUrl}`;
        img.style.width = "120px";
        img.style.height = "120px";
        img.style.objectFit = "cover";
        img.style.border = "1px solid #e0e0e0";
        img.style.borderRadius = "4px";
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            showImageDetailForm(item.product.name, img.src)
        })
        imgContainer.appendChild(img);
        mainRow.appendChild(imgContainer);

        // Product info section
        let infoDiv = document.createElement("div");
        infoDiv.style.flex = "1";

        let nameH3 = document.createElement("h3");
        nameH3.innerText = item.product.name;
        nameH3.style.margin = "0 0 12px 0";
        nameH3.style.fontSize = "18px";
        nameH3.style.color = "#111";
        nameH3.style.fontWeight = "500";
        infoDiv.appendChild(nameH3);

        let descP = document.createElement("p");
        descP.innerText = item.product.description;
        descP.style.fontSize = "13px";
        descP.style.color = "#666";
        descP.style.margin = "0 0 12px 0";
        descP.style.lineHeight = "1.4";
        infoDiv.appendChild(descP);

        // Price and Quantity Row
        let controlRow = document.createElement("div");
        controlRow.style.display = "flex";
        controlRow.style.gap = "30px";
        controlRow.style.alignItems = "center";
        controlRow.style.marginBottom = "12px";

        // Price
        let priceDiv = document.createElement("div");
        let priceSpan = document.createElement("span");
        priceSpan.innerText = `$${parseFloat(item.product.price).toFixed(2)}`;
        priceSpan.style.fontSize = "20px";
        priceSpan.style.fontWeight = "bold";
        priceSpan.style.color = "#d73212";
        priceDiv.appendChild(priceSpan);
        controlRow.appendChild(priceDiv);

        // Quantity Control
        let qtyDiv = document.createElement("div");
        qtyDiv.style.display = "flex";
        qtyDiv.style.alignItems = "center";
        qtyDiv.style.gap = "10px";

        let qtyLabel = document.createElement("label");
        qtyLabel.innerText = "Qty:";
        qtyLabel.style.fontSize = "14px";
        qtyDiv.appendChild(qtyLabel);

        let qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = "1";
        qtyInput.value = item.quantity;
        qtyInput.style.width = "60px";
        qtyInput.style.padding = "6px";
        qtyInput.style.border = "1px solid #bbb";
        qtyInput.style.borderRadius = "4px";
        qtyInput.style.fontSize = "14px";
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
        qtyDiv.appendChild(qtyInput);
        controlRow.appendChild(qtyDiv);

        infoDiv.appendChild(controlRow);

        // Line Total
        let lineTotalDiv = document.createElement("div");
        lineTotalDiv.style.display = "flex";
        lineTotalDiv.style.justifyContent = "space-between";
        lineTotalDiv.style.alignItems = "center";
        lineTotalDiv.style.paddingTop = "12px";
        lineTotalDiv.style.borderTop = "1px solid #e0e0e0";
        lineTotalDiv.style.marginTop = "12px";

        const lineTotal = (item.product.price * item.quantity).toFixed(2);
        let lineTotalLabel = document.createElement("span");
        lineTotalLabel.innerText = `Subtotal (${item.quantity} item${item.quantity > 1 ? 's' : ''}):`;
        lineTotalLabel.style.fontSize = "14px";
        lineTotalLabel.style.color = "#555";
        lineTotalDiv.appendChild(lineTotalLabel);

        let lineTotalAmount = document.createElement("span");
        lineTotalAmount.innerText = `$${lineTotal}`;
        lineTotalAmount.style.fontSize = "16px";
        lineTotalAmount.style.fontWeight = "bold";
        lineTotalAmount.style.color = "#d73212";
        lineTotalDiv.appendChild(lineTotalAmount);

        infoDiv.appendChild(lineTotalDiv);

        // Remove Button
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("btn");
        removeBtn.innerText = "Delete";
        removeBtn.style.marginTop = "12px";
        removeBtn.style.padding = "8px 20px";
        removeBtn.style.backgroundColor = "#fff";
        removeBtn.style.color = "#0066cc";
        removeBtn.style.border = "1px solid #0066cc";
        removeBtn.style.borderRadius = "4px";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.fontSize = "14px";
        removeBtn.style.fontWeight = "500";
        removeBtn.style.transition = "all 0.2s";
        removeBtn.addEventListener("mouseover", () => {
            removeBtn.style.backgroundColor = "#f0f0f0";
        });
        removeBtn.addEventListener("mouseout", () => {
            removeBtn.style.backgroundColor = "#fff";
        });
        removeBtn.addEventListener("click", () => {
            this.removeFromCart(item.product.productId);
        });
        infoDiv.appendChild(removeBtn);

        mainRow.appendChild(infoDiv);
        itemDiv.appendChild(mainRow);
        parent.appendChild(itemDiv);
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
