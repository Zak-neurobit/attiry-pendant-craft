export interface Review {
  id: string;
  user_id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: number;
  not_helpful: number;
  created_at: string;
  customText?: string; // The text they had engraved
  color?: string; // Color variant they ordered
}

// Generate random review data for each product
const generateReviewId = () => crypto.randomUUID();

// Diverse reviewer names (70% women, 30% men)
const femaleNames = {
  american: [
    'Sarah Johnson', 'Emily Davis', 'Ashley Williams', 'Jennifer Miller', 'Michelle Thompson',
    'Amanda Wilson', 'Jessica Martinez', 'Lisa Anderson', 'Rachel Brown', 'Samantha Garcia',
    'Nicole Taylor', 'Lauren White', 'Stephanie Jones', 'Megan Lee', 'Brittany Clark',
    'Danielle Lewis', 'Christina Hall', 'Victoria Adams', 'Kayla Walker', 'Alexis Young',
    'Morgan Scott', 'Jordan Green', 'Taylor Parker', 'Casey Carter', 'Riley Mitchell'
  ],
  arab: [
    'Fatima Al-Zahra', 'Aisha Hassan', 'Layla Mahmoud', 'Zara Ahmad', 'Nour Al-Din',
    'Yasmin Khalil', 'Amira Saleh', 'Rana Farouk', 'Dina Mansour', 'Hala Nasser',
    'Lina Qaddour', 'Maya Khoury', 'Reem Shadid', 'Nada Boutros'
  ],
  european: [
    'Sophie Dubois', 'Isabella Rossi', 'Emma Müller', 'Olivia Schmidt', 'Charlotte Andersson',
    'Amelie Larsson', 'Lucia Fernandez', 'Anna Kowalski', 'Marie Lefebvre', 'Elena Popov',
    'Zara Petrov', 'Luna Novak', 'Aria Costa', 'Mila Jansen'
  ],
  australian: [
    'Chloe Thompson', 'Ruby Mitchell', 'Zoe Patterson', 'Grace O\'Sullivan', 'Isla MacLeod'
  ]
};

const maleNames = {
  american: [
    'Michael Johnson', 'David Smith', 'James Wilson', 'Robert Brown', 'Christopher Davis',
    'Matthew Miller', 'Joshua Garcia', 'Andrew Martinez', 'Daniel Rodriguez', 'Joseph Anderson'
  ],
  arab: [
    'Omar Al-Rashid', 'Ahmed Hassan', 'Khalil Mansour', 'Samir Khoury'
  ],
  european: [
    'Lucas Dubois', 'Marco Rossi', 'Alexander Müller', 'Henrik Andersson', 'Pierre Lefebvre'
  ],
  australian: [
    'Ryan Mitchell', 'Liam O\'Sullivan'
  ]
};

// Profile images for reviewers (60% have photos, 40% use initials)
const femaleImages = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=64&h=64&fit=crop&crop=face'
];

const maleImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face'
];

const customTexts = [
  'Sarah', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper',
  'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe',
  'Layla', 'Zara', 'Yasmin', 'Aisha', 'Nour', 'Maya', 'Lina', 'Fatima', 'Hala', 'Dina',
  'Mom', 'Love', 'Faith', 'Hope', 'Joy', 'Family', 'Blessed', 'Dream', 'Angel', 'Forever',
  'Luna', 'Aria', 'Zoe', 'Ruby', 'Isla', 'Amelie', 'Elena', 'Anna', 'Marie', 'Lucia'
];

// Helper function to generate initials avatar
const generateInitialsAvatar = (name: string): string => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
  const color = colors[name.length % colors.length];
  
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="${color}"/>
      <text x="32" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
    </svg>`
  )}`;
};

const colors = ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'];

