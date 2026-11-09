
// =====================================
// OPPO STORE - MAIN JAVASCRIPT
// =====================================

// Ganti dengan nomor WhatsApp toko kamu
const WHATSAPP = "6281234567890";

// DATA PRODUK CONTOH
const products = [
    {
        id: 1,
        name: "OPPO A Series",
        category: "A Series",
        price: 1999000,
        description: "Smartphone untuk kebutuhan sehari-hari.",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
    },
    {
        id: 2,
        name: "OPPO Reno Series",
        category: "Reno Series",
        price: 4999000,
        description: "Smartphone dengan desain modern.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
    },
    {
        id: 3,
        name: "OPPO Find Series",
        category: "Find Series",
        price: 9999000,
        description: "Pilihan smartphone kelas premium.",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
    },
    {
        id: 4,
        name: "OPPO A Premium",
        category: "A Series",
        price: 2799000,
        description: "Nyaman untuk aktivitas harian.",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600"
    },
    {
        id: 5,
        name: "OPPO Reno Premium",
        category: "Reno Series",
        price: 5999000,
        description: "Desain stylish dan elegan.",
        image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600"
    },
    {
        id: 6,
        name: "OPPO Find Premium",
        category: "Find Series",
        price: 11999000,
        description: "Pengalaman smartphone premium.",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600"
    },
    {
        id: 7,
        name: "OPPO A Plus",
        category: "A Series",
        price: 3299000,
        description: "Pilihan untuk kebutuhan sehari-hari.",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600"
    },
    {
        id: 8,
        name: "OPPO Reno Pro",
        category: "Reno Series",
        price: 6999000,
        description: "Smartphone dengan gaya modern.",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
    }
];

// =====================================
// FORMAT HARGA
// =====================================

function rupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}

// =====================================
// PENYIMPANAN KERANJANG
// =====================================

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

// =====================================
// MEMBUAT KARTU PRODUK
// =====================================

function productCard(product) {
    return `
        <article class="product-card">
            <a href="detail.html?id=${product.id}">
                <div class="product-image">
                    <img src="${product.image}"
                         alt="${product.name}"
                         loading="lazy">
                </div>
            </a>

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="price">
                    ${rupiah(product.price)}
                </div>

                <button class="buy-button"
                    onclick="addCart(${product.id})">
                    + Tambah Keranjang
                </button>

                <a class="details-link"
                   href="detail.html?id=${product.id}">
                   Lihat Detail →
                </a>
            </div>
        </article>
    `;
}

// =====================================
// BERANDA
// =====================================

const featured = document.getElementById("featuredProducts");

if (featured) {
    featured.innerHTML = products
        .slice(0, 4)
        .map(productCard)
        .join("");
}

// =====================================
// HALAMAN PRODUK
// =====================================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

let activeCategory = "all";

function renderProducts() {
    if (!productGrid) return;

    const keyword = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const result = products.filter(product => {
        const matchName =
            product.name.toLowerCase().includes(keyword);

        const matchCategory =
            activeCategory === "all" ||
            product.category === activeCategory;

        return matchName && matchCategory;
    });

    productGrid.innerHTML = result.length
        ? result.map(productCard).join("")
        : '<div class="empty-message">Produk tidak ditemukan.</div>';

    const status = document.getElementById("searchStatus");

    if (status) {
        status.textContent = result.length +
            " produk ditemukan.";
    }
}

if (productGrid) {
    renderProducts();
}

if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
}

// FILTER PRODUK

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")
            ?.classList.remove("active");

        button.classList.add("active");
        activeCategory = button.dataset.category;

        renderProducts();
    });
});

// =====================================
// PENCARIAN
// =====================================

const searchButton = document.getElementById("searchButton");

if (searchButton && searchInput) {
    searchButton.addEventListener("click", renderProducts);

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            renderProducts();
        }
    });
}

// =====================================
// HALAMAN DETAIL
// =====================================

const detailContainer = document.getElementById("productDetail");

