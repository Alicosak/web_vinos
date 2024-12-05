const wines = {
    'quantity-1': { name: 'Malbec Reserva', price: 45.00, quantity: 0 },
    'quantity-2': { name: 'Cabernet Sauvignon', price: 52.00, quantity: 0 },
    'quantity-3': { name: 'Chardonnay Premium', price: 38.00, quantity: 0 },
    'quantity-4': { name: 'Merlot Gran Reserva', price: 48.00, quantity: 0 },
    'quantity-5': { name: 'Sauvignon Blanc', price: 35.00, quantity: 0 },
    'quantity-6': { name: 'Rosé Special', price: 32.00, quantity: 0 }
};

function incrementQuantity(id) {
    wines[id].quantity++;
    updateQuantityDisplay(id);
    updateFloatingCart();
    hideOrderForm();
}

function decrementQuantity(id) {
    if (wines[id].quantity > 0) {
        wines[id].quantity--;
        updateQuantityDisplay(id);
        updateFloatingCart();
        hideOrderForm();
    }
}

function updateQuantityDisplay(id) {
    document.getElementById(id).textContent = wines[id].quantity;
}

function calculateTotal() {
    return Object.values(wines).reduce((total, wine) => {
        return total + (wine.price * wine.quantity);
    }, 0);
}

function updateFloatingCart() {
    const total = calculateTotal();
    const floatingCart = document.getElementById('floating-cart');
    const cartTotal = floatingCart.querySelector('.cart-total');
    const cartText = floatingCart.querySelector('.cart-text');
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    floatingCart.classList.toggle('visible', total > 0);
    cartText.classList.remove('hidden');
}

function hideOrderForm() {
    document.getElementById('orderForm').classList.add('hidden');
    const cartText = document.querySelector('.cart-text');
    cartText.classList.remove('hidden');
}

function showOrderForm() {
    if (calculateTotal() > 0) {
        const orderItems = document.getElementById('order-items');
        orderItems.innerHTML = '';
        
        Object.values(wines).forEach(wine => {
            if (wine.quantity > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <p>${wine.name} x ${wine.quantity} = $${(wine.price * wine.quantity).toFixed(2)}</p>
                `;
                orderItems.appendChild(itemDiv);
            }
        });
        
        document.getElementById('totalPrice').textContent = calculateTotal().toFixed(2);
        document.getElementById('orderForm').classList.remove('hidden');
        document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
        
        const cartText = document.querySelector('.cart-text');
        cartText.classList.add('hidden');
    }
}

function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    let orderDetails = '¡Nuevo pedido de vino!\n\n';
    Object.values(wines).forEach(wine => {
        if (wine.quantity > 0) {
            orderDetails += `- ${wine.name} x ${wine.quantity} = $${(wine.price * wine.quantity).toFixed(2)}\n`;
        }
    });
    
    const message = `${orderDetails}
Total a pagar: $${calculateTotal().toFixed(2)}

Datos del cliente:
- Nombre: ${name}
- Email: ${email}
- Teléfono: ${phone}
- Dirección: ${address}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '960312595';
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    document.getElementById('wineForm').reset();
    document.getElementById('orderForm').classList.add('hidden');
    
    const cartText = document.querySelector('.cart-text');
    cartText.classList.remove('hidden');
    
    Object.keys(wines).forEach(id => {
        wines[id].quantity = 0;
        updateQuantityDisplay(id);
    });
    updateFloatingCart();
}