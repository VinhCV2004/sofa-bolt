import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const en = {
  hero: {
    badge: 'SOFA EARTH — Handcrafted Nature',
    titleLine1: 'Sofas from earth,',
    titleEm: 'for nature lovers',
    subtitle:
      'Natural linen, organic cotton, plant-based dyes. Every sofa is a story of earth, plants, and the hands of Vietnamese artisans.',
    ctaPrimary: 'Explore collections',
    ctaSecondary: 'View living spaces',
    promos: [
      { label: '100% Natural', text: 'No chemicals' },
      { label: '0% Installment', text: 'Up to 6 months' },
      { label: 'Free Shipping', text: 'Nationwide' },
      { label: '5-Year Warranty', text: 'Long-term commitment' },
    ],
  },
  marquee: [
    'Natural Linen',
    'FSC Oak Wood',
    'Organic Cotton',
    'Plant Dyes',
    '100% Handmade',
    'Chemical-Free',
    'Sustainable',
    'Recycled',
    'Vietnamese Artisans',
    'Local Materials',
  ],
  collections: {
    overline: 'Collections',
    titleLine1: 'Four collections,',
    titleEm: 'one green philosophy',
    description:
      'From warm terracotta to deep forest green — each collection tells a story of nature and people.',
    viewCta: 'Discover',
    items: [
      { title: 'Terra Collection', tagline: 'Terracotta · Linen', description: 'Warm earth tones, natural linen fabric, rustic and cozy feel.', count: '12 pieces' },
      { title: 'Sage Collection', tagline: 'Sage green · Organic cotton', description: 'Soothing sage green, certified organic cotton, bringing nature indoors.', count: '9 pieces' },
      { title: 'Sand Collection', tagline: 'Sand · Wool', description: 'Gentle sand tones, natural wool, elegant and timeless.', count: '8 pieces' },
      { title: 'Forest Collection', tagline: 'Forest · Plant velvet', description: 'Deep forest green, plant-dyed velvet, mysterious and warm.', count: '6 pieces' },
    ],
  },
  products: {
    overline: 'Products',
    titleLine1: 'Every sofa,',
    titleEm: 'a story',
    addToCart: 'Add to cart',
    badges: { bestseller: 'Bestseller', new: 'New', sale: 'Sale' },
    items: [
      { name: 'Sofa Terra Lounge', category: 'Terra Collection', material: 'Natural linen · Oak wood' },
      { name: 'Sofa Sage Comfort', category: 'Sage Collection', material: 'Organic cotton · Acacia wood' },
      { name: 'Sofa Sand Minimal', category: 'Sand Collection', material: 'Natural wool · Oak wood' },
      { name: 'Sofa Forest Deep', category: 'Forest Collection', material: 'Plant velvet · Walnut wood' },
      { name: 'Sofa Clay Boho', category: 'Terra Collection', material: 'Plant-dyed linen · Bamboo' },
      { name: 'Sofa Meadow Bloom', category: 'Sage Collection', material: 'Organic cotton · Ash wood' },
    ],
  },
  craft: {
    overline: 'Handcrafted',
    titleLine1: 'From nature,',
    titleEm: 'through artisan hands',
    description:
      'Every sofa is born from the harmony of earth, plants, and people. No machines, no chemicals — only the hands and hearts of Vietnamese artisans.',
    items: [
      { title: 'Natural Linen', description: 'Linen grown without pesticides, handwoven in Vietnamese weaving villages. Breathable, durable, ages beautifully.' },
      { title: 'Plant Dyes', description: 'Dyed with indigo, turmeric, and jackfruit bark — no chemicals, safe for skin and environment.' },
      { title: 'FSC Oak Wood', description: 'FSC-certified oak, sustainably harvested, naturally dried for 90 days — frames lasting 30+ years.' },
      { title: 'Hand Sewing', description: 'Each sofa is sewn by Vietnamese artisans with 15+ years of experience. Even stitching, meticulous finishing.' },
    ],
  },
  stats: {
    items: [
      { label: 'Natural materials' },
      { label: 'Years of craftsmanship' },
      { label: 'Green families served' },
      { label: 'Toxic chemicals' },
    ],
  },
  steps: {
    overline: 'Process',
    titleLine1: 'Natural from',
    titleEm: 'the very first step',
    items: [
      { title: 'Choose Material', description: 'Linen, organic cotton, wool, or plant velvet. Each material brings its own feel.' },
      { title: 'Choose Color', description: 'Earth tones, sage, sand, or forest. Plant dyes are safe and unique.' },
      { title: 'Choose Size', description: '2-seater, 3-seater, L-shape, or custom-built to your room dimensions.' },
      { title: 'Delivery & Setup', description: 'Delivered in 5-10 days, free installation. 45-day return if not satisfied.' },
    ],
  },
  gallery: {
    overline: 'Living Spaces',
    titleLine1: 'Sofa Earth in',
    titleEm: 'your home',
    items: [
      { title: 'Terra Living Room', tag: 'Terra' },
      { title: 'Sage Reading Corner', tag: 'Sage' },
      { title: 'Sand Studio', tag: 'Sand' },
      { title: 'Forest Loft', tag: 'Forest' },
      { title: 'Boho Café', tag: 'Terra' },
      { title: 'Meadow Villa', tag: 'Sage' },
    ],
  },
  testimonials: {
    overline: 'Reviews',
    titleLine1: 'A community',
    titleEm: 'that loves nature',
    items: [
      { name: 'Lê Thu Hằng', role: 'Yoga instructor', content: 'Sofa Sage Comfort in my meditation room. Organic cotton is soft, sage green is calming — perfect for a mindful space.' },
      { name: 'Trần Việt Cường', role: 'Eco-architect', content: 'I only specify sofa6 for green projects. Sustainable materials, plant dyes, and top-tier craftsmanship.' },
      { name: 'Nguyễn Phương', role: 'Café owner', content: 'Sofa Terra Lounge for my farm café. Guests love sitting all day — breathable linen, warm earth tones, super Instagrammable.' },
      { name: 'Hoàng Mai', role: 'Lifestyle blogger', content: 'Sofa Sand Minimal in my minimalist apartment. Natural wool is warm in winter, cool in summer — couldn’t love it more!' },
    ],
  },
  faqs: {
    overline: 'FAQ',
    titleLine1: 'Frequently',
    titleEm: 'asked questions',
    items: [
      { question: 'Are natural materials durable?', answer: 'Natural linen and wool are 2-3 times more durable than synthetic fabrics. With proper care, your sofa looks better year after year.' },
      { question: 'Do plant dyes fade?', answer: 'Plant dyes fade slightly over time but create a beautiful patina — this is a beloved characteristic, not a flaw.' },
      { question: 'Is the sofa safe for families with children?', answer: 'Absolutely. No toxic chemicals, no synthetic flame retardants, 100% safe for skin and children’s health.' },
      { question: 'What about warranty and returns?', answer: '5-year warranty on frame and cushions. 45-day returns. Lifetime refurbishment at discounted rates.' },
      { question: 'Can I order custom sizes?', answer: 'Yes. We build sofas to your dimensions, colors, and materials. Lead time is 5-10 business days.' },
    ],
  },
  cta: {
    overline: 'Experience nature',
    title: 'Visit our showroom and feel it',
    description:
      'Experience the softness of linen, the scent of oak, and plant-dyed colors. Book ahead for 1:1 consultation and 15% off your first order.',
    ctaPrimary: 'Book a consultation',
    ctaSecondary: 'Contact us',
    contacts: [
      { label: 'Hotline', value: '1900 6677' },
      { label: 'Showroom', value: '28 Tong Huu, D1, HCMC' },
      { label: 'Hours', value: '8:00 - 20:00 (Mon - Sun)' },
    ],
  },
};

