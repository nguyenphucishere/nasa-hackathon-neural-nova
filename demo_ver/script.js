// ============================================
// 🌸 FLOWER BLOOM FORECAST - Main Script
// ============================================

// === MOCKUP DATA ===
// === FAKE HOTELS DATA ===
const hotelsData = {
    'Tokyo': [
        { name: '🏨 Sakura Hotel Tokyo', rating: '⭐ 4.5', price: '2,500,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Cherry Blossom Inn', rating: '⭐ 4.8', price: '3,200,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Tokyo Garden Hotel', rating: '⭐ 4.3', price: '1,800,000 VNĐ/đêm', distance: '2km' },
        { name: '🏨 Park Hyatt Tokyo', rating: '⭐ 4.9', price: '5,000,000 VNĐ/đêm', distance: '3km' }
    ],
    'Kyoto': [
        { name: '🏨 Kyoto Blossom Resort', rating: '⭐ 4.7', price: '2,800,000 VNĐ/đêm', distance: '400m' },
        { name: '🏨 Gion Traditional Inn', rating: '⭐ 4.6', price: '2,200,000 VNĐ/đêm', distance: '800m' },
        { name: '🏨 Arashiyama Hotel', rating: '⭐ 4.4', price: '1,900,000 VNĐ/đêm', distance: '1.5km' }
    ],
    'Seoul': [
        { name: '🏨 Seoul Flower Hotel', rating: '⭐ 4.6', price: '2,400,000 VNĐ/đêm', distance: '600m' },
        { name: '🏨 Gangnam Luxury Stay', rating: '⭐ 4.8', price: '3,500,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Myeongdong Tourist Hotel', rating: '⭐ 4.2', price: '1,600,000 VNĐ/đêm', distance: '2.5km' }
    ],
    'Jeju': [
        { name: '🏨 Jeju Island Resort', rating: '⭐ 4.9', price: '4,000,000 VNĐ/đêm', distance: '300m' },
        { name: '🏨 Seogwipo Beach Hotel', rating: '⭐ 4.5', price: '2,600,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Hallasan View Inn', rating: '⭐ 4.3', price: '1,700,000 VNĐ/đêm', distance: '2km' }
    ],
    'Valensole': [
        { name: '🏨 Lavender Field Hotel', rating: '⭐ 4.7', price: '3,000,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Provence Charm Inn', rating: '⭐ 4.6', price: '2,500,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Villa Lavande', rating: '⭐ 4.8', price: '3,800,000 VNĐ/đêm', distance: '1.8km' }
    ],
    'Furano': [
        { name: '🏨 Furano Flower Resort', rating: '⭐ 4.5', price: '2,700,000 VNĐ/đêm', distance: '400m' },
        { name: '🏨 Hokkaido Lavender Hotel', rating: '⭐ 4.4', price: '2,200,000 VNĐ/đêm', distance: '900m' },
        { name: '🏨 Farm Tomita Inn', rating: '⭐ 4.6', price: '2,900,000 VNĐ/đêm', distance: '1.5km' }
    ],
    'Lisse': [
        { name: '🏨 Tulip Garden Hotel', rating: '⭐ 4.8', price: '3,200,000 VNĐ/đêm', distance: '300m' },
        { name: '🏨 Keukenhof Lodge', rating: '⭐ 4.7', price: '2,900,000 VNĐ/đêm', distance: '700m' },
        { name: '🏨 Dutch Windmill Inn', rating: '⭐ 4.5', price: '2,400,000 VNĐ/đêm', distance: '1.2km' }
    ],
    'Amsterdam': [
        { name: '🏨 Canal House Hotel', rating: '⭐ 4.9', price: '4,500,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Amsterdam Flower Hotel', rating: '⭐ 4.6', price: '2,800,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Dam Square Hotel', rating: '⭐ 4.4', price: '2,200,000 VNĐ/đêm', distance: '1.8km' }
    ],
    'Istanbul': [
        { name: '🏨 Bosphorus Tulip Hotel', rating: '⭐ 4.7', price: '2,600,000 VNĐ/đêm', distance: '600m' },
        { name: '🏨 Sultanahmet Palace Hotel', rating: '⭐ 4.8', price: '3,200,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Taksim Garden Inn', rating: '⭐ 4.5', price: '2,000,000 VNĐ/đêm', distance: '2km' }
    ],
    'Florence': [
        { name: '🏨 Tuscan Sunflower Resort', rating: '⭐ 4.9', price: '4,200,000 VNĐ/đêm', distance: '400m' },
        { name: '🏨 Florence Garden Hotel', rating: '⭐ 4.7', price: '3,500,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Villa Toscana', rating: '⭐ 4.6', price: '2,900,000 VNĐ/đêm', distance: '1.5km' }
    ],
    'Hokkaido': [
        { name: '🏨 Hokkaido Nature Resort', rating: '⭐ 4.8', price: '3,800,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Sapporo Flower Hotel', rating: '⭐ 4.5', price: '2,600,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Mountain View Inn', rating: '⭐ 4.4', price: '2,100,000 VNĐ/đêm', distance: '2km' }
    ],
    'Hanoi': [
        { name: '🏨 West Lake Lotus Hotel', rating: '⭐ 4.6', price: '1,500,000 VNĐ/đêm', distance: '300m' },
        { name: '🏨 Old Quarter Boutique Hotel', rating: '⭐ 4.7', price: '1,800,000 VNĐ/đêm', distance: '800m' },
        { name: '🏨 Hanoi Garden Hotel', rating: '⭐ 4.5', price: '1,200,000 VNĐ/đêm', distance: '1.5km' }
    ],
    'Hue': [
        { name: '🏨 Imperial Lotus Hotel', rating: '⭐ 4.8', price: '1,600,000 VNĐ/đêm', distance: '400m' },
        { name: '🏨 Perfume River Resort', rating: '⭐ 4.6', price: '1,400,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Hue Garden Inn', rating: '⭐ 4.4', price: '1,000,000 VNĐ/đêm', distance: '2km' }
    ],
    'Ninh Binh': [
        { name: '🏨 Tam Coc Garden Resort', rating: '⭐ 4.7', price: '1,800,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Trang An Eco Hotel', rating: '⭐ 4.5', price: '1,300,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Ninh Binh Hidden Charm', rating: '⭐ 4.6', price: '1,500,000 VNĐ/đêm', distance: '1.8km' }
    ],
    'Ha Giang': [
        { name: '🏨 Buckwheat Flower Hotel', rating: '⭐ 4.5', price: '800,000 VNĐ/đêm', distance: '200m' },
        { name: '🏨 Mountain View Homestay', rating: '⭐ 4.7', price: '600,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Quan Ba Heaven Gate Hotel', rating: '⭐ 4.4', price: '700,000 VNĐ/đêm', distance: '1km' }
    ],
    'Moc Chau': [
        { name: '🏨 Moc Chau Highland Resort', rating: '⭐ 4.6', price: '1,200,000 VNĐ/đêm', distance: '300m' },
        { name: '🏨 Pine Hill Hotel', rating: '⭐ 4.4', price: '900,000 VNĐ/đêm', distance: '800m' },
        { name: '🏨 Buckwheat Valley Inn', rating: '⭐ 4.5', price: '1,000,000 VNĐ/đêm', distance: '1.5km' }
    ],
    'Da Lat': [
        { name: '🏨 Da Lat Palace Hotel', rating: '⭐ 4.8', price: '2,200,000 VNĐ/đêm', distance: '400m' },
        { name: '🏨 Flower Garden Resort', rating: '⭐ 4.6', price: '1,500,000 VNĐ/đêm', distance: '1km' },
        { name: '🏨 Pine Forest Hotel', rating: '⭐ 4.5', price: '1,300,000 VNĐ/đêm', distance: '1.8km' }
    ],
    'Cao Bang': [
        { name: '🏨 Ban Gioc Waterfall Hotel', rating: '⭐ 4.5', price: '900,000 VNĐ/đêm', distance: '500m' },
        { name: '🏨 Mountain Echo Resort', rating: '⭐ 4.4', price: '700,000 VNĐ/đêm', distance: '1.2km' },
        { name: '🏨 Cao Bang Garden Hotel', rating: '⭐ 4.3', price: '600,000 VNĐ/đêm', distance: '2km' }
    ]
};

// === FAKE WEATHER DATA ===
const weatherData = {
    'Tokyo': { temp: '16°C', condition: '⛅ Có mây', humidity: '65%', wind: '12 km/h' },
    'Kyoto': { temp: '15°C', condition: '☀️ Nắng đẹp', humidity: '60%', wind: '10 km/h' },
    'Seoul': { temp: '14°C', condition: '⛅ Có mây', humidity: '70%', wind: '15 km/h' },
    'Jeju': { temp: '17°C', condition: '🌤️ Nắng nhẹ', humidity: '75%', wind: '18 km/h' },
    'Valensole': { temp: '24°C', condition: '☀️ Nắng đẹp', humidity: '45%', wind: '8 km/h' },
    'Furano': { temp: '22°C', condition: '🌤️ Nắng nhẹ', humidity: '55%', wind: '10 km/h' },
    'Lisse': { temp: '13°C', condition: '⛅ Có mây', humidity: '68%', wind: '14 km/h' },
    'Amsterdam': { temp: '12°C', condition: '🌧️ Mưa nhẹ', humidity: '72%', wind: '16 km/h' },
    'Istanbul': { temp: '18°C', condition: '☀️ Nắng đẹp', humidity: '60%', wind: '12 km/h' },
    'Florence': { temp: '26°C', condition: '☀️ Nắng đẹp', humidity: '50%', wind: '9 km/h' },
    'Hokkaido': { temp: '23°C', condition: '🌤️ Nắng nhẹ', humidity: '58%', wind: '11 km/h' },
    'Hanoi': { temp: '32°C', condition: '☀️ Nắng nóng', humidity: '80%', wind: '8 km/h' },
    'Hue': { temp: '30°C', condition: '⛅ Có mây', humidity: '78%', wind: '10 km/h' },
    'Ninh Binh': { temp: '31°C', condition: '🌤️ Nắng nhẹ', humidity: '75%', wind: '9 km/h' },
    'Ha Giang': { temp: '20°C', condition: '☀️ Nắng đẹp', humidity: '60%', wind: '12 km/h' },
    'Moc Chau': { temp: '18°C', condition: '🌤️ Nắng nhẹ', humidity: '65%', wind: '10 km/h' },
    'Da Lat': { temp: '22°C', condition: '⛅ Có mây', humidity: '70%', wind: '8 km/h' },
    'Cao Bang': { temp: '19°C', condition: '☀️ Nắng đẹp', humidity: '62%', wind: '11 km/h' }
};

