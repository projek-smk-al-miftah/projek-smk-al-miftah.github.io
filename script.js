
const WA_NUMBER = "6281234567890";

const products = [
    {
        id: 1,
        name: "OPPO A Series",
        price: 1999000,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        category: "A Series",
        description: "Smartphone pilihan untuk kebutuhan sehari-hari."
    },
    {
        id: 2,
        name: "OPPO Reno Series",
        price: 4999000,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        category: "Reno Series",
        description: "Desain elegan dan tampilan modern."
    },
    {
        id: 3,
        name: "OPPO Find Series",
        price: 9999000,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
        category: "Find Series",
        description: "Smartphone kelas premium."
    },
    {
        id: 4,
        name: "OPPO A Premium",
        price: 2799000,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        category: "A Series",
        description: "Nyaman untuk aktivitas harian."
    }
];

const rupiah = value =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);

function productCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>${rupiah(product.price)}</strong></p>
            <a class="btn" href="detail.html?id=${product.id}">
                Detail Produk
            </a>
            <button class="btn" onclick="addCart(${product.id})">
                Tambah Keranjang
            </button>
        </div>
    `;
}

function showProducts(id) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = products.map(productCard).join("");
    }
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("oppoCart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("oppoCart", JSON.stringify(cart));
}

function addCart(id) {
    const cart = getCart();
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(product.name + " berhasil ditambahkan ke keranjang!");
}

function showDetail() {
    const element = document.getElementById("productDetail");
    if (!element) return;

    const id = Number(new URLSearchParams(location.search).get("id"));
    const product = products.find(item => item.id === id);

    if (!product) {
        element.innerHTML = "<p>Produk tidak ditemukan.</p>";
        return;
    }

    element.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <h3>${rupiah(product.price)}</h3>
        <button class="btn" onclick="addCart(${product.id})">
            Tambah Keranjang
        </button>
        <button class="btn" onclick="buyNow(${product.id})">
            Beli WhatsApp
        </button>
    `;
}

function showSearch() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    if (!input || !results) return;

    function search() {
        const keyword = input.value.toLowerCase();

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
        );

        results.innerHTML = filtered.length
            ? filtered.map(productCard).join("")
            : "<p>Produk tidak ditemukan.</p>";
    }

    input.addEventListener("input", search);
    search();
}

function showCart() {
    const element = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (!element || !totalElement) return;

    const cart = getCart();

    if (!cart.length) {
        element.innerHTML = "<p>Keranjang kamu masih kosong.</p>";
        totalElement.textContent = "Total: Rp0";
        return;
    }

    element.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>${rupiah(item.price)} × ${item.quantity}</p>
            </div>
            <button onclick="removeCart(${item.id})">Hapus</button>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    totalElement.textContent = "Total: " + rupiah(total);
}

function removeCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    showCart();
}

function buyNow(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const message = `Halo OPPO STORE, saya ingin membeli ${product.name} dengan harga ${rupiah(product.price)}. Apakah stok tersedia?`;

    window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

function checkout() {
    const cart = getCart();

    if (!cart.length) {
        alert("Keranjang masih kosong!");
        return;
    }

    let message = "Halo OPPO STORE, saya ingin memesan:\n\n";

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x ${item.quantity} = ${rupiah(item.price * item.quantity)}\n`;
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    message += `\nTotal: ${rupiah(total)}`;
    message += "\nMohon konfirmasi stok dan pemesanan saya.";

    window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

showProducts("featuredProducts");
showProducts("allProducts");
showDetail();
showSearch();
showCart();
