// Products data will be loaded from CSV
let productsData = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromCSV();
    setupEventListeners();
    setupFAQ();
    initHeroSlider();
});

// Load products from CSV file
function loadProductsFromCSV() {
    fetch('products.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('CSV file not found');
            }
            return response.text();
        })
        .then(csvData => {
            console.log('CSV loaded successfully');
            productsData = parseCSV(csvData);
            console.log('Products parsed:', productsData.length);
            loadProducts();
        })
        .catch(error => {
            console.error('Error loading products from CSV:', error);
            console.log('Loading default products with images...');
            loadDefaultProducts();
        });
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file is empty or invalid');
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = parseCSVLine(lines[i]);
        const product = {};
        
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim() : '';
            
            if (header === 'price') {
                value = parseFloat(value) || 0;
            } else if (header === 'reviews') {
                value = parseInt(value) || 0;
            } else if (header === 'rating') {
                value = parseFloat(value) || 0;
            }
            
            product[header] = value;
        });
        
        products.push(product);
    }
    
    return products;
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values.map(v => v.replace(/^"|"$/g, '').trim());
}

// Load default products with images if CSV fails
function loadDefaultProducts() {
    productsData = [
        { 
            name: "Happy Birthday Decoration Set", 
            category: "Combos", 
            description: "20 Golden Confetti Balloons, Hello 30 Cake Topper,Banner, 8 Star Cupcake Toppers – 30th Birthday Decor for Women, Girls", 
            price: 299, 
            rating: 4.8, 
            reviews: 17, 
            image: "https://m.media-amazon.com/images/I/81hrc+qh4BL._SL1500_.jpg",
            amazon_link: "https://www.amazon.in/dp/B0FD35LM2T?th=1", 
            featured: "" 
        },
        { 
            name: "Birthday Decoration Kit for Boys", 
            category: "Banners", 
            description: "Royal Blue, Silver & Gold Balloons with Happy Birthday Banner, Star Foil Balloons & Foil Fringe Backdrop (41 Pcs Combo Set)", 
            price: 235, 
            rating: 3.7, 
            reviews: 100, 
            image: "https://m.media-amazon.com/images/I/71SmQeuiCSL._SL1024_.jpg",
            amazon_link: "https://www.amazon.in/gp/product/B0FBRLHYL7?th=1", 
            featured: "yes" 
        },
        { 
            name: "Party Decoration Kit", 
            category: "Cake Toppers", 
            description: "66 Pcs | Blue, Silver & White Balloon Garland Arch with Banner, Net Curtains, Hooks & Tapes | Birthday Decoration Kit for Boys, Girls, Kids & Adults", 
            price: 299, 
            rating: 3.5, 
            reviews: 5, 
            image: "https://m.media-amazon.com/images/I/81KyUHh3YvL._SL1500_.jpg",
            amazon_link: "https://www.amazon.in/gp/product/B0FQDMJXXK?th=1", 
            featured: "" 
        },
        { 
            name: "Small Jungle Theme Animal Face Foil Balloons", 
            category: "Props", 
            description: "Pack of 6 | Jungle Theme Party Supplies & Backdrop Decorations | Small Size", 
            price: 179, 
            rating: 3.7, 
            reviews: 100, 
            image: "https://m.media-amazon.com/images/I/915vGH4oc3L._SL1500_.jpg",
            amazon_link: "https://www.amazon.in/dp/B0FB37N2HP?th=1", 
            featured: "" 
        },
        { 
            name: "Happy birthday decoration Items", 
            category: "Cupcake Toppers", 
            description: "35Pcs Kit | Birthday Backdrop For Decoration | Birthday Balloons For Decoration | Rainbow Theme", 
            price: 330, 
            rating: 3.7, 
            reviews: 100, 
            image: "https://m.media-amazon.com/images/I/91xef2MalsL._SL1500_.jpg",
            amazon_link: "https://www.amazon.in/dp/B0FBK23QH2?th=1", 
            featured: "" 
        },
        { 
            name: "Official Teenager Birthday Decoration Kit ", 
            category: "Seasonal", 
            description: "Gold & White Balloon Garland, Banner, Cake & Cupcake Toppers – 13th Birthday Party Supplies for Boys & Girls (30 Pcs)", 
            price: 329, 
            rating: 1.8, 
            reviews: 4, 
            image: "https://m.media-amazon.com/images/I/81B1i8sJLsL._SL1500_.jpg",
            amazon_link: "https://www.amazon.in/dp/B0FDCGYCMK?th=1", 
            featured: "" 
        },
    ];
    console.log('Default products loaded with placeholder images');
    loadProducts();
}