const flowersData = {
    'cherry-blossom': {
        name: 'Hoa Anh Đào (Cherry Blossom)',
        icon: '🌸',
        peakMonths: [3, 4],
        goodMonths: [2, 5],
        temperature: '12°C - 20°C',
        tips: 'Thời điểm đẹp nhất từ cuối tháng 3 đến đầu tháng 4. Nên đặt vé sớm vì đây là mùa du lịch cao điểm. Mang theo áo ấm vì thời tiết có thể thay đổi đột ngột. Đến sớm vào buổi sáng để chụp ảnh đẹp nhất.',
        locations: [
            { name: 'Tokyo, Nhật Bản', country: 'japan', lat: 35.6762, lon: 139.6503, city: 'Tokyo' },
            { name: 'Kyoto, Nhật Bản', country: 'japan', lat: 35.0116, lon: 135.7681, city: 'Kyoto' },
            { name: 'Seoul, Hàn Quốc', country: 'korea', lat: 37.5665, lon: 126.9780, city: 'Seoul' },
            { name: 'Jeju, Hàn Quốc', country: 'korea', lat: 33.4996, lon: 126.5312, city: 'Jeju' }
        ],
        images: [
            'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
            'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400',
            'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400',
            'https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=400',
            'https://images.unsplash.com/photo-1617095442097-4bcf4e6d3e84?w=400'
        ]
    },
    'lavender': {
        name: 'Hoa Oải Hương (Lavender)',
        icon: '💜',
        peakMonths: [6, 7],
        goodMonths: [5, 8],
        temperature: '20°C - 28°C',
        tips: 'Mùa hoa oải hương nở rộ từ tháng 6 đến tháng 7. Nên đi vào buổi sáng sớm hoặc chiều muộn để tránh nắng gắt. Đừng quên mang kem chống nắng và nón. Cánh đồng oải hương rất đẹp khi chụp ảnh drone.',
        locations: [
            { name: 'Provence, Pháp', country: 'france', lat: 43.9352, lon: 4.8357, city: 'Valensole' },
            { name: 'Valensole, Pháp', country: 'france', lat: 43.8369, lon: 5.9845, city: 'Valensole' },
            { name: 'Hokkaido, Nhật Bản', country: 'japan', lat: 43.0642, lon: 141.3469, city: 'Furano' }
        ],
        images: [
            'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400',
            'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400',
            'https://images.unsplash.com/photo-1508812866450-1948b62bc446?w=400',
            'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400',
            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400',
            'https://images.unsplash.com/photo-1508812854022-d39e5c1a8ed5?w=400'
        ]
    },
    'tulip': {
        name: 'Hoa Tulip',
        icon: '🌷',
        peakMonths: [4, 5],
        goodMonths: [3, 6],
        temperature: '10°C - 18°C',
        tips: 'Thời điểm đẹp nhất để ngắm hoa tulip là từ giữa tháng 4 đến giữa tháng 5. Nên thuê xe đạp để tham quan các cánh đồng hoa. Mua vé online trước để tránh xếp hàng. Mùa tulip rất đông khách du lịch.',
        locations: [
            { name: 'Keukenhof, Hà Lan', country: 'netherlands', lat: 52.2698, lon: 4.5469, city: 'Lisse' },
            { name: 'Amsterdam, Hà Lan', country: 'netherlands', lat: 52.3676, lon: 4.9041, city: 'Amsterdam' },
            { name: 'Istanbul, Thổ Nhĩ Kỳ', country: 'turkey', lat: 41.0082, lon: 28.9784, city: 'Istanbul' }
        ],
        images: [
            'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
            'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400',
            'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400',
            'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400',
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400',
            'https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?w=400'
        ]
    },
    'sunflower': {
        name: 'Hoa Hướng Dương',
        icon: '🌻',
        peakMonths: [7, 8],
        goodMonths: [6, 9],
        temperature: '22°C - 32°C',
        tips: 'Cánh đồng hoa hướng dương nở rộ vào tháng 7-8. Nên đi vào buổi sáng sớm khi hoa hướng về phía mặt trời. Mang theo nước uống và kem chống nắng. Thời tiết có thể rất nóng, nên chuẩn bị kỹ càng.',
        locations: [
            { name: 'Provence, Pháp', country: 'france', lat: 43.9352, lon: 4.8357, city: 'Valensole' },
            { name: 'Tuscany, Ý', country: 'italy', lat: 43.7696, lon: 11.2558, city: 'Florence' },
            { name: 'Hokkaido, Nhật Bản', country: 'japan', lat: 43.0642, lon: 141.3469, city: 'Hokkaido' }
        ],
        images: [
            'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400',
            'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=400',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
            'https://images.unsplash.com/photo-1597848212624-e530d040fc7d?w=400',
            'https://images.unsplash.com/photo-1530047625168-4b29bfbbe1fc?w=400'
        ]
    },
    'lotus': {
        name: 'Hoa Sen (Lotus)',
        icon: '🪷',
        peakMonths: [6, 7, 8],
        goodMonths: [5, 9],
        temperature: '25°C - 35°C',
        tips: 'Hoa sen nở đẹp nhất vào sáng sớm từ 5-7 giờ. Mùa hè là thời điểm lý tưởng. Nên mang giày thoải mái và mũ rộng vành. Đi thuyền để ngắm hoa sen sẽ có góc nhìn đẹp nhất.',
        locations: [
            { name: 'Hà Nội, Việt Nam', country: 'vietnam', lat: 21.0285, lon: 105.8542, city: 'Hanoi' },
            { name: 'Huế, Việt Nam', country: 'vietnam', lat: 16.4637, lon: 107.5909, city: 'Hue' },
            { name: 'Bangkok, Thái Lan', country: 'thailand', lat: 13.7563, lon: 100.5018, city: 'Bangkok' }
        ],
        images: [
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
            'https://images.unsplash.com/photo-1533927451803-933786cfdefa?w=400',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
            'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=400',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400'
        ]
    },
    'buckwheat': {
        name: 'Hoa Tam Giác Mạch (Buckwheat Flower)',
        icon: '🌺',
        peakMonths: [10, 11],
        goodMonths: [9, 12],
        temperature: '15°C - 25°C',
        tips: 'Mùa hoa tam giác mạch đẹp nhất từ cuối tháng 10 đến đầu tháng 11. Nên đi vào buổi sáng sớm hoặc chiều muộn để có ánh sáng đẹp chụp ảnh. Mang theo áo ấm vì thời tiết vùng núi khá lạnh. Nên thuê xe máy hoặc xe địa phương để di chuyển dễ dàng.',
        locations: [
            { name: 'Hà Giang, Việt Nam', country: 'vietnam', lat: 22.8228, lon: 104.9784, city: 'Ha Giang' },
            { name: 'Mộc Châu, Sơn La, Việt Nam', country: 'vietnam', lat: 20.8533, lon: 104.6814, city: 'Moc Chau' },
            { name: 'Đà Lạt, Lâm Đồng, Việt Nam', country: 'vietnam', lat: 11.9404, lon: 108.4583, city: 'Da Lat' },
            { name: 'Cao Bằng, Việt Nam', country: 'vietnam', lat: 22.6358, lon: 106.2525, city: 'Cao Bang' }
        ],
        images: [
            'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400',
            'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400',
            'https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?w=400',
            'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400',
            'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400'
        ]
    }
};

// === GLOBAL VARIABLES ===
let map;
let markers = [];
let currentLocations = []; // Lưu danh sách locations hiện tại
let currentLocationIndex = 0; // Index của location đang xem
let currentFlowerData = null; // Lưu thông tin hoa hiện tại

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', function () {
    initializePetals();
    initializeMap();
    initializeEventListeners();
    setDefaultDate();
});

// === FALLING PETALS ANIMATION ===
function initializePetals() {
    const petalsContainer = document.getElementById('petalsContainer');
    const petalEmojis = ['🌸', '🌺', '🌷', '🌼', '🏵️'];
    const petalCount = 20;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petalsContainer.appendChild(petal);
    }
}

// === INITIALIZE MAP ===
function initializeMap() {
    try {
        // Initialize map with OpenStreetMap (free, no API key needed)
        map = L.map('map', {
            center: [35.6762, 139.6503],
            zoom: 3,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Use OpenStreetMap tiles (completely free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 2
        }).addTo(map);

        // Alternative: CartoDB Positron (light theme - looks better with pink design)
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        //     attribution: '© OpenStreetMap contributors, © CARTO',
        //     maxZoom: 19
        // }).addTo(map);

        console.log('✅ Map initialized successfully!');

        // Hide loading indicator after map loads
        setTimeout(() => {
            document.getElementById('mapLoading').style.display = 'none';
            map.invalidateSize(); // Fix any size issues
        }, 1000);
    } catch (error) {
        console.error('❌ Map initialization error:', error);
        document.getElementById('mapLoading').innerHTML = `
            <div style="color: #FF6B9D; text-align: center;">
                <h3>⚠️ Lỗi tải bản đồ</h3>
                <p>Vui lòng kiểm tra kết nối internet</p>
            </div>
        `;
    }
}

// === SET DEFAULT DATE ===
function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    document.getElementById('travelDate').value = `${year}-${month}`;
}

// === EVENT LISTENERS ===
function initializeEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', handleSearch);

    // Auto-search when flower type changes
    document.getElementById('flowerType').addEventListener('change', function () {
        if (this.value) {
            setTimeout(handleSearch, 300);
        }
    });
}

// === HANDLE SEARCH ===
function handleSearch() {
    const flowerType = document.getElementById('flowerType').value;
    const travelDate = document.getElementById('travelDate').value;
    const country = document.getElementById('country').value;

    if (!flowerType) {
        showToast('⚠️ Vui lòng chọn loài hoa!');
        return;
    }

    const flowerData = flowersData[flowerType];
    if (!flowerData) return;

    // Filter locations by country if selected
    let locations = flowerData.locations;
    if (country) {
        locations = locations.filter(loc => loc.country === country);
    }

    // Check if travel date is in peak season
    let seasonMessage = '';
    if (travelDate) {
        const selectedMonth = parseInt(travelDate.split('-')[1]);
        if (flowerData.peakMonths.includes(selectedMonth)) {
            seasonMessage = ' ✨ Thời điểm bạn chọn là mùa nở đẹp nhất!';
        } else if (flowerData.goodMonths.includes(selectedMonth)) {
            seasonMessage = ' 🌸 Thời điểm bạn chọn cũng đẹp nhưng không phải đỉnh cao.';
        } else {
            seasonMessage = ' ⚠️ Thời điểm bạn chọn có thể không phải mùa hoa nở.';
        }
    }

    // Show recommendation card
    displayRecommendation(flowerData, locations);

    // Update map
    updateMap(locations, flowerData);

    // Show toast notification
    showToast('✅ Tìm kiếm thành công!' + seasonMessage);
}

// === DISPLAY RECOMMENDATION ===
function displayRecommendation(flowerData, locations) {
    const card = document.getElementById('recommendationCard');
    card.style.display = 'block';

    // Update header
    document.getElementById('recIcon').textContent = flowerData.icon;
    document.getElementById('recTitle').textContent = flowerData.name;

    // Update info
    const peakMonthNames = flowerData.peakMonths.map(m => 'Tháng ' + m).join(', ');
    document.getElementById('peakSeason').textContent = peakMonthNames;
    document.getElementById('temperature').textContent = flowerData.temperature;
    document.getElementById('tipsText').textContent = flowerData.tips;

    // Update locations
    const locationsList = document.getElementById('locationsList');
    locationsList.innerHTML = '';
    locations.forEach((loc, index) => {
        const tag = document.createElement('div');
        tag.className = 'location-tag';
        tag.innerHTML = `📍 ${loc.name}`;
        tag.onclick = () => {
            // Update current index and zoom to location
            currentLocationIndex = index;
            zoomToLocation(index);

            // Scroll to map on mobile
            if (window.innerWidth <= 768) {
                document.querySelector('.right-panel').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        };
        locationsList.appendChild(tag);
    });

    // Update timeline
    updateTimeline(flowerData.peakMonths, flowerData.goodMonths);

    // Update gallery - fetch images from Unsplash
    updateGalleryWithSearch(flowerData.name, flowerData.icon);

    // Scroll to recommendation on mobile
    if (window.innerWidth <= 768) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// === UPDATE TIMELINE ===
function updateTimeline(peakMonths, goodMonths) {
    const timeline = document.getElementById('timelineMonths');
    timeline.innerHTML = '';

    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

    monthNames.forEach((name, index) => {
        const month = index + 1;
        const bar = document.createElement('div');
        bar.className = 'month-bar';

        if (peakMonths.includes(month)) {
            bar.classList.add('peak');
            bar.title = 'Mùa nở đỉnh cao';
        } else if (goodMonths.includes(month)) {
            bar.classList.add('good');
            bar.title = 'Mùa nở tốt';
        } else {
            bar.title = 'Ngoài mùa';
        }

        bar.innerHTML = `${name}`;
        timeline.appendChild(bar);
    });
}

// === UPDATE GALLERY WITH SEARCH ===
async function updateGalleryWithSearch(flowerName, flowerIcon) {
    const gallery = document.getElementById('galleryGrid');

    // Show loading state
    gallery.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--primary-pink);">🔍 Đang tìm ảnh...</div>';

    console.log(`🌸 Searching images for: ${flowerName}`);

    try {
        // Extract English name from Vietnamese name
        const englishName = extractEnglishName(flowerName);
        const searchQuery = englishName + ' flower bloom';

        console.log(`🔍 Search query: ${searchQuery}`);

        // Fetch images from Unsplash API (free, no key needed for basic usage)
        const images = await searchFlowerImages(searchQuery);

        console.log(`✅ Found ${images.length} images`);

        // Clear loading
        gallery.innerHTML = '';

        if (images.length === 0) {
            gallery.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-light);">Không tìm thấy ảnh</div>';
            return;
        }

        // Display images with staggered animation
        images.forEach((imgData, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.animationDelay = (index * 0.1) + 's';
            item.innerHTML = `
                <img src="${imgData.url}" alt="${flowerName}" loading="lazy" onerror="this.src='https://via.placeholder.com/400/FFB4D2/FFFFFF?text=${flowerIcon}'">
            `;
            item.onclick = () => {
                window.open(imgData.link, '_blank');
            };
            gallery.appendChild(item);
        });

        console.log('📸 Gallery updated successfully!');

    } catch (error) {
        console.error('❌ Error loading images:', error);
        gallery.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-light);">⚠️ Không thể tải ảnh</div>`;
    }
}

// === SEARCH FLOWER IMAGES ===
// 🌸 HÀM TÌM KIẾM ẢNH TỰ ĐỘNG
// Hỗ trợ nhiều nguồn ảnh miễn phí
async function searchFlowerImages(query) {
    try {
        /* ========================================
           📸 OPTION 1: PEXELS API (KHUYÊN DÙNG)
           ========================================
           - Miễn phí: 200 requests/giờ
           - Ảnh chất lượng cao, đẹp
           - Lấy API key: https://www.pexels.com/api/
           
           Cách dùng:
           1. Đăng ký tài khoản Pexels (miễn phí)
           2. Lấy API key từ dashboard
           3. Thay 'YOUR_PEXELS_API_KEY' bên dưới
        */
        const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // 👈 Thay key của bạn vào đây

        if (PEXELS_API_KEY !== 'YOUR_PEXELS_API_KEY') {
            // Use Pexels API
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=square`, {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.photos.map(photo => ({
                    url: photo.src.medium,
                    link: photo.url,
                    photographer: photo.photographer
                }));
            }
        }

        /* ========================================
           📸 OPTION 2: UNSPLASH SOURCE (MẶC ĐỊNH)
           ========================================
           - Hoàn toàn miễn phí
           - Không cần API key
           - Ảnh đẹp từ Unsplash
           - Có thể bị giới hạn nếu dùng nhiều
        */
        const images = [];
        const keywords = [
            query,
            query + ',nature',
            query + ',garden',
            query + ',spring',
            query + ',beautiful',
            query + ',macro'
        ];

        keywords.forEach((keyword, index) => {
            images.push({
                url: `https://source.unsplash.com/400x400/?${encodeURIComponent(keyword)}&sig=${Date.now() + index}`,
                link: `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
            });
        });

        return images;

    } catch (error) {
        console.error('Image search error:', error);

        /* ========================================
           📸 OPTION 3: FALLBACK - LOREM PICSUM
           ========================================
           - Backup khi các option trên lỗi
           - Ảnh ngẫu nhiên đẹp
        */
        const fallbackImages = [];
        for (let i = 0; i < 6; i++) {
            fallbackImages.push({
                url: `https://picsum.photos/400/400?random=${Date.now() + i}`,
                link: 'https://picsum.photos'
            });
        }
        return fallbackImages;
    }
}

/* ========================================
   📸 BONUS: GOOGLE CUSTOM SEARCH API
   ========================================
   Nếu bạn muốn dùng Google Images (kết quả chính xác hơn):
   
   1. Tạo Custom Search Engine:
      - Truy cập: https://programmablesearchengine.google.com/
      - Tạo search engine mới
      - Bật "Image Search" trong settings
      - Lấy Search Engine ID (cx)
   
   2. Lấy API Key:
      - Truy cập: https://console.cloud.google.com/
      - Enable "Custom Search API"
      - Tạo credentials → API Key
   
   3. Thay thế hàm searchFlowerImages bằng code này:
   
   async function searchFlowerImagesGoogle(query) {
       const API_KEY = 'YOUR_GOOGLE_API_KEY';
       const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID';
       
       const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=6`;
       
       try {
           const response = await fetch(url);
           const data = await response.json();
           
           return data.items.map(item => ({
               url: item.link,
               link: item.image.contextLink,
               title: item.title
           }));
       } catch (error) {
           console.error('Google search error:', error);
           return [];
       }
   }
   
   Free Tier: 100 queries/day
*/

// === EXTRACT ENGLISH NAME FROM VIETNAMESE ===
function extractEnglishName(fullName) {
    // Extract English name from format: "Hoa Anh Đào (Cherry Blossom)"
    const match = fullName.match(/\(([^)]+)\)/);
    if (match) {
        return match[1];
    }

    // Fallback: map Vietnamese to English
    const nameMap = {
        'Hoa Anh Đào': 'Cherry Blossom',
        'Hoa Oải Hương': 'Lavender',
        'Hoa Tulip': 'Tulip',
        'Hoa Hướng Dương': 'Sunflower',
        'Hoa Sen': 'Lotus'
    };

    return nameMap[fullName] || fullName;
}

// === UPDATE GALLERY (Legacy function for manual images) ===
function updateGallery(images) {
    const gallery = document.getElementById('galleryGrid');
    gallery.innerHTML = '';

    images.forEach((imgUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = (index * 0.1) + 's';
        item.innerHTML = `<img src="${imgUrl}" alt="Flower photo" loading="lazy">`;
        item.onclick = () => {
            window.open(imgUrl, '_blank');
        };
        gallery.appendChild(item);
    });
}

