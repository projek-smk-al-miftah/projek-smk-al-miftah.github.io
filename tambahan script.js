
// FILTER PRODUK BERDASARKAN PENCARIAN
const params = new URLSearchParams(window.location.search);
const keyword = params.get("cari");

if (keyword) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = keyword;

    const cards = document.querySelectorAll(".product-card");
    let found = 0;

    cards.forEach(card => {
        const name = card.textContent.toLowerCase();
        const match = name.includes(keyword.toLowerCase());

        card.style.display = match ? "" : "none";
        if (match) found++;
    });

    const grid = document.querySelector(".product-grid");

    if (grid && found === 0) {
        grid.insertAdjacentHTML(
            "afterend",
            "<p>Produk tidak ditemukan. Silakan coba kata pencarian lain.</p>"
        );
    }
}