// Load and display products
function loadProducts() {
    console.log('Loading products to page, total:', productsData.length);
    
    // Home page - first 4 products
    const homeProductsGrid = document.getElementById('homeProductsGrid');
    if (homeProductsGrid) {
        homeProductsGrid.innerHTML = '';
        const homeProducts = productsData.slice(0, 4);
        homeProducts.forEach(product => {
            const productCard = createProductCard(product);
            homeProductsGrid.appendChild(productCard);
        });
        console.log('Home page: Loaded', homeProducts.length, 'products');
    }
    
    // Products page - first 6 in grid, rest scrollable
    const productsGridMain = document.getElementById('productsGridMain');
    const productsScrollable = document.getElementById('productsScrollable');
    const productsScrollableWrapper = document.getElementById('productsScrollableWrapper');
    
    if (productsGridMain) {
        productsGridMain.innerHTML = '';
        const mainProducts = productsData.slice(0, 6);
        mainProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGridMain.appendChild(productCard);
        });
        console.log('Products page main grid: Loaded', mainProducts.length, 'products');
        
        // Remaining products in scrollable section
        if (productsData.length > 6 && productsScrollable) {
            productsScrollable.innerHTML = '';
            const remainingProducts = productsData.slice(6);
            remainingProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsScrollable.appendChild(productCard);
            });
            productsScrollableWrapper.style.display = 'block';
            console.log('Products page scrollable: Loaded', remainingProducts.length, 'products');
        }
    }
    
    // Featured Product
    loadFeaturedProduct();
    
    // You May Also Like - 4 random products
    loadYouMayLike();
}

// Load featured product
function loadFeaturedProduct() {
    const featuredProductDiv = document.getElementById('featuredProduct');
    if (!featuredProductDiv) return;
    
    // Find product with featured="yes" or use first product
    const featured = productsData.find(p => p.featured && p.featured.toLowerCase() === 'yes') || productsData[0];
    
    if (!featured) {
        console.log('No featured product found');
        return;
    }
    
    console.log('Featured product:', featured.name);
    
    const rating = featured.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '⯨';
    stars += '☆'.repeat(emptyStars);
    
    const priceFormatted = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(featured.price || 0);
    
    const imagePath = featured.image || 'assets/placeholder-product.jpg';
    const amazonLink = featured.amazon_link || 'https://www.amazon.in/s?k=party+supplies';
    
    featuredProductDiv.innerHTML = `
        <div class="featured-product-image">
            <img src="${imagePath}" alt="${featured.name}" onerror="this.src='https://via.placeholder.com/400x400/FF8BA7/FFFFFF?text=Featured+Product'">
        </div>
        <div class="featured-product-details">
            <h3>${featured.name}</h3>
            <div class="featured-rating">${stars} (${featured.reviews || 0} reviews)</div>
            <p>${featured.description || ''}</p>
            <div class="featured-price">${priceFormatted}</div>
            <a href="${amazonLink}" target="_blank" class="btn btn-primary">Shop Now on Amazon</a>
        </div>
    `;
}

// Load "You May Also Like" products
function loadYouMayLike() {
    const youMayLikeGrid = document.getElementById('youMayLikeGrid');
    if (!youMayLikeGrid) return;
    
    youMayLikeGrid.innerHTML = '';
    
    // Get 4 random products (excluding featured if exists)
    const featured = productsData.find(p => p.featured && p.featured.toLowerCase() === 'yes');
    const availableProducts = featured 
        ? productsData.filter(p => p !== featured)
        : productsData;
    
    // Shuffle and take first 4
    const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, Math.min(4, shuffled.length));
    
    selectedProducts.forEach(product => {
        const productCard = createProductCard(product);
        youMayLikeGrid.appendChild(productCard);
    });
    
    console.log('You May Also Like: Loaded', selectedProducts.length, 'products');
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '⯨';
    stars += '☆'.repeat(emptyStars);
    
    const priceFormatted = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(product.price || 0);
    
    const imagePath = product.image || 'https://via.placeholder.com/400x400/FFE5EC/FF8BA7?text=Product+Image';
    const amazonLink = product.amazon_link || 'https://www.amazon.in/s?k=party+supplies';
    
    card.innerHTML = `
        <img src="${imagePath}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400/FFE5EC/FF8BA7?text=Product+Image'">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">${stars} (${product.reviews || 0})</div>
            <p class="product-description">${product.description || ''}</p>
            <div class="product-price">
                <span class="current-price">${priceFormatted}</span>
            </div>
            <a href="${amazonLink}" target="_blank" class="product-button">Shop on Amazon</a>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formMessage = document.getElementById('formMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...'; submitBtn.disabled = true;

        const data = Object.fromEntries(new FormData(contactForm).entries());
        const res = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(data)
        }).catch(() => null);

        submitBtn.textContent = originalText; submitBtn.disabled = false;

        if (res && res.ok) {
            const payload = await res.json();
            formMessage.className = 'form-message success';
            formMessage.textContent = payload.message || 'Thanks! We’ll get back to you shortly.';
            contactForm.reset();
        } else {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Unable to send right now. Please try again.';
     }
        setTimeout(()=>{ formMessage.className='form-message'; }, 5000);
    });
}

// Setup FAQ accordion
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
            if (!isActive) faqItem.classList.add('active');
        });
    });
    }
}
// HERO SLIDER (multiple hero images)
function initHeroSlider() {
    const slider = document.querySelector('.hero');
    if (!slider) return;
    const slides = slider.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    let idx = 0;
    slides[idx].classList.add('active');
    setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
    }, 4000);
}