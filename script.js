
localStorage.removeItem('driftReviews');

let cart = JSON.parse(localStorage.getItem('driftCart')) || [];
let orders = JSON.parse(localStorage.getItem('driftOrders')) || [];

const updateUI = () => {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = cart.length;
    
    const cartItemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    
    if (cartItemsDiv) {
        cartItemsDiv.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart-msg">Cart is empty</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                cartItemsDiv.innerHTML += `
                    <div class="cart-item">
                        <p class="item-name">${item.name} - ₱${item.price}</p>
                        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                    </div>`;
            });
        }
        if (totalDiv) totalDiv.innerText = `Total: ₱${total}`;
    }
    
    const ordersDiv = document.getElementById('orders-list');
    if (ordersDiv) displayOrders();
};

const showNotification = (msg) => {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

const addToCart = (name, price) => {
    cart.push({ name, price: parseInt(price) });
    localStorage.setItem('driftCart', JSON.stringify(cart));
    updateUI();
    showNotification(`${name} ADDED! 🔥`);
};

const removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('driftCart', JSON.stringify(cart));
    updateUI();
};

const saveOrder = (customerInfo) => {
    const order = {
        id: 'DD' + Date.now().toString().slice(-8),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'Processing',
        customer: customerInfo
    };
    orders.unshift(order);
    localStorage.setItem('driftOrders', JSON.stringify(orders));
    return order.id;
};

const checkout = () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    
    if (!name || !address || !phone) {
        showNotification('Fill in all fields! ⚠️');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Cart is empty! 🛒');
        return;
    }
    
    const orderId = saveOrder({ name, address, phone });
    
    showNotification(`Order ${orderId} placed! 🔥`);
    cart = [];
    localStorage.setItem('driftCart', JSON.stringify(cart));
    updateUI();
    
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
};

const displayOrders = () => {
    const ordersDiv = document.getElementById('orders-list');
    if (!ordersDiv) return;
    
    if (orders.length === 0) {
        ordersDiv.innerHTML = '<p style="text-align: center; color: #888; padding: 40px;">No orders yet 📝</p>';
        return;
    }
    
    ordersDiv.innerHTML = orders.map(order => `
        <div class="order-card" style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <div>
                    <h3 style="color: #f5c518; font-size: 18px; margin-bottom: 5px;">Order #${order.id}</h3>
                    <p style="color: #666; font-size: 12px;">${order.date}</p>
                </div>
                <span style="background: ${order.status === 'Delivered' ? '#22c55e' : '#f5c518'}; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">${order.status}</span>
            </div>
            <div style="margin-bottom: 15px;">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc;">
                        <span>${item.name}</span>
                        <span>₱${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div style="border-top: 1px solid #333; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888;">Total</span>
                <span style="color: #f5c518; font-size: 20px; font-weight: 800;">₱${order.total}</span>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #222;">
                <p style="color: #666; font-size: 12px;"><strong style="color: #888;">Ship to:</strong> ${order.customer.name}</p>
                <p style="color: #666; font-size: 12px;">${order.customer.address}</p>
            </div>
        </div>
    `).join('');
};

const inventory = {
    tees: [
        { name: "OG TEE", price: 999, img: "t1.jpg", supplier: "StreetWear Mfg Co.", description: "Premium cotton tee with signature Drift District logo" }, 
        { name: "SMOKE TEE", price: 999, img: "t2.jpg", supplier: "Urban Threads Inc.", description: "Smoke wash finish with embroidered details" },
        { name: "TOUGE TEE", price: 999, img: "t3.jpg", supplier: "Mountain Pass Apparel", description: "Inspired by mountain pass racing culture" },
        { name: "DRIFT TEE", price: 999, img: "t4.jpg", supplier: "StreetWear Mfg Co.", description: "Classic drift silhouette graphic" },
        { name: "CREW TEE", price: 999, img: "t5.jpg", supplier: "Urban Threads Inc.", description: "Crew neck with reinforced stitching" }
    ],
    hoodies: [
        { name: "NIGHT HOODIE", price: 1899, img: "h1.jpg", supplier: "Midnight Garments", description: "Heavyweight fleece for night runs" },
        { name: "ZIP HOODIE", price: 2100, img: "h2.jpg", supplier: "StreetWear Mfg Co.", description: "Full zip with premium YKK hardware" },
        { name: "LOGO HOODIE", price: 1899, img: "h3.jpg", supplier: "Urban Threads Inc.", description: "Oversized fit with puff print logo" },
        { name: "RACE HOODIE", price: 1899, img: "h4.jpg", supplier: "Mountain Pass Apparel", description: "Checkered flag design elements" },
        { name: "STREET HOODIE", price: 1899, img: "h5.jpg", supplier: "Midnight Garments", description: "Street camo pattern, limited edition" }
    ],
    caps: [
        { name: "SNAPBACK", price: 499, img: "c1.jpg", supplier: "Headwear Pro", description: "Classic 6-panel with gold logo" },
        { name: "DRIFT DAD HAT", price: 549, img: "c2.jpg", supplier: "Urban Threads Inc.", description: "Unstructured low profile fit" },
        { name: "BUCKET HAT", price: 599, img: "c3.jpg", supplier: "Headwear Pro", description: "Reversible bucket hat, two looks" },
        { name: "STREET CAP", price: 649, img: "c4.jpg", supplier: "Mountain Pass Apparel", description: "5-panel camp cap style" },
        { name: "TRUCKER CAP", price: 529, img: "c5.jpg", supplier: "Headwear Pro", description: "Mesh back with snap closure" }
    ],
    shoes: [
        { name: "STREET KICKS", price: 3500, img: "s1.jpg", supplier: "Sole Movement Co.", description: "Low top skate shoe silhouette" },
        { name: "STREET RUNNER", price: 4200, img: "s2.jpg", supplier: "Velocity Footwear", description: "Lightweight runner with gold accents" },
        { name: "TOUGE SLIDES", price: 1800, img: "s3.jpg", supplier: "Sole Movement Co.", description: "Comfort slides with tread pattern" },
        { name: "LOW TOPS", price: 3800, img: "s4.jpg", supplier: "Velocity Footwear", description: "Canvas low top, vulcanized sole" },
        { name: "HIGH TOPS", price: 4500, img: "s5.jpg", supplier: "Sole Movement Co.", description: "Premium leather high top" }
    ],
    acc: [
        { name: "KEYCHAIN", price: 150, img: "a1.jpg", supplier: "Micro Goods Ltd.", description: "Metal keychain with spinning drift charm" },
        { name: "STICKER PACK", price: 99, img: "a2.jpg", supplier: "Print House 88", description: "5 vinyl stickers, weatherproof" },
        { name: "TOTE BAG", price: 399, img: "a3.jpg", supplier: "Carry All Mfg.", description: "Canvas tote with gold print" },
        { name: "BACKPACK", price: 1299, img: "a4.jpg", supplier: "Mountain Pass Apparel", description: "Daypack with laptop sleeve" },
        { name: "BELT", price: 549, img: "a5.jpg", supplier: "Urban Threads Inc.", description: "Canvas belt with metal buckle" },
        { name: "SUNGLASSES", price: 799, img: "a6.jpg", supplier: "Shade Co.", description: "UV400 with gold frame accents" }
    ]
};

const topRatedProducts = ["OG TEE", "NIGHT HOODIE", "SNAPBACK", "STREET RUNNER", "BACKPACK"];

function generateReviews(productName, count, avgRating) {
    const reviews = [];
    const comments = [
        "Best purchase ever! 🔥",
        "Quality is insane for the price",
        "Fast shipping, great product",
        "Exceeded my expectations",
        "Perfect fit, highly recommend",
        "Drift District never disappoints",
        "Already ordered another one",
        "My friends are jealous lol",
        "Worth every peso",
        "Street wear game changed",
        "Fire design, clean print",
        "Comfortable and stylish",
        "New favorite in my collection",
        "Great customer service too",
        "Will definitely buy again"
    ];
    
    for (let i = 0; i < count; i++) {
        let stars;
        const rand = Math.random();
        if (rand < 0.6) stars = avgRating;
        else if (rand < 0.8) stars = Math.min(5, avgRating + 1);
        else if (rand < 0.95) stars = Math.max(1, avgRating - 1);
        else stars = avgRating === 5 ? 4 : avgRating;
        
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        
        reviews.push({
            stars: stars,
            text: comments[Math.floor(Math.random() * comments.length)],
            date: date.toLocaleDateString()
        });
    }
    
    return reviews;
}

const defaultReviews = {};

function initializeAllReviews() {
    defaultReviews["OG TEE"] = generateReviews("OG TEE", 1247, 5);
    defaultReviews["NIGHT HOODIE"] = generateReviews("NIGHT HOODIE", 1583, 5);
    defaultReviews["SNAPBACK"] = generateReviews("SNAPBACK", 982, 4);
    defaultReviews["STREET RUNNER"] = generateReviews("STREET RUNNER", 1345, 5);
    defaultReviews["BACKPACK"] = generateReviews("BACKPACK", 1156, 5);
    
    const otherProducts = [
        "SMOKE TEE", "TOUGE TEE", "DRIFT TEE", "CREW TEE",
        "ZIP HOODIE", "LOGO HOODIE", "RACE HOODIE", "STREET HOODIE",
        "DRIFT DAD HAT", "BUCKET HAT", "STREET CAP", "TRUCKER CAP",
        "STREET KICKS", "TOUGE SLIDES", "LOW TOPS", "HIGH TOPS",
        "KEYCHAIN", "STICKER PACK", "TOTE BAG", "BELT", "SUNGLASSES"
    ];
    
    otherProducts.forEach(product => {
        const reviewCount = Math.floor(Math.random() * 150) + 100;
        const avgRating = Math.floor(Math.random() * 2) + 3;
        defaultReviews[product] = generateReviews(product, reviewCount, avgRating);
    });
}

let productReviews = {};

function initializeReviews() {
    initializeAllReviews();
    const saved = localStorage.getItem('driftReviews');
    
    if (saved) {
        productReviews = JSON.parse(saved);
        for (let [product, reviews] of Object.entries(defaultReviews)) {
            if (!productReviews[product] || productReviews[product].length === 0) {
                productReviews[product] = reviews;
            }
        }
    } else {
        productReviews = { ...defaultReviews };
    }
    
    localStorage.setItem('driftReviews', JSON.stringify(productReviews));
}

function getAverageRating(productName) {
    const reviews = productReviews[productName] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
    return (sum / reviews.length).toFixed(1);
}

function getStarHTML(rating) {
    const numRating = parseFloat(rating);
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) stars += '★';
        else if (i - 0.5 <= numRating) stars += '½';
        else stars += '☆';
    }
    return stars;
}

function formatReviewCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count;
}

function isTopRated(productName) {
    return topRatedProducts.includes(productName);
}

function toggleReviewForm(productName) {
    const form = document.getElementById(`review-form-${productName}`);
    form.classList.toggle('show');
}

function setStarRating(productName, rating) {
    const stars = document.querySelectorAll(`#star-input-${productName} .star-input`);
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
    document.getElementById(`rating-value-${productName}`).value = rating;
}

function submitReview(productName) {
    const rating = parseInt(document.getElementById(`rating-value-${productName}`).value) || 0;
    const text = document.getElementById(`review-text-${productName}`).value.trim();
    
    if (rating === 0) {
        showNotification('Please select a star rating! ⭐');
        return;
    }
    if (!text) {
        showNotification('Please write a review! ✍️');
        return;
    }
    
    if (!productReviews[productName]) {
        productReviews[productName] = [];
    }
    
    productReviews[productName].push({
        stars: rating,
        text: text,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('driftReviews', JSON.stringify(productReviews));
    
    showNotification('Review added! 🔥');
    displayItems();
}

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
let minPriceFilter = 0;
let maxPriceFilter = Infinity;

function getAllItems() {
    let items = [];
    Object.values(inventory).forEach(catItems => {
        items = items.concat(catItems);
    });
    return items;
}

function getCategoryName(productName) {
    for (let [cat, items] of Object.entries(inventory)) {
        if (items.some(item => item.name === productName)) {
            return cat.toUpperCase();
        }
    }
    return '';
}

function searchByCategory(categoryName) {
    const cat = categoryName.toLowerCase();
    if (cat === 'shoes' || cat === 'shoe' || cat === 'kicks' || cat === 'footwear' || cat === 'sneakers' || cat === 'slides') {
        return { items: inventory.shoes, catName: 'shoes' };
    }
    if (cat === 'acc' || cat === 'accessories' || cat === 'accessory' || cat === 'add-ons' || cat === 'extras' || cat === 'backpack' || cat === 'bag' || cat === 'keychain') {
        return { items: inventory.acc, catName: 'acc' };
    }
    if (cat === 'tees' || cat === 'tshirt' || cat === 't-shirt' || cat === 'shirt' || cat === 'tee') {
        return { items: inventory.tees, catName: 'tees' };
    }
    if (cat === 'hoodies' || cat === 'hoodie' || cat === 'sweatshirt' || cat === 'sweater') {
        return { items: inventory.hoodies, catName: 'hoodies' };
    }
    if (cat === 'caps' || cat === 'cap' || cat === 'hat' || cat === 'headwear' || cat === 'snapback') {
        return { items: inventory.caps, catName: 'caps' };
    }
    return null;
}

function getFilteredItems() {
    let items = [];
    
    if (currentCategory === 'all') {
        items = getAllItems();
    } else if (inventory[currentCategory]) {
        items = inventory[currentCategory];
    }
    
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase().trim();
        items = items.filter(item => {
            const name = item.name.toLowerCase();
            const category = getCategoryName(item.name).toLowerCase();
            const supplier = (item.supplier || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            
            return name.includes(searchLower) || 
                   category.includes(searchLower) || 
                   supplier.includes(searchLower) ||
                   description.includes(searchLower);
        });
    }
    
    items = items.filter(item => item.price >= minPriceFilter && item.price <= maxPriceFilter);
    
    switch(currentSort) {
        case 'price-low':
            items.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            items.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            items.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            items.sort((a, b) => getAverageRating(b.name) - getAverageRating(a.name));
            break;
        case 'popular':
            items.sort((a, b) => (productReviews[b.name]?.length || 0) - (productReviews[a.name]?.length || 0));
            break;
    }
    
    return items;
}

function searchProducts(query) {
    currentSearch = query.toLowerCase().trim();
    
    const categoryMatch = searchByCategory(currentSearch);
    if (categoryMatch && currentSearch.length > 2) {
        currentCategory = categoryMatch.catName;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const tabBtn = document.querySelector(`.tab-btn[onclick*="'${categoryMatch.catName}'"]`);
        if (tabBtn) tabBtn.classList.add('active');
        
        const catDisplay = categoryMatch.catName === 'acc' ? 'ACCESSORIES' : categoryMatch.catName.toUpperCase();
        showNotification(`Showing all ${catDisplay} 🔥`);
    }
    
    displayItems();
}

function displayItems() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    const items = getFilteredItems();
    grid.innerHTML = "";
    
    if (items.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="color: #888; font-size: 18px; margin-bottom: 20px;">No products found for "${currentSearch}" 🔍</p>
                <p style="color: #666; font-size: 14px;">Try: "shoes", "accessories", "tees", "hoodies", "caps"</p>
                <button onclick="clearFilters()" style="margin-top: 20px; padding: 12px 30px; background: #f5c518; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Clear Search</button>
            </div>`;
        return;
    }
    
    let html = '';
    const categoryMatch = searchByCategory(currentSearch);
    if (categoryMatch) {
        const catDisplay = categoryMatch.catName === 'acc' ? 'ACCESSORIES' : categoryMatch.catName.toUpperCase();
        html += `<div style="grid-column: 1/-1; margin-bottom: 20px; padding: 15px; background: rgba(245, 197, 24, 0.1); border-left: 4px solid #f5c518; border-radius: 8px;">
            <p style="color: #f5c518; font-weight: bold; margin: 0; text-transform: uppercase;">📂 ${catDisplay} Category</p>
        </div>`;
    }
    
    html += items.map(item => {
        const avgRating = getAverageRating(item.name);
        const reviews = productReviews[item.name] || [];
        const reviewCount = reviews.length;
        const topRated = isTopRated(item.name);
        const category = getCategoryName(item.name);
        
        return `
        <div class="card" style="${topRated ? 'border: 3px solid #f5c518; position: relative;' : ''}">
            ${topRated ? '<div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #f5c518; color: #000; padding: 5px 15px; border-radius: 15px; font-weight: bold; font-size: 12px; z-index: 10;">🔥 TOP RATED</div>' : ''}
            <img src="images/${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₱${item.price}</p>
            <p style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${category}</p>
            <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            
            <div class="review-section">
                <div class="stars">${getStarHTML(avgRating)}</div>
                <div class="review-count">${formatReviewCount(reviewCount)} reviews • ${avgRating}/5 stars</div>
                <button class="review-btn" onclick="toggleReviewForm('${item.name}')">Write Review</button>
                
                <div class="review-form" id="review-form-${item.name}">
                    <div class="star-input-container" id="star-input-${item.name}">
                        ${[1,2,3,4,5].map(i => `<span class="star-input" onclick="setStarRating('${item.name}', ${i})">★</span>`).join('')}
                    </div>
                    <input type="hidden" id="rating-value-${item.name}" value="0">
                    <textarea class="review-text" id="review-text-${item.name}" placeholder="Write your review..." rows="3"></textarea>
                    <button class="submit-review" onclick="submitReview('${item.name}')">Submit Review</button>
                    
                    ${reviews.length > 0 ? `
                    <div class="reviews-list" style="max-height: 200px; overflow-y: auto; margin-top: 10px;">
                        <div style="color: #f5c518; font-size: 11px; margin-bottom: 5px;">Recent Reviews:</div>
                        ${reviews.slice(-10).reverse().map(r => `
                            <div class="review-item" style="background: rgba(245, 197, 24, 0.1); padding: 8px; border-radius: 5px; margin-bottom: 5px; font-size: 12px;">
                                <span class="review-stars" style="color: #f5c518;">${getStarHTML(r.stars)}</span> ${r.text}
                                <div style="color: #666; font-size: 10px; margin-top: 3px;">${r.date}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
    
    grid.innerHTML = html;
}

function showCat(category, btn) {
    currentCategory = category;
    currentSearch = '';
    
    if (btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    displayItems();
}

function applyFilters() {
    const sortValue = document.getElementById('sortFilter')?.value || 'default';
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;
    
    currentSort = sortValue;
    minPriceFilter = minPrice ? parseInt(minPrice) : 0;
    maxPriceFilter = maxPrice ? parseInt(maxPrice) : Infinity;
    
    displayItems();
}

function clearFilters() {
    document.getElementById('sortFilter').value = 'default';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    currentSort = 'default';
    minPriceFilter = 0;
    maxPriceFilter = Infinity;
    currentSearch = '';
    currentCategory = 'all';
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const allTab = document.querySelector('.tab-btn[onclick*="\'all\'"]');
    if (allTab) allTab.classList.add('active');
    
    displayItems();
    showNotification('Filters cleared! 🔄');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        addToCart(e.target.dataset.name, e.target.dataset.price);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeReviews();
    updateUI();
    
    const searchInput = document.getElementById('searchInput');
    const productGrid = document.getElementById('product-grid');
    
    if (productGrid) {
        const defaultCategory = localStorage.getItem('defaultCategory');
        if (defaultCategory && inventory[defaultCategory]) {
            currentCategory = defaultCategory;
            localStorage.removeItem('defaultCategory');
            const tabBtn = document.querySelector(`.tab-btn[onclick*="'${defaultCategory}'"]`);
            if (tabBtn) {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tabBtn.classList.add('active');
            }
        } else {
            currentCategory = 'all';
        }
        
        showCat(currentCategory, document.querySelector('.tab-btn.active'));
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchProducts(e.target.value);
            });
        }
    }
});