export type Sofa6Content = typeof en;

const vi: Sofa6Content = {
  hero: {
    badge: 'SOFA EARTH — Thủ Công Thiên Nhiên',
    titleLine1: 'Sofa từ đất,',
    titleEm: 'cho người yêu thiên nhiên',
    subtitle:
      'Linen tự nhiên, bông hữu cơ, thuốc nhuộm thực vật. Mỗi chiếc sofa là câu chuyện của đất, cây, và bàn tay nghệ nhân Việt.',
    ctaPrimary: 'Khám phá bộ sưu tập',
    ctaSecondary: 'Xem không gian sống',
    promos: [
      { label: '100% Tự Nhiên', text: 'Không hóa chất' },
      { label: 'Trả Góp 0%', text: 'Trong 6 tháng' },
      { label: 'Freeship', text: 'Toàn quốc' },
      { label: 'Bảo Hành 5 Năm', text: 'Cam kết dài hạn' },
    ],
  },
  marquee: [
    'Linen Tự Nhiên',
    'Gỗ Sồi FSC',
    'Bông Hữu Cơ',
    'Thuốc Nhuộm Thực Vật',
    'Thủ Công 100%',
    'Không Hóa Chất',
    'Bền Vững',
    'Tái Chế',
    'Nghệ Nhân Việt',
    'Vật Liệu Địa Phương',
  ],
  collections: {
    overline: 'Bộ sưu tập',
    titleLine1: 'Bốn bộ sưu tập,',
    titleEm: 'một triết lý xanh',
    description:
      'Từ đất nung ấm đến xanh rừng thẫm — mỗi bộ sưu tập kể một câu chuyện về thiên nhiên và con người.',
    viewCta: 'Khám phá',
    items: [
      { title: 'Terra Collection', tagline: 'Đất nung · Linen', description: 'Tone đất ấm áp, vải linen tự nhiên, cảm giác mộc mạc và ấm cúng.', count: '12 mẫu' },
      { title: 'Sage Collection', tagline: 'Xanh lá · Bông hữu cơ', description: 'Xanh xô thơm trầm, bông hữu cơ, mang thiên nhiên vào nhà.', count: '9 mẫu' },
      { title: 'Sand Collection', tagline: 'Cát · Wool', description: 'Tone cát nhẹ nhàng, wool len tự nhiên, thanh lịch và thời thượng.', count: '8 mẫu' },
      { title: 'Forest Collection', tagline: 'Rừng · Velvet thực vật', description: 'Xanh rừng sâu thẳm, velvet nhuộm thực vật, bí ẩn và ấm áp.', count: '6 mẫu' },
    ],
  },
  products: {
    overline: 'Sản phẩm',
    titleLine1: 'Mỗi chiếc sofa,',
    titleEm: 'một câu chuyện',
    addToCart: 'Thêm vào giỏ',
    badges: { bestseller: 'Bestseller', new: 'Mới', sale: 'Giảm giá' },
    items: [
      { name: 'Sofa Terra Lounge', category: 'Terra Collection', material: 'Linen tự nhiên · Gỗ sồi' },
      { name: 'Sofa Sage Comfort', category: 'Sage Collection', material: 'Bông hữu cơ · Gỗ keo' },
      { name: 'Sofa Sand Minimal', category: 'Sand Collection', material: 'Wool len · Gỗ sồi' },
      { name: 'Sofa Forest Deep', category: 'Forest Collection', material: 'Velvet thực vật · Gỗ óc chó' },
      { name: 'Sofa Clay Boho', category: 'Terra Collection', material: 'Linen nhuộm thực vật · Tre' },
      { name: 'Sofa Meadow Bloom', category: 'Sage Collection', material: 'Bông hữu cơ · Gỗ tần bì' },
    ],
  },
  craft: {
    overline: 'Chế tác thủ công',
    titleLine1: 'Từ thiên nhiên,',
    titleEm: 'qua bàn tay nghệ nhân',
    description:
      'Mỗi chiếc sofa sinh ra từ sự phối hợp của đất, cây, và con người. Không máy móc, không hóa chất — chỉ có đôi bàn tay và trái tim của nghệ nhân Việt.',
    items: [
      { title: 'Linen Tự Nhiên', description: 'Linen trồng không thuốc trừ sâu, dệt thủ công tại làng dệt Việt. Thoáng khí, bền bỉ, đẹp hơn theo thời gian.' },
      { title: 'Thuốc Nhuộm Thực Vật', description: 'Nhuộm từ chàm, củ nghệ, vỏ bời lời — không hóa chất, an toàn cho da và môi trường.' },
      { title: 'Gỗ Sồi FSC', description: 'Gỗ sồi chứng nhận FSC, khai thác bền vững, sấy tự nhiên 90 ngày — khung sofa bền 30+ năm.' },
      { title: 'May Thủ Công', description: 'Mỗi sofa được may bởi nghệ nhân Việt với 15+ năm kinh nghiệm. Đường kim đều đặn, hoàn thiện tỉ mỉ.' },
    ],
  },
  stats: {
    items: [
      { label: 'Vật liệu tự nhiên' },
      { label: 'Năm thủ công' },
      { label: 'Gia đình xanh' },
      { label: 'Hóa chất độc hại' },
    ],
  },
  steps: {
    overline: 'Quy trình',
    titleLine1: 'Tự nhiên từ',
    titleEm: 'bước đầu tiên',
    items: [
      { title: 'Chọn Vật Liệu', description: 'Linen, bông hữu cơ, wool, hay velvet thực vật. Mỗi chất liệu mang một cảm giác riêng.' },
      { title: 'Chọn Màu Nhuộm', description: 'Tone đất, xanh xô, cát, hay rừng. Màu nhuộm thực vật an toàn và độc đáo.' },
      { title: 'Chọn Kích Thước', description: '2 chỗ, 3 chỗ, góc L, hoặc đóng theo kích thước riêng của phòng bạn.' },
      { title: 'Giao & Lắp Đặt', description: 'Giao trong 5-10 ngày, lắp đặt miễn phí. Đổi trả 45 ngày nếu không hài lòng.' },
    ],
  },
  gallery: {
    overline: 'Không gian sống',
    titleLine1: 'Sofa Earth trong',
    titleEm: 'ngôi nhà của bạn',
    items: [
      { title: 'Phòng khách Terra', tag: 'Terra' },
      { title: 'Góc đọc Sage', tag: 'Sage' },
      { title: 'Studio Sand', tag: 'Sand' },
      { title: 'Loft Forest', tag: 'Forest' },
      { title: 'Café Boho', tag: 'Terra' },
      { title: 'Villa Meadow', tag: 'Sage' },
    ],
  },
  testimonials: {
    overline: 'Đánh giá',
    titleLine1: 'Cộng đồng',
    titleEm: 'yêu thiên nhiên',
    items: [
      { name: 'Lê Thu Hằng', role: 'Yoga instructor', content: 'Sofa Sage Comfort trong phòng thiền của mình. Bông hữu cơ êm ái, màu xanh xô dịu mắt — hoàn hảo cho không gian chánh niệm.' },
      { name: 'Trần Việt Cường', role: 'Eco-architect', content: 'Tôi chỉ định sofa6 cho các dự án xanh. Vật liệu bền vững, thuốc nhuộm thực vật, và chất lượng thủ công đỉnh cao.' },
      { name: 'Nguyễn Phương', role: 'Café owner', content: 'Sofa Terra Lounge cho quán cafe nông trại. Khách thích ngồi cả ngày — linen thoáng, tone đất ấm, cực kỳ "Instagram".' },
      { name: 'Hoàng Mai', role: 'Lifestyle blogger', content: 'Sofa Sand Minimal trong căn hộ tối giản của mình. Wool tự nhiên ấm mùa đông, mát mùa hè — không thể yêu hơn!' },
    ],
  },
  faqs: {
    overline: 'FAQ',
    titleLine1: 'Câu hỏi',
    titleEm: 'thường gặp',
    items: [
      { question: 'Vật liệu tự nhiên có bền không?', answer: 'Linen và wool tự nhiên bền hơn vải công nghiệp 2-3 lần. Được chăm sóc đúng cách, sofa của bạn đẹp hơn theo năm tháng.' },
      { question: 'Thuốc nhuộm thực vật có phai màu không?', answer: 'Thuốc nhuộm thực vật phai nhẹ theo thời gian nhưng tạo patina đẹp — đây là đặc tính được yêu thích, không phải khuyết điểm.' },
      { question: 'Sofa có phù hợp cho gia đình có trẻ nhỏ không?', answer: 'Hoàn toàn. Không hóa chất độc hại, không chất chống cháy tổng hợp, an toàn 100% cho làn da và sức khỏe trẻ nhỏ.' },
      { question: 'Bảo hành và đổi trả như thế nào?', answer: 'Bảo hành 5 năm cho khung và đệm. Đổi trả 45 ngày. Bảo trì làm mới bọc với chi phí ưu đãi trọn đời.' },
      { question: 'Có đóng theo kích thước riêng không?', answer: 'Có. Chúng tôi đóng sofa theo kích thước, màu sắc, và vật liệu theo yêu cầu. Thời gian hoàn thành 5-10 ngày làm việc.' },
    ],
  },
  cta: {
    overline: 'Trải nghiệm thiên nhiên',
    title: 'Ghé showroom và cảm nhận',
    description:
      'Trải nghiệm độ êm của linen, mùi thơm của gỗ sồi, và sắc màu nhuộm thực vật. Đặt hẹn trước để nhận tư vấn 1:1 và giảm 15% cho đơn đầu tiên.',
    ctaPrimary: 'Đặt hẹn tư vấn',
    ctaSecondary: 'Liên hệ chúng tôi',
    contacts: [
      { label: 'Hotline', value: '1900 6677' },
      { label: 'Showroom', value: '28 Tống hữu, Q1, TP.HCM' },
      { label: 'Giờ mở cửa', value: '8:00 - 20:00 (T2 - CN)' },
    ],
  },
};

const fr: Sofa6Content = {
  hero: {
    badge: 'SOFA EARTH — Artisanat Naturel',
    titleLine1: 'Des canapés de terre,',
    titleEm: 'pour les amoureux de la nature',
    subtitle:
      'Lin naturel, coton bio, teintures végétales. Chaque canapé raconte l’histoire de la terre, des plantes et des mains d’artisans vietnamiens.',
    ctaPrimary: 'Découvrir les collections',
    ctaSecondary: 'Voir nos espaces de vie',
    promos: [
      { label: '100% Naturel', text: 'Sans produits chimiques' },
      { label: '0% Paiement échelonné', text: 'Sur 6 mois' },
      { label: 'Livraison gratuite', text: 'Partout au pays' },
      { label: 'Garantie 5 ans', text: 'Engagement à long terme' },
    ],
  },
  marquee: [
    'Lin Naturel',
    'Chêne FSC',
    'Coton Bio',
    'Teintures Végétales',
    '100% Fait Main',
    'Sans Chimie',
    'Durable',
    'Recyclé',
    'Artisans Vietnamiens',
    'Matériaux Locaux',
  ],
  collections: {
    overline: 'Collections',
    titleLine1: 'Quatre collections,',
    titleEm: 'une philosophie verte',
    description:
      'Du terracotta chaud au vert forêt profond — chaque collection raconte une histoire de nature et d’humains.',
    viewCta: 'Découvrir',
    items: [
      { title: 'Collection Terra', tagline: 'Terracotta · Lin', description: 'Tons terre chauds, lin naturel, ambiance rustique et chaleureuse.', count: '12 modèles' },
      { title: 'Collection Sage', tagline: 'Vert sauge · Coton bio', description: 'Vert sauge apaisant, coton bio certifié, la nature à l’intérieur.', count: '9 modèles' },
      { title: 'Collection Sand', tagline: 'Sable · Laine', description: 'Tons sable doux, laine naturelle, élégant et intemporel.', count: '8 modèles' },
      { title: 'Collection Forest', tagline: 'Forêt · Velours végétal', description: 'Vert forêt profond, velours teint végétal, mystérieux et chaleureux.', count: '6 modèles' },
    ],
  },
  products: {
    overline: 'Produits',
    titleLine1: 'Chaque canapé,',
    titleEm: 'une histoire',
    addToCart: 'Ajouter au panier',
    badges: { bestseller: 'Best-seller', new: 'Nouveau', sale: 'Promo' },
    items: [
      { name: 'Sofa Terra Lounge', category: 'Collection Terra', material: 'Lin naturel · Chêne' },
      { name: 'Sofa Sage Comfort', category: 'Collection Sage', material: 'Coton bio · Acacia' },
      { name: 'Sofa Sand Minimal', category: 'Collection Sand', material: 'Laine naturelle · Chêne' },
      { name: 'Sofa Forest Deep', category: 'Collection Forest', material: 'Velours végétal · Noyer' },
      { name: 'Sofa Clay Boho', category: 'Collection Terra', material: 'Lin teint végétal · Bambou' },
      { name: 'Sofa Meadow Bloom', category: 'Collection Sage', material: 'Coton bio · Frêne' },
    ],
  },
  craft: {
    overline: 'Artisanat',
    titleLine1: 'De la nature,',
    titleEm: 'par les mains d’artisans',
    description:
      'Chaque canapé naît de l’harmonie entre terre, plantes et humains. Pas de machines, pas de chimie — seulement les mains et les cœurs des artisans vietnamiens.',
    items: [
      { title: 'Lin Naturel', description: 'Lin cultivé sans pesticides, tissé à la main dans les villages vietnamiens. Respirant, durable, embellit avec le temps.' },
      { title: 'Teintures Végétales', description: 'Teints à l’indigo, au curcuma et à l’écorce de jacquier — sans chimie, sûrs pour la peau et l’environnement.' },
      { title: 'Chêne FSC', description: 'Chêne certifié FSC, exploitation durable, séchage naturel 90 jours — des cadres qui durent 30+ ans.' },
      { title: 'Couture Main', description: 'Chaque canapé est cousu par des artisans vietnamiens avec 15+ ans d’expérience. Coutures régulières, finitions soignées.' },
    ],
  },
  stats: {
    items: [
      { label: 'Matériaux naturels' },
      { label: 'Ans d’artisanat' },
      { label: 'Familles vertes servies' },
      { label: 'Produits chimiques toxiques' },
    ],
  },
  steps: {
    overline: 'Processus',
    titleLine1: 'Naturel dès',
    titleEm: 'la première étape',
    items: [
      { title: 'Choisir la matière', description: 'Lin, coton bio, laine ou velours végétal. Chaque matière apporte sa sensation propre.' },
      { title: 'Choisir la couleur', description: 'Tons terre, sauge, sable ou forêt. Teintures végétales sûres et uniques.' },
      { title: 'Choisir la taille', description: '2 places, 3 places, angle L, ou sur-mesure selon vos dimensions.' },
      { title: 'Livraison & installation', description: 'Livré en 5-10 jours, installation gratuite. Retour sous 45 jours si insatisfait.' },
    ],
  },
  gallery: {
    overline: 'Espaces de vie',
    titleLine1: 'Sofa Earth dans',
    titleEm: 'votre maison',
    items: [
      { title: 'Salon Terra', tag: 'Terra' },
      { title: 'Coin lecture Sage', tag: 'Sage' },
      { title: 'Studio Sand', tag: 'Sand' },
      { title: 'Loft Forest', tag: 'Forest' },
      { title: 'Café Boho', tag: 'Terra' },
      { title: 'Villa Meadow', tag: 'Sage' },
    ],
  },
  testimonials: {
    overline: 'Avis',
    titleLine1: 'Une communauté',
    titleEm: 'qui aime la nature',
    items: [
      { name: 'Lê Thu Hằng', role: 'Professeure de yoga', content: 'Sofa Sage Comfort dans ma salle de méditation. Coton bio doux, vert sauge apaisant — parfait pour un espace de pleine conscience.' },
      { name: 'Trần Việt Cường', role: 'Architecte éco', content: 'Je ne recommande que sofa6 pour mes projets verts. Matériaux durables, teintures végétales et artisanat d’exception.' },
      { name: 'Nguyễn Phương', role: 'Propriétaire de café', content: 'Sofa Terra Lounge pour mon café-ferme. Les clients adorent y rester toute la journée — lin respirant, tons terre chauds, super Instagrammable.' },
      { name: 'Hoàng Mai', role: 'Blogueuse lifestyle', content: 'Sofa Sand Minimal dans mon appartement minimaliste. Laine naturelle chaude en hiver, fraîche en été — je ne pourrais pas aimer plus!' },
    ],
  },
  faqs: {
    overline: 'FAQ',
    titleLine1: 'Questions',
    titleEm: 'fréquentes',
    items: [
      { question: 'Les matériaux naturels sont-ils durables?', answer: 'Le lin et la laine naturels sont 2 à 3 fois plus durables que les tissus synthétiques. Bien entretenus, votre canapé s’embellit au fil des ans.' },
      { question: 'Les teintures végétales s’estompent-elles?', answer: 'Les teintures végétales s’estompent légèrement avec le temps mais créent une belle patine — c’est une caractéristique appréciée, pas un défaut.' },
      { question: 'Le canapé convient-il aux familles avec enfants?', answer: 'Absolument. Aucun produit chimique toxique, aucun retardateur de flamme synthétique, 100% sûr pour la peau et la santé des enfants.' },
      { question: 'Qu’en est-il de la garantie et des retours?', answer: 'Garantie 5 ans sur le cadre et les coussins. Retours sous 45 jours. Rénovation à tarif réduit à vie.' },
      { question: 'Puis-je commander sur-mesure?', answer: 'Oui. Nous fabriquons selon vos dimensions, couleurs et matériaux. Délai de 5 à 10 jours ouvrés.' },
    ],
  },
  cta: {
    overline: 'Vivre la nature',
    title: 'Visitez notre showroom et ressentez',
    description:
      'Découvrez la douceur du lin, le parfum du chêne et les couleurs teintures végétales. Réservez à l’avance pour un conseil 1:1 et 15% de réduction sur la première commande.',
    ctaPrimary: 'Réserver une consultation',
    ctaSecondary: 'Nous contacter',
    contacts: [
      { label: 'Hotline', value: '1900 6677' },
      { label: 'Showroom', value: '28 Tong Huu, D1, HCMC' },
      { label: 'Heures', value: '8h00 - 20h00 (Lun - Dim)' },
    ],
  },
};

const cn: Sofa6Content = {
  hero: {
    badge: 'SOFA EARTH — 手工自然',
    titleLine1: '来自大地的沙发,',
    titleEm: '献给热爱自然的人',
    subtitle:
      '天然亚麻、有机棉、植物染料。每一张沙发都是泥土、植物和越南工匠双手的故事。',
    ctaPrimary: '探索系列',
    ctaSecondary: '查看生活空间',
    promos: [
      { label: '100% 天然', text: '无化学物质' },
      { label: '0% 分期', text: '最长6个月' },
      { label: '免费配送', text: '全国范围' },
      { label: '5年质保', text: '长期承诺' },
    ],
  },
  marquee: [
    '天然亚麻',
    'FSC橡木',
    '有机棉',
    '植物染料',
    '100% 手工',
    '无化学',
    '可持续',
    '可回收',
    '越南工匠',
    '本地材料',
  ],
  collections: {
    overline: '系列',
    titleLine1: '四大系列,',
    titleEm: '一种绿色理念',
    description: '从温暖的陶土色到深邃的森林绿 — 每个系列讲述自然与人的故事。',
    viewCta: '探索',
    items: [
      { title: 'Terra 系列', tagline: '陶土 · 亚麻', description: '温暖的大地色调, 天然亚麻面料, 质朴温馨。', count: '12款' },
      { title: 'Sage 系列', tagline: '鼠尾草绿 · 有机棉', description: '舒缓的鼠尾草绿, 认证有机棉, 将自然带入室内。', count: '9款' },
      { title: 'Sand 系列', tagline: '沙色 · 羊毛', description: '柔和的沙色调, 天然羊毛, 优雅永恒。', count: '8款' },
      { title: 'Forest 系列', tagline: '森林 · 植物天鹅绒', description: '深邃的森林绿, 植物染天鹅绒, 神秘温暖。', count: '6款' },
    ],
  },
  products: {
    overline: '产品',
    titleLine1: '每一张沙发,',
    titleEm: '一个故事',
    addToCart: '加入购物车',
    badges: { bestseller: '畅销', new: '新品', sale: '特价' },
    items: [
      { name: 'Sofa Terra Lounge', category: 'Terra 系列', material: '天然亚麻 · 橡木' },
      { name: 'Sofa Sage Comfort', category: 'Sage 系列', material: '有机棉 · 相思木' },
      { name: 'Sofa Sand Minimal', category: 'Sand 系列', material: '天然羊毛 · 橡木' },
      { name: 'Sofa Forest Deep', category: 'Forest 系列', material: '植物天鹅绒 · 胡桃木' },
      { name: 'Sofa Clay Boho', category: 'Terra 系列', material: '植物染亚麻 · 竹子' },
      { name: 'Sofa Meadow Bloom', category: 'Sage 系列', material: '有机棉 · 白蜡木' },
    ],
  },
  craft: {
    overline: '手工制作',
    titleLine1: '来自自然,',
    titleEm: '经由工匠之手',
    description: '每张沙发诞生于泥土、植物与人的和谐共生。没有机器, 没有化学物质 — 只有越南工匠的双手与心意。',
    items: [
      { title: '天然亚麻', description: '无农药种植的亚麻, 在越南纺织村手工织造。透气、耐用、越用越美。' },
      { title: '植物染料', description: '用靛蓝、姜黄、菠萝蜜树皮染色 — 无化学物质, 对皮肤和环境安全。' },
      { title: 'FSC橡木', description: 'FSC认证橡木, 可持续采伐, 自然干燥90天 — 框架可使用30年以上。' },
      { title: '手工缝制', description: '每张沙发由15年以上经验的越南工匠缝制。针脚均匀, 做工精细。' },
    ],
  },
  stats: {
    items: [
      { label: '天然材料' },
      { label: '年手工经验' },
      { label: '绿色家庭' },
      { label: '有毒化学物质' },
    ],
  },
  steps: {
    overline: '流程',
    titleLine1: '从第一步开始',
    titleEm: '就是天然的',
    items: [
      { title: '选择材料', description: '亚麻、有机棉、羊毛或植物天鹅绒。每种材料都有独特的触感。' },
      { title: '选择颜色', description: '大地色、鼠尾草、沙色或森林色。植物染料安全且独特。' },
      { title: '选择尺寸', description: '双人、三人、L型, 或按您的房间尺寸定制。' },
      { title: '配送与安装', description: '5-10天送达, 免费安装。45天内不满意可退。' },
    ],
  },
  gallery: {
    overline: '生活空间',
    titleLine1: 'Sofa Earth 在',
    titleEm: '你的家中',
    items: [
      { title: 'Terra 客厅', tag: 'Terra' },
      { title: 'Sage 阅读角', tag: 'Sage' },
      { title: 'Sand 工作室', tag: 'Sand' },
      { title: 'Forest 阁楼', tag: 'Forest' },
      { title: 'Boho 咖啡馆', tag: 'Terra' },
      { title: 'Meadow 别墅', tag: 'Sage' },
    ],
  },
  testimonials: {
    overline: '评价',
    titleLine1: '一个热爱自然的',
    titleEm: '社区',
    items: [
      { name: 'Lê Thu Hằng', role: '瑜伽教练', content: 'Sofa Sage Comfort 放在我的冥想室。有机棉柔软, 鼠尾草绿令人平静 — 正念空间的完美选择。' },
      { name: 'Trần Việt Cường', role: '生态建筑师', content: '我只在绿色项目中推荐 sofa6。可持续材料、植物染料和顶尖工艺。' },
      { name: 'Nguyễn Phương', role: '咖啡馆老板', content: 'Sofa Terra Lounge 放在我的农场咖啡馆。客人喜欢坐一整天 — 亚麻透气, 大地色温暖, 超级适合拍照。' },
      { name: 'Hoàng Mai', role: '生活方式博主', content: 'Sofa Sand Minimal 放在我的极简公寓。天然羊毛冬暖夏凉 — 再爱不过了!' },
    ],
  },
  faqs: {
    overline: '常见问题',
    titleLine1: '常见',
    titleEm: '问题解答',
    items: [
      { question: '天然材料耐用吗?', answer: '天然亚麻和羊毛比合成面料耐用2-3倍。正确保养下, 你的沙发会越用越美。' },
      { question: '植物染料会褪色吗?', answer: '植物染料会随时间轻微褪色, 但会形成美丽的包浆 — 这是一种受人喜爱的特性, 不是缺陷。' },
      { question: '沙发适合有小孩的家庭吗?', answer: '完全适合。无毒化学物质, 无合成阻燃剂, 100% 安全的皮肤和儿童健康。' },
      { question: '质保和退换政策如何?', answer: '框架和坐垫5年质保。45天退换。终身优惠翻新服务。' },
      { question: '可以定制尺寸吗?', answer: '可以。我们按你的尺寸、颜色和材料定制沙发。交货期5-10个工作日。' },
    ],
  },
  cta: {
    overline: '体验自然',
    title: '到展厅亲身感受',
    description: '体验亚麻的柔软、橡木的香气和植物染色的色彩。提前预约享1对1咨询和首单15%折扣。',
    ctaPrimary: '预约咨询',
    ctaSecondary: '联系我们',
    contacts: [
      { label: '热线', value: '1900 6677' },
      { label: '展厅', value: '28 Tong Huu, D1, 胡志明市' },
      { label: '营业时间', value: '8:00 - 20:00 (周一至周日)' },
    ],
  },
};

