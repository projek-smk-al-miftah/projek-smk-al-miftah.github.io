
// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}

// KERANJANG
function getCart() {
    return JSON.parse(localStorage.getItem("oppoCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("oppoCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById("cartCount");
    if (count) {
        count.textContent = getCart().reduce((total, item) => total + item.qty, 0);
    }
}

// TAMBAH PRODUK
document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        let cart = getCart();
        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        saveCart(cart);
        alert(name + " berhasil ditambahkan ke keranjang!");
    });
});

// PENCARIAN
function searchProduct() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const keyword = input.value.trim();
    if (keyword) {
        window.location.href = "produk.html?cari=" + encodeURIComponent(keyword);
    }
}

// TAMPILKAN KERANJANG
function renderCart() {
    const container = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (!container || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Keranjang belanja masih kosong.</p>";
        totalElement.textContent = "Rp 0";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;

        return `
            <div class="cart-row">
                <div>
                    <strong>${item.name}</strong>
                    <p>${formatRupiah(item.price)} × ${item.qty}</p>
                </div>
                <button onclick="removeCart(${index})">Hapus</button>
            </div>
        `;
    }).join("");

    totalElement.textContent = formatRupiah(total);
}

function removeCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// PESAN MELALUI WHATSAPP
function checkoutWhatsApp() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const nomorWhatsApp = "6281234567890";

    let pesan = "Halo OPPO STORE, saya ingin memesan:%0A";

    cart.forEach(item => {
        pesan += `%0A${encodeURIComponent(item.name)} x${item.qty}`;
        pesan += `%0A${encodeURIComponent(formatRupiah(item.price * item.qty))}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    pesan += `%0ATotal: ${encodeURIComponent(formatRupiah(total))}`;

    window.open("https://wa.me/" + nomorWhatsApp + "?text=" + pesan, "_blank");
}

// JALANKAN
updateCartCount();
renderCart();