// === UPDATE MAP ===
function updateMap(locations, flowerData) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    if (locations.length === 0) {
        showToast('⚠️ Không tìm thấy địa điểm nào!');
        hideMapNavigation();
        return;
    }

    // Save to global variables
    currentLocations = locations;
    currentLocationIndex = 0;
    currentFlowerData = flowerData;

    // Add new markers
    locations.forEach((loc, index) => {
        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: flowerData.icon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const marker = L.marker([loc.lat, loc.lon], { icon: customIcon }).addTo(map);

        // Create enhanced popup content
        const popupContent = `
            <div class="popup-content">
                <div class="popup-title">${flowerData.icon} ${loc.name}</div>
                <div class="popup-subtitle">Địa điểm ${index + 1}/${locations.length}</div>
                <div class="popup-info">
                    <div class="popup-item">
                        <span class="popup-label">🌸 Mùa nở:</span>
                        <span class="popup-value">${flowerData.peakMonths.map(m => 'Tháng ' + m).join(', ')}</span>
                    </div>
                    <div class="popup-item">
                        <span class="popup-label">🌡️ Nhiệt độ:</span>
                        <span class="popup-value">${flowerData.temperature}</span>
                    </div>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Click on marker to update current index
        marker.on('click', () => {
            currentLocationIndex = index;
            updateNavigationInfo();
        });

        markers.push(marker);
    });

    // Add circles to show bloom regions with hover tooltip
    locations.forEach((loc, index) => {
        const circle = L.circle([loc.lat, loc.lon], {
            color: '#FF6B9D',
            fillColor: '#FFB4D2',
            fillOpacity: 0.3,
            radius: 50000 // 50km radius
        }).addTo(map);

        // Get weather data
        const weather = weatherData[loc.city] || { temp: 'N/A', condition: '☀️', humidity: 'N/A', wind: 'N/A' };

        // Create tooltip content with weather only
        const tooltipContent = `
            <div class="region-tooltip">
                <div class="tooltip-header">
                    <span class="tooltip-icon">${flowerData.icon}</span>
                    <div class="tooltip-title">
                        <strong>${loc.name}</strong>
                        <span class="tooltip-subtitle">Vùng nở hoa</span>
                    </div>
                </div>
                <div class="tooltip-weather">
                    <div class="weather-title">🌤️ Thời Tiết</div>
                    <div class="weather-grid">
                        <div class="weather-item">
                            <span class="weather-label">Nhiệt độ:</span>
                            <span class="weather-value">${weather.temp}</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-label">Tình trạng:</span>
                            <span class="weather-value">${weather.condition}</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-label">Độ ẩm:</span>
                            <span class="weather-value">${weather.humidity}</span>
                        </div>
                        <div class="weather-item">
                            <span class="weather-label">Gió:</span>
                            <span class="weather-value">${weather.wind}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create popup with custom behavior (stays open when hovering)
        const popup = L.popup({
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            className: 'region-hover-popup',
            autoPan: false,
            offset: [0, -10]
        }).setContent(tooltipContent);

        // Hover behavior for circle
        let popupTimeout;

        circle.on('mouseover', function (e) {
            clearTimeout(popupTimeout);
            popup.setLatLng(e.latlng);
            circle.bindPopup(popup).openPopup();

            // Add hover listener to popup after it's added to DOM
            setTimeout(() => {
                const popupElement = document.querySelector('.region-hover-popup');
                if (popupElement) {
                    popupElement.addEventListener('mouseenter', function () {
                        clearTimeout(popupTimeout);
                    });

                    popupElement.addEventListener('mouseleave', function () {
                        popupTimeout = setTimeout(() => {
                            circle.closePopup();
                        }, 200);
                    });
                }
            }, 100);
        });

        circle.on('mouseout', function () {
            popupTimeout = setTimeout(() => {
                const popupElement = document.querySelector('.region-hover-popup');
                if (popupElement && !popupElement.matches(':hover')) {
                    circle.closePopup();
                }
            }, 200);
        });

        // Click event
        circle.on('click', () => {
            currentLocationIndex = index;
            zoomToLocation(index);
        });
    });

    // Show navigation controls if multiple locations
    if (locations.length > 1) {
        showMapNavigation();
        updateNavigationInfo();
    } else {
        hideMapNavigation();
    }

    // Auto zoom to first location
    setTimeout(() => {
        zoomToLocation(0);
    }, 500);
}

// === SHOW TOAST NOTIFICATION ===
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// === UTILITY: GET MONTH NAME ===
function getMonthName(monthNumber) {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return months[monthNumber - 1];
}

// === GEOAPIFY GEOCODING (Optional Enhancement) ===
async function searchLocation(address) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your Geoapify API key
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat: result.lat,
                lon: result.lon,
                formatted: result.formatted
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }

    return null;
}

// === RESPONSIVE: ADJUST MAP HEIGHT ON RESIZE ===
window.addEventListener('resize', function () {
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
});

// === SMOOTH SCROLL BEHAVIOR ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function (e) {
    // Press Enter to search
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        handleSearch();
    }

    // Arrow keys for navigation
    if (currentLocations.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextLocation();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            previousLocation();
        }
    }
});

// === PREVENT FORM SUBMISSION ===
document.querySelectorAll('select, input').forEach(element => {
    element.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
});

// ============================================
// 🗺️ MAP NAVIGATION FUNCTIONS
// ============================================

// === ZOOM TO SPECIFIC LOCATION ===
function zoomToLocation(index) {
    if (index < 0 || index >= currentLocations.length) return;

    currentLocationIndex = index;
    const loc = currentLocations[index];

    // Remove active class from all markers
    markers.forEach(marker => {
        const icon = marker.getElement();
        if (icon) {
            icon.classList.remove('active');
        }
    });

    // Add active class to current marker
    if (markers[index]) {
        const activeIcon = markers[index].getElement();
        if (activeIcon) {
            activeIcon.classList.add('active');
        }
    }

    // Smooth zoom to location
    map.flyTo([loc.lat, loc.lon], 12, {
        duration: 1.5,
        easeLinearity: 0.5
    });

    // Open popup for this marker
    setTimeout(() => {
        if (markers[index]) {
            markers[index].openPopup();
        }
    }, 1600);

    // Update navigation info
    updateNavigationInfo();

    console.log(`📍 Zoomed to: ${loc.name} (${index + 1}/${currentLocations.length})`);
}

// === NEXT LOCATION ===
function nextLocation() {
    if (currentLocations.length === 0) return;

    currentLocationIndex = (currentLocationIndex + 1) % currentLocations.length;
    zoomToLocation(currentLocationIndex);

    showToast(`📍 ${currentLocations[currentLocationIndex].name}`);
}

// === PREVIOUS LOCATION ===
function previousLocation() {
    if (currentLocations.length === 0) return;

    currentLocationIndex = (currentLocationIndex - 1 + currentLocations.length) % currentLocations.length;
    zoomToLocation(currentLocationIndex);

    showToast(`📍 ${currentLocations[currentLocationIndex].name}`);
}

// === SHOW MAP NAVIGATION CONTROLS ===
function showMapNavigation() {
    let navControls = document.getElementById('mapNavControls');

    if (!navControls) {
        // Create navigation controls
        navControls = document.createElement('div');
        navControls.id = 'mapNavControls';
        navControls.className = 'map-nav-controls';
        navControls.innerHTML = `
            <button class="nav-btn nav-prev" id="navPrevBtn" title="Địa điểm trước (←)">
                <span>←</span>
            </button>
            <div class="nav-info" id="navInfo">
                <span class="nav-current">1</span>
                <span class="nav-separator">/</span>
                <span class="nav-total">4</span>
            </div>
            <button class="nav-btn nav-next" id="navNextBtn" title="Địa điểm tiếp theo (→)">
                <span>→</span>
            </button>
        `;

        document.querySelector('.map-container').appendChild(navControls);

        // Add event listeners
        document.getElementById('navPrevBtn').addEventListener('click', previousLocation);
        document.getElementById('navNextBtn').addEventListener('click', nextLocation);
    }

    navControls.style.display = 'flex';
}

// === HIDE MAP NAVIGATION CONTROLS ===
function hideMapNavigation() {
    const navControls = document.getElementById('mapNavControls');
    if (navControls) {
        navControls.style.display = 'none';
    }
}

// === UPDATE NAVIGATION INFO ===
function updateNavigationInfo() {
    const navInfo = document.getElementById('navInfo');
    if (navInfo && currentLocations.length > 0) {
        navInfo.querySelector('.nav-current').textContent = currentLocationIndex + 1;
        navInfo.querySelector('.nav-total').textContent = currentLocations.length;
    }
}

// ============================================
// 🤖 AI CHATBOT FUNCTIONS
// ============================================

// Groq API Configuration
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE'; // Replace with your Groq API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Chat history
let chatHistory = [];

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', function () {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotPopup = document.getElementById('chatbotPopup');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const suggestions = document.querySelectorAll('.suggestion-chip');

    // Toggle chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotPopup.classList.toggle('active');
        if (chatbotPopup.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotPopup.classList.remove('active');
    });

    // Send message
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Suggestion chips
    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            chatbotInput.value = chip.textContent;
            sendMessage();
        });
    });
});

// === SEND MESSAGE ===
async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message
    addMessageToChat('user', message);

    // Show typing indicator
    showTypingIndicator();

    // Get context about current flower and location
    const context = getConversationContext();

    // Send to Groq API
    try {
        const response = await sendToGroqAPI(message, context);
        removeTypingIndicator();
        await typeWriterEffect(response);
    } catch (error) {
        console.error('Groq API Error:', error);
        removeTypingIndicator();
        addMessageToChat('bot', '😔 Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau!');
    }
}

// === GET CONVERSATION CONTEXT ===
function getConversationContext() {
    let context = 'Bạn là trợ lý du lịch chuyên nghiệp, thân thiện và nhiệt tình. ';

    if (currentFlowerData && currentLocations.length > 0) {
        const currentLoc = currentLocations[currentLocationIndex];
        context += `\n\nThông tin hiện tại người dùng đang xem:\n`;
        context += `- Loài hoa: ${currentFlowerData.name}\n`;
        context += `- Địa điểm: ${currentLoc.name}\n`;
        context += `- Mùa nở đẹp nhất: ${currentFlowerData.peakMonths.map(m => 'Tháng ' + m).join(', ')}\n`;
        context += `- Nhiệt độ lý tưởng: ${currentFlowerData.temperature}\n`;
        context += `- Tips: ${currentFlowerData.tips}\n`;
        context += `\n Hãy tư vấn dựa trên thông tin này và trả lời bằng tiếng Việt một cách chi tiết, hữu ích.`;
    } else {
        context += 'Người dùng chưa chọn hoa hoặc địa điểm cụ thể. Hãy hỏi họ muốn biết thông tin về loài hoa nào và gợi ý các địa điểm ngắm hoa đẹp.';
    }

    return context;
}

// === SEND TO GROQ API ===
async function sendToGroqAPI(userMessage, context) {
    // Build messages array for Groq
    const messages = [
        {
            role: 'system',
            content: context
        },
        // Add previous chat history (last 5 messages for context)
        ...chatHistory.slice(-5),
        {
            role: 'user',
            content: userMessage
        }
    ];

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

    // Save to chat history
    chatHistory.push({ role: 'user', content: userMessage });
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
}

// === ADD MESSAGE TO CHAT ===
function addMessageToChat(type, message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    const avatar = type === 'user' ? '👤' : '🤖';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${message}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// === SHOW TYPING INDICATOR ===
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// === REMOVE TYPING INDICATOR ===
function removeTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

// === TYPEWRITER EFFECT (ChatGPT Style) ===
async function typeWriterEffect(text) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';

    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text"></div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    const textElement = messageDiv.querySelector('.message-text');

    // Typing speed
    const speed = 20; // milliseconds per character
    let index = 0;

    return new Promise((resolve) => {
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                clearInterval(typeInterval);
                resolve();
            }
        }, speed);
    });
}

console.log('🌸 Flower Bloom Forecast initialized successfully!');