// Unique review templates - each will be used only once
const fiveStarReviews = [
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Absolutely breathtaking! The ${productName} exceeded every expectation. The craftsmanship is museum-quality and the "${customText}" engraving is flawless.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Bought this for my wife's birthday and she cried happy tears! The ${color} finish is stunning and the quality is exceptional. Worth every penny.` 
           : `This pendant has become my signature piece! I get compliments everywhere I go. The "${customText}" is perfectly centered and the chain is substantial.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The attention to detail is incredible. Every curve of the letters is perfect, and the ${color} color catches light beautifully. Shipped faster than expected too!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `My girlfriend absolutely loves her new pendant! The ${productName} arrived in the most elegant packaging I've ever seen. She wears it every single day now.`
           : `I'm obsessed with this pendant! The weight feels luxurious and the engraving is so precise. I've already recommended it to three friends.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Customer service was phenomenal and the final product is perfection. The ${color} finish has this amazing depth that photos can't capture. 10/10!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `This is my third order from this company - consistent excellence every time! The "${customText}" came out exactly as I envisioned. Simply gorgeous.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Surprised my fiancée with this for our anniversary and she was speechless! The quality rivals pieces costing twice as much. Highly recommend!`
           : `I've been wearing this daily for weeks and it still looks brand new. The craftsmanship is outstanding and it's become part of my identity.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The packaging alone made this feel like a luxury experience. When I opened it, the pendant was even more beautiful than in the photos. Pure artistry!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `I'm a jewelry collector and this piece stands out in my collection. The ${productName} has this timeless elegance that will never go out of style.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `My daughter turned 16 and this was the perfect gift. She texted me a selfie wearing it within minutes of opening the box. Priceless moment!`
           : `The lettering is so crisp and clean - you can tell this was made by master craftspeople. I treasure this piece and will pass it down someday.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Ordered this on a Monday, wore it to dinner Friday night and received 5 compliments! The ${color} color is rich and sophisticated. Love it!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The chain feels premium and the clasp is secure - no cheap materials here. This pendant will last a lifetime and the engraving will never fade.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Got this for my mom for Mother's Day and she was so touched. The quality is restaurant-chef-kiss perfect and she wears it with everything now.`
           : `I'm extremely picky about jewelry and this piece met every standard. The proportions are perfect and it sits beautifully on the neckline.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The detail work is microscopic-level precise. You can see the individual tool marks that show this was hand-finished. True artisan quality!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `This pendant has emotional value beyond its beauty. Every time I touch it, I smile. The "${customText}" represents everything important to me.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Bought matching pendants for my twin daughters and they're obsessed! The quality consistency between both pieces is remarkable. A+ company!`
           : `I work in fashion and this piece gets more attention than designer jewelry costing 10x more. The craftsmanship speaks for itself.`
];

const fourHalfStarReviews = [
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Beautiful pendant with excellent craftsmanship! Shipping took a week longer than expected, but the quality made the wait worthwhile. Very happy overall.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The ${color} finish is gorgeous and the engraving is crystal clear. Only minor complaint is the chain could be slightly longer, but the pendant itself is perfect.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `My wife loves her new pendant! The quality exceeded expectations. The packaging could be more premium for the price point, but the product is stellar.`
           : `Absolutely love the "${customText}" engraving - it's exactly what I wanted. The pendant is slightly smaller than I imagined but still very elegant.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Great quality materials and the craftsmanship is evident. Customer service was helpful when I had questions about sizing. Would definitely order again!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The pendant is beautiful and well-made. The only reason it's not 5 stars is because the color was slightly different from the website photos. Still gorgeous though!`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Ordered this as a surprise for my girlfriend's graduation. She was thrilled! Great quality, though I wish there were more chain length options available.`
           : `This pendant has become my go-to piece for special occasions. The weight feels substantial and the finish is flawless. Highly recommend this company!`
];