if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const product = products.find(item => item.id === id);

    if (product) {
        detailContainer.innerHTML = `
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="detail-info">
                <span class="tag">${product.category}</span>

                <h1>${product.name}</h1>

                <p>${product.description}</p>

                <div class="detail-price">
                    ${rupiah(product.price)}
                </div>

                <p>
                    Informasi harga ini merupakan contoh katalog.
                    Silakan konfirmasi ketersediaan kepada penjual.
                </p>

                <button class="btn"
                    onclick="addCart(${product.id})">
                    Tambah ke Keranjang
                </button>

                <a href="produk.html" class="btn btn-outline">
                    Kembali
                </a>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `
            <div class="empty-message">
                Produk tidak ditemukan.
                <br><br>
                <a href="produk.html" class="btn">
                    Kembali ke Produk
                </a>
            </div>
        `;
    }
}

// =====================================
// TAMBAH KE KERANJANG
// =====================================

function addCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(product.name + " berhasil ditambahkan!");
}

// =====================================
// TAMPILKAN KERANJANG
// =====================================

function renderCart() {
    const cartContainer = document.getElementById("cartItems");

    if (!cartContainer) return;

    const cart = getCart();

    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-message">
                Keranjang kamu masih kosong.
                <br><br>
                <a href="produk.html" class="btn">
                    Belanja Sekarang
                </a>
            </div>
        `;
    } else {
        cartContainer.innerHTML = cart.map(item => {
            const product = products.find(
                product => product.id === item.id
            );

            if (!product) return "";

            total += product.price * item.quantity;

            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}">

                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <p>${rupiah(product.price)}</p>
                        <p>Jumlah: ${item.quantity}</p>
                        <strong>
                            ${rupiah(product.price * item.quantity)}
                        </strong>
                    </div>

                    <button class="remove-button"
                        onclick="removeCart(${product.id})">
                        Hapus
                    </button>
                </div>
            `;
        }).join("");
    }

    const totalElement = document.getElementById("cartTotal");

    if (totalElement) {
        totalElement.textContent = rupiah(total);
    }
}

renderCart();

// =====================================
// HAPUS PRODUK
// =====================================

function removeCart(id) {
    let cart = getCart();

    cart = cart.filter(item => item.id !== id);

    saveCart(cart);
    renderCart();
}

// =====================================
// KOSONGKAN KERANJANG
// =====================================

const clearButton = document.getElementById("clearCart");

if (clearButton) {
    clearButton.addEventListener("click", () => {
        if (confirm("Yakin ingin mengosongkan keranjang?")) {
            saveCart([]);
            renderCart();
        }
    });
}

// =====================================
// WHATSAPP CHECKOUT
// =====================================

function sendWhatsApp(message) {
    if (WHATSAPP === "6281234567890") {
        alert("Silakan ganti nomor WhatsApp di script.js terlebih dahulu.");
        return;
    }

    window.open(
        "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(message),
        "_blank"
    );
}

const checkoutButton = document.getElementById("checkoutButton");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        const cart = getCart();

        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        let message = "Halo OPPO STORE, saya ingin memesan:\n\n";
        let total = 0;

        cart.forEach((item, index) => {
            const product = products.find(
                product => product.id === item.id
            );

            if (!product) return;

            const subtotal = product.price * item.quantity;
            total += subtotal;

            message += `${index + 1}. ${product.name}\n`;
            message += `Jumlah: ${item.quantity}\n`;
            message += `Harga: ${rupiah(subtotal)}\n\n`;
        });

        message += "Total: " + rupiah(total);
        message += "\nMohon informasi ketersediaan produk.";

        sendWhatsApp(message);
    });
}

// =====================================
// FORM KONTAK
// =====================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const message = document.getElementById("contactMessage").value;

        const text =
            `Halo OPPO STORE!\n\nNama: ${name}\nEmail: ${email}\nPesan: ${message}`;

        sendWhatsApp(text);
    });
}