const ar: Sofa6Content = {
  hero: {
    badge: 'صوفا إيرث — حرفة طبيعية',
    titleLine1: 'أرائك من الأرض،',
    titleEm: 'لمحبي الطبيعة',
    subtitle:
      'كتان طبيعي، قطن عضوي، أصباغ نباتية. كل أريكة هي قصة الأرض والنبات وأيدي الحرفيين الفيتناميين.',
    ctaPrimary: 'استكشف المجموعات',
    ctaSecondary: 'شاهد المساحات الحية',
    promos: [
      { label: '100% طبيعي', text: 'بدون مواد كيميائية' },
      { label: '0% تقسيط', text: 'حتى 6 أشهر' },
      { label: 'شحن مجاني', text: 'في جميع أنحاء البلاد' },
      { label: 'ضمان 5 سنوات', text: 'التزام طويل الأمد' },
    ],
  },
  marquee: [
    'كتان طبيعي',
    'خشب البلوط FSC',
    'قطن عضوي',
    'أصباغ نباتية',
    '100% يدوي',
    'بدون كيماويات',
    'مستدام',
    'معاد تدويره',
    'حرفيون فيتناميون',
    'مواد محلية',
  ],
  collections: {
    overline: 'المجموعات',
    titleLine1: 'أربع مجموعات،',
    titleEm: 'فلسفة خضراء واحدة',
    description: 'من الطين الدافئ إلى الأخضر الغابي العميق — كل مجموعة تروي قصة الطبيعة والإنسان.',
    viewCta: 'اكتشف',
    items: [
      { title: 'مجموعة Terra', tagline: 'طين · كتان', description: 'درجات أرضية دافئة، كتان طبيعي، إحساس ريفي ودافئ.', count: '12 قطعة' },
      { title: 'مجموعة Sage', tagline: 'أخضر مريمي · قطن عضوي', description: 'أخضر مريمي مهدئ، قطن عضوي معتمد، إدخال الطبيعة للداخل.', count: '9 قطع' },
      { title: 'مجموعة Sand', tagline: 'رملي · صوف', description: 'درجات رملية لطيفة، صوف طبيعي، أنيق وخالد.', count: '8 قطع' },
      { title: 'مجموعة Forest', tagline: 'غابة · مخمل نباتي', description: 'أخضر غابي عميق، مخمل بصبغة نباتية، غامض ودافئ.', count: '6 قطع' },
    ],
  },
  products: {
    overline: 'المنتجات',
    titleLine1: 'كل أريكة،',
    titleEm: 'قصة',
    addToCart: 'أضف إلى السلة',
    badges: { bestseller: 'الأكثر مبيعًا', new: 'جديد', sale: 'تخفيض' },
    items: [
      { name: 'Sofa Terra Lounge', category: 'مجموعة Terra', material: 'كتان طبيعي · خشب البلوط' },
      { name: 'Sofa Sage Comfort', category: 'مجموعة Sage', material: 'قطن عضوي · خشب الأكاسيا' },
      { name: 'Sofa Sand Minimal', category: 'مجموعة Sand', material: 'صوف طبيعي · خشب البلوط' },
      { name: 'Sofa Forest Deep', category: 'مجموعة Forest', material: 'مخمل نباتي · خشب الجوز' },
      { name: 'Sofa Clay Boho', category: 'مجموعة Terra', material: 'كتان بصبغة نباتية · خيزران' },
      { name: 'Sofa Meadow Bloom', category: 'مجموعة Sage', material: 'قطن عضوي · خشب الدردار' },
    ],
  },
  craft: {
    overline: 'حرفة يدوية',
    titleLine1: 'من الطبيعة،',
    titleEm: 'بأيدي الحرفيين',
    description:
      'كل أريكة تولد من انسجام الأرض والنبات والإنسان. لا آلات، لا كيماويات — فقط أيدي وقلوب الحرفيين الفيتناميين.',
    items: [
      { title: 'كتان طبيعي', description: 'كتان مزروع بدون مبيدات، منسوج يدويًا في قرى النسيج الفيتنامية. قابل للتنفس، متين، يزداد جمالاً مع الوقت.' },
      { title: 'أصباغ نباتية', description: 'مصبوغ بالنيلة والكركم وقشر الجاك — بدون كيماويات، آمن للبشرة والبيئة.' },
      { title: 'خشب البلوط FSC', description: 'بلوط معتمد FSC، حصاد مستدام، تجفيف طبيعي 90 يومًا — هياكل تدوم 30+ سنة.' },
      { title: 'خياطة يدوية', description: 'كل أريكة مخيطة بواسطة حرفيين فيتناميين بخبرة 15+ سنة. غرز متساوية، تشطيب دقيق.' },
    ],
  },
  stats: {
    items: [
      { label: 'مواد طبيعية' },
      { label: 'سنوات من الحرفة' },
      { label: 'عائلات خضراء' },
      { label: 'مواد كيميائية سامة' },
    ],
  },
  steps: {
    overline: 'العملية',
    titleLine1: 'طبيعي من',
    titleEm: 'الخطوة الأولى',
    items: [
      { title: 'اختر المادة', description: 'كتان، قطن عضوي، صوف، أو مخمل نباتي. كل مادة لها إحساسها الخاص.' },
      { title: 'اختر اللون', description: 'درجات أرضية، مريمي، رملي، أو غابي. أصباغ نباتية آمنة وفريدة.' },
      { title: 'اختر الحجم', description: 'مقعدان، ثلاثة، زاوية L، أو مخصص حسب أبعاد غرفتك.' },
      { title: 'التوصيل والتركيب', description: 'يُسلّم في 5-10 أيام، تركيب مجاني. إرجاع خلال 45 يومًا إذا لم تكن راضيًا.' },
    ],
  },
  gallery: {
    overline: 'مساحات حية',
    titleLine1: 'Sofa Earth في',
    titleEm: 'منزلك',
    items: [
      { title: 'غرفة معيشة Terra', tag: 'Terra' },
      { title: 'ركن قراءة Sage', tag: 'Sage' },
      { title: 'استوديو Sand', tag: 'Sand' },
      { title: 'لوفت Forest', tag: 'Forest' },
      { title: 'مقهى Boho', tag: 'Terra' },
      { title: 'فيلا Meadow', tag: 'Sage' },
    ],
  },
  testimonials: {
    overline: 'التقييمات',
    titleLine1: 'مجتمع',
    titleEm: 'يحب الطبيعة',
    items: [
      { name: 'Lê Thu Hằng', role: 'مدرّبة يوغا', content: 'Sofa Sage Comfort في غرفة التأمل. القطن العضوي ناعم، الأخضر المريمي مهدئ — مثالي لمساحة اليقظة.' },
      { name: 'Trần Việt Cường', role: 'مهندس بيئي', content: 'أوصي فقط بـ sofa6 للمشاريع الخضراء. مواد مستدامة، أصباغ نباتية، وحرفية من الطراز الأول.' },
      { name: 'Nguyễn Phương', role: 'صاحبة مقهى', content: 'Sofa Terra Lounge لمقهى المزرعة. الزبائن يحبون الجلوس طوال اليوم — كتان قابل للتنفس، درجات أرضية دافئة، رائع للإنستغرام.' },
      { name: 'Hoàng Mai', role: 'مدونة نمط حياة', content: 'Sofa Sand Minimal في شقتي البسيطة. الصوف الطبيعي دافئ شتاءً وبارد صيفًا — لا يمكنني أن أحبها أكثر!' },
    ],
  },
  faqs: {
    overline: 'الأسئلة الشائعة',
    titleLine1: 'الأسئلة',
    titleEm: 'المتكررة',
    items: [
      { question: 'هل المواد الطبيعية متينة؟', answer: 'الكتان والصوف الطبيعيان أكثر متانة 2-3 مرات من الأقمشة الصناعية. مع العناية الصحيحة، أريكتك تصبح أجمل عامًا بعد عام.' },
      { question: 'هل تتلاشى الأصباغ النباتية؟', answer: 'تتلاشى الأصباغ النباتية قليلاً مع الوقت لكنها تخلق طلاءً جميلاً — هذه خاصية محبوبة وليست عيبًا.' },
      { question: 'هل الأريكة مناسبة للعائلات ذات الأطفال؟', answer: 'تمامًا. لا مواد كيميائية سامة، لا مثبطات لهب صناعية، آمنة 100% للبشرة وصحة الأطفال.' },
      { question: 'ماذا عن الضمان والإرجاع؟', answer: 'ضمان 5 سنوات للإطار والوسائد. إرجاع خلال 45 يومًا. تجديد مدى الحياة بأسعار مخفضة.' },
      { question: 'هل يمكنني طلب مقاسات مخصصة؟', answer: 'نعم. نصنع الأرائك حسب أبعادك وألوانك وموادك. مدة التسليم 5-10 أيام عمل.' },
    ],
  },
  cta: {
    overline: 'عش الطبيعة',
    title: 'زر صالة العرض واشعر بنفسك',
    description: 'اختبر نعومة الكتان، رائحة البلوط، وألوان الأصباغ النباتية. احجز مسبقًا لاستشارة فردية وخصم 15% على طلبك الأول.',
    ctaPrimary: 'احجز استشارة',
    ctaSecondary: 'اتصل بنا',
    contacts: [
      { label: 'الخط الساخن', value: '1900 6677' },
      { label: 'صالة العرض', value: '28 Tong Huu, D1, HCMC' },
      { label: 'الساعات', value: '8:00 - 20:00 (الإثنين - الأحد)' },
    ],
  },
};

const SOFA6_CONTENT = { en, vi, fr, cn, ar };

export function useSofa6Content() {
  const { currentLang } = useTranslate();
  return SOFA6_CONTENT[currentLang.value as keyof typeof SOFA6_CONTENT] ?? SOFA6_CONTENT.en;
}