const fourStarReviews = [
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Nice pendant with good build quality. The ${color} color was a bit more muted than shown in photos, but still attractive. Good value for money.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `Decent quality piece that makes a nice gift. The engraving could be slightly deeper for better visibility, but overall satisfied with the purchase.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    isMale ? `Got this for my sister and she likes it. The quality is solid though not quite as premium as I expected. Good option for the price range.`
           : `Pretty pendant that I enjoy wearing. Took about 10 days to arrive, but the quality is good and the "${customText}" came out nicely. Would consider ordering again.`,
  
  (productName: string, customText: string, color: string, isMale: boolean) => 
    `The ${productName} is well-constructed and looks nice. It feels a bit lighter than I anticipated, but the craftsmanship is still good. Happy with my purchase overall.`
];

// Track used reviews to ensure uniqueness
const usedReviews = new Set<string>();

const getUniqueReviewContent = (rating: number, productName: string, customText: string, color: string, isMale: boolean): string => {
  let availableReviews: Array<(productName: string, customText: string, color: string, isMale: boolean) => string>;
  
  if (rating === 5) {
    availableReviews = fiveStarReviews;
  } else if (rating === 4.5) {
    availableReviews = fourHalfStarReviews;
  } else {
    availableReviews = fourStarReviews;
  }
  
  // Find an unused review template
  let attempts = 0;
  let selectedReview: string;
  
  do {
    const randomIndex = Math.floor(Math.random() * availableReviews.length);
    selectedReview = availableReviews[randomIndex](productName, customText, color, isMale);
    attempts++;
  } while (usedReviews.has(selectedReview) && attempts < 50);
  
  usedReviews.add(selectedReview);
  return selectedReview;
};

const getRandomRating = () => {
  const rand = Math.random();
  if (rand < 0.8) return 5; // 80% are 5 stars
  if (rand < 0.95) return 4.5; // 15% are 4.5 stars
  return 4; // 5% are 4 stars
};

const getRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString();
};

// Helper function to select diverse names
const getRandomReviewer = (): { name: string, isMale: boolean } => {
  const isMale = Math.random() < 0.3; // 30% male, 70% female
  const namePool = isMale ? maleNames : femaleNames;
  
  // Distribution: 50% American, 20% Arab, 20% European, 10% Australian
  const rand = Math.random();
  let region: 'american' | 'arab' | 'european' | 'australian';
  
  if (rand < 0.5) region = 'american';
  else if (rand < 0.7) region = 'arab';
  else if (rand < 0.9) region = 'european';
  else region = 'australian';
  
  const names = namePool[region];
  const randomName = names[Math.floor(Math.random() * names.length)];
  
  return { name: randomName, isMale };
};

// Helper function to get profile image or initials
const getReviewerImage = (name: string, isMale: boolean): string => {
  const hasProfilePicture = Math.random() > 0.4; // 60% have pictures, 40% use initials
  
  if (!hasProfilePicture) {
    return generateInitialsAvatar(name);
  }
  
  const images = isMale ? maleImages : femaleImages;
  return images[Math.floor(Math.random() * images.length)];
};

const generateReviewsForProduct = (productId: string, productName: string): Review[] => {
  const reviewCount = Math.floor(Math.random() * 7) + 10; // 10-16 reviews
  const reviews: Review[] = [];
  const usedNames = new Set<string>(); // Ensure no duplicate names per product
  
  for (let i = 0; i < reviewCount; i++) {
    const rating = getRandomRating();
    const customText = Math.random() > 0.3 ? customTexts[Math.floor(Math.random() * customTexts.length)] : 'Custom';
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Get unique reviewer for this product
    let reviewer: { name: string, isMale: boolean };
    let attempts = 0;
    do {
      reviewer = getRandomReviewer();
      attempts++;
    } while (usedNames.has(reviewer.name) && attempts < 50);
    
    usedNames.add(reviewer.name);
    
    reviews.push({
      id: generateReviewId(),
      user_id: generateReviewId(),
      userName: reviewer.name,
      userImage: getReviewerImage(reviewer.name, reviewer.isMale),
      rating,
      comment: getUniqueReviewContent(rating, productName, customText, color, reviewer.isMale),
      images: [],
      verified: Math.random() > 0.2, // 80% verified purchases
      helpful: Math.floor(Math.random() * 15),
      not_helpful: Math.floor(Math.random() * 3),
      created_at: getRandomDate(),
      customText,
      color
    });
  }
  
  return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Clear used reviews for fresh generation
usedReviews.clear();

// Generate reviews for all products with diverse, unique content
export const productReviews: Record<string, Review[]> = {
  'd3484f2c-4bea-49f8-9b59-c8cd38131042': generateReviewsForProduct('d3484f2c-4bea-49f8-9b59-c8cd38131042', 'Aria Name Pendant'),
  '04567b3e-e294-4763-9e9a-a40e414bf361': generateReviewsForProduct('04567b3e-e294-4763-9e9a-a40e414bf361', 'Habibi Arabic Name Pendant'),
  '3c3f0913-6944-4841-b078-d70d7c097f97': generateReviewsForProduct('3c3f0913-6944-4841-b078-d70d7c097f97', 'Yasmeen Arabic Name Pendant'),
  'c06ce985-be8d-4470-a286-8049bc2b9387': generateReviewsForProduct('c06ce985-be8d-4470-a286-8049bc2b9387', 'Zara Name Pendant'),
  'f5d9e406-8a82-4dd7-a533-6397d596f3eb': generateReviewsForProduct('f5d9e406-8a82-4dd7-a533-6397d596f3eb', 'Ariana Name Pendant'),
  'ab2ab166-1e73-49bf-808b-87895d97061d': generateReviewsForProduct('ab2ab166-1e73-49bf-808b-87895d97061d', 'Layla Name Pendant'),
  'fc10fa58-efde-43b2-9cb7-21a5ba65a568': generateReviewsForProduct('fc10fa58-efde-43b2-9cb7-21a5ba65a568', 'Milaa Name Pendant'),
  '7a4c9737-ea73-49a1-aa57-81eadc986c7e': generateReviewsForProduct('7a4c9737-ea73-49a1-aa57-81eadc986c7e', 'Olivia Name Pendant'),
  'ca18cf82-aac7-48e8-972e-a127741d59af': generateReviewsForProduct('ca18cf82-aac7-48e8-972e-a127741d59af', 'Isabella Name Pendant'),
  '2d3d08ad-9532-4fe7-82e8-89159dfd41f1': generateReviewsForProduct('2d3d08ad-9532-4fe7-82e8-89159dfd41f1', 'Sophia Name Pendant')
};

// Get all reviews from all products for homepage display
export const getAllReviews = (): Review[] => {
  const allReviews: Review[] = [];
  Object.values(productReviews).forEach(reviews => {
    allReviews.push(...reviews);
  });
  return allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Get random selection of reviews for homepage
export const getHomepageReviews = (count: number = 12): Review[] => {
  const allReviews = getAllReviews();
  const shuffled = allReviews.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Calculate average rating for a product
export const calculateAverageRating = (productId: string): number => {
  const reviews = productReviews[productId] || [];
  if (reviews.length === 0) return 5;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};

// Get review count for a product
export const getReviewCount = (productId: string): number => {
  return productReviews[productId]?.length || 0;
};