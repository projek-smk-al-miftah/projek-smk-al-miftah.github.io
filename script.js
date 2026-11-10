document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // Fungsi Tambah ke Keranjang
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const name = e.target.getAttribute("data-name");
            const price = e.target.getAttribute("data-price");
            const image = e.target.getAttribute("data-image");

            let cart = JSON.parse(localStorage.getItem("oppo_cart")) || [];
            cart.push({ name, price, image });
            localStorage.setItem("oppo_cart", JSON.stringify(cart));

            updateCartCount();
            alert(`Berhasil menambahkan ${name} ke keranjang!`);
        });
    });

    // Render Keranjang di keranjang.html
    const cartContainer = document.getElementById("cart-items-container");
    if (cartContainer) {
        renderCart();
    }

    // Filter Kategori di produk.html
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            const category = e.target.getAttribute("data-category");
            const products = document.querySelectorAll(".product-card");

            products.forEach(prod => {
                if (category === "all" || prod.getAttribute("data-category") === category) {
                    prod.style.display = "flex";
                } else {
                    prod.style.display = "none";
                }
            });
        });
    });

    // Pencarian produk
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const keyword = e.target.value.toLowerCase();
            const products = document.querySelectorAll(".product-card");

            products.forEach(prod => {
                const title = prod.querySelector("h3").innerText.toLowerCase();
                if (title.includes(keyword)) {
                    prod.style.display = "flex";
                } else {
                    prod.style.display = "none";
                }
            });
        });
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("oppo_cart")) || [];
    const countEl = document.getElementById("cart-count");
    if (countEl) {
        countEl.innerText = cart.length;
    }
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items-container");
    const cart = JSON.parse(localStorage.getItem("oppo_cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Keranjang belanja Anda masih kosong.</p>`;
        return;
    }

    let html = `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
    let total = 0;

    cart.forEach((item, index) => {
        let cleanPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
        total += cleanPrice;
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain;">
                    <div>
                        <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">${item.name}</h4>
                        <p style="color: var(--oppo-green); font-weight: 600;">${item.price}</p>
                    </div>
                </div>
                <button onclick="removeItem(${index})" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Hapus</button>
            </div>
        `;
    });

    html += `</div>
        <div style="margin-top: 2rem; background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.2rem;">Total: <span style="color: var(--oppo-green);">Rp ${total.toLocaleString('id-ID')}</span></h3>
            <button onclick="checkoutWhatsApp()" class="btn-primary" style="background: #25d366;">Checkout via WhatsApp</button>
        </div>
    `;

    cartContainer.innerHTML = html;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("oppo_cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("oppo_cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function checkoutWhatsApp() {
    const cart = JSON.parse(localStorage.getItem("oppo_cart")) || [];
    if (cart.length === 0) return;

    let message = "Halo OPPO Store, saya ingin memesan produk berikut:\n\n";
    let total = 0;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} - ${item.price}\n`;
        total += parseInt(item.price.replace(/[^0-9]/g, ''));
    });

    message += `\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}\nMohon informasi selanjutnya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encodedMessage}`, '_blank');
}
