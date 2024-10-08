// Variabel keranjang, data disimpan di Local Storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi untuk menampilkan notifikasi
function showNotification() {
    const toast = document.getElementById('toast-notification');
    toast.classList.remove('hidden');
    toast.classList.add('show');

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 3000);
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;  // Jika produk sudah ada di keranjang, tambahkan kuantitas
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCart();  // Panggil updateCart untuk memperbarui tampilan keranjang
    showNotification();  // Panggil notifikasi setelah produk ditambahkan
}

// Fungsi untuk mengurangi kuantitas produk di keranjang
function decreaseQuantity(productName) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
    } else {
        removeFromCart(productName);  // Jika kuantitas 1, maka hapus produk
    }

    updateCart();  // Perbarui tampilan keranjang
}

// Fungsi untuk memperbarui tampilan keranjang dan Local Storage
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    let totalPrice = 0;

    // Hapus semua elemen dalam cartItemsDiv sebelum menambahkan item baru
    cartItemsDiv.innerHTML = '';  // Bersihkan konten sebelumnya untuk menghindari duplikasi

    // Perulangan untuk menampilkan item di keranjang
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        // Buat elemen HTML untuk produk di keranjang
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>Harga: Rp${item.price}</p>
            <p>Kuantitas: ${item.quantity} 
                <button onclick="addToCart('${item.name}', ${item.price})">+</button>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
            </p>
            <button onclick="removeFromCart('${item.name}')">Hapus</button>
        `;

        // Tambahkan elemen produk ke dalam keranjang
        cartItemsDiv.appendChild(cartItemElement);
    });

    // Perbarui total harga
    if (totalPriceElement) {
        totalPriceElement.textContent = `Rp${totalPrice}`;  // Update total harga
    }

    // Simpan keranjang ke Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice);
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();  // Panggil updateCart setelah item dihapus
}

// Fungsi checkout, reset keranjang
function processCheckout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    alert('Terima kasih! Pesanan Anda telah dikonfirmasi.');
    cart = [];
    updateCart();  // Kosongkan keranjang setelah checkout
    localStorage.removeItem('cart');  // Hapus data keranjang dari Local Storage
    window.location.href = 'index.html';  // Kembali ke halaman utama
}

// Fungsi untuk mengambil data produk dari API DummyJSON
function fetchProducts() {
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            const products = data.products;  // Dapatkan array produk dari data API
            displayProducts(products);  // Panggil fungsi untuk menampilkan produk
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Fungsi untuk menampilkan produk di halaman
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');

    products.forEach(product => {
        // Buat elemen HTML untuk setiap produk
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Harga: Rp${product.price}</p>
            <button onclick="addToCart('${product.title}', ${product.price})">Tambah ke Keranjang</button>
        `;

        // Tambahkan elemen produk ke container
        productsContainer.appendChild(productElement);
    });
}

// Saat halaman dimuat
window.onload = function () {
    if (window.location.pathname.includes('products.html')) {
        updateCart();  // Update cart di halaman produk
        fetchProducts();  // Ambil produk dari API DummyJSON
    }

    if (window.location.pathname.includes('checkout.html')) {
        updateCart();  // Update cart di halaman checkout
        document.getElementById('confirm-order').addEventListener('click', processCheckout);
    }
}

// Fungsi untuk memfilter produk berdasarkan kategori
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.grid-item');  // Ambil semua produk

    products.forEach(product => {
        // Ambil kategori produk dari atribut data-category
        const productCategory = product.getAttribute('data-category');

        // Tampilkan produk jika kategori sesuai, sembunyikan jika tidak
        if (category === 'all' || category === productCategory) {
            product.style.display = 'block';  // Tampilkan produk
        } else {
            product.style.display = 'none';   // Sembunyikan produk
        }
    });
}

// Memastikan semua produk tampil saat halaman pertama kali dimuat
window.onload = function () {
    filterProductsByCategory('all');  // Tampilkan semua produk
};

function displayTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const totalPrice = localStorage.getItem('totalPrice'); // Ambil total harga dari Local Storage

    if (totalPrice) {
        totalPriceElement.textContent = `Rp${totalPrice}`; // Tampilkan total harga
    } else {
        totalPriceElement.textContent = 'Rp0'; // Jika tidak ada total harga, tampilkan Rp0
    }
}

// Saat halaman checkout dimuat
if (window.location.pathname.includes('checkout.html')) {
    updateCart();  // Update cart di halaman checkout
    displayTotalPrice(); // Panggil fungsi untuk menampilkan total harga
    document.getElementById('confirm-order').addEventListener('click', processCheckout);
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    alert('Terima kasih! Pesanan Anda telah dikonfirmasi.');
    cart = [];
    updateCart();  // Kosongkan keranjang setelah checkout
    localStorage.removeItem('cart');  // Hapus data keranjang dari Local Storage
    localStorage.removeItem('totalPrice'); // Hapus total harga dari Local Storage
    window.location.href = 'index.html';  // Kembali ke halaman utama
}

