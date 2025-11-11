/**
 * PRODUCTS DATA STRUCTURE DOCUMENTATION
 * 
 * This file explains the structure of products.json used by the plant nursery API.
 * In a real application, this data would typically come from a database.
 * 
 * PRODUCT OBJECT STRUCTURE:
 * Each product in the JSON array has the following properties:
 * 
 * @property {number} id - Unique identifier for the product
 * @property {string} name - Product name/title
 * @property {string} category - Product category (indoor, outdoor, flowering, succulent)
 * @property {number} price - Current price in USD
 * @property {number|null} originalPrice - Original price before discount (null if no discount)
 * @property {number} discount - Discount percentage (0 if no discount)
 * @property {number} rating - Customer rating out of 5 stars
 * @property {number} reviews - Number of customer reviews
 * @property {string} image - Product image URL (empty for now, can be added later)
 * @property {string} description - Detailed product description
 * @property {string} size - Plant size category (small, medium, large)
 * @property {string} care - Care level required (easy, moderate, expert)
 * @property {boolean} inStock - Whether the product is currently in stock
 * @property {string} badge - Special badge to display (popular, new, sale, etc.)
 * @property {object} details - Additional product details object
 * 
 * DETAILS OBJECT STRUCTURE:
 * The details object contains specific care and growing information:
 * 
 * @property {string} lightRequirement - Light conditions needed
 * @property {string} wateringFrequency - How often to water
 * @property {string} humidity - Humidity requirements
 * @property {string} toxicity - Pet safety information
 * @property {string} origin - Geographic origin of the plant
 * @property {string} adultSize - Expected mature size
 * 
 * CATEGORIES:
 * - indoor: Houseplants suitable for indoor growing
 * - outdoor: Plants best suited for outdoor/garden growing
 * - flowering: Plants that produce flowers
 * - succulent: Low-water plants with thick, fleshy leaves
 * 
 * CARE LEVELS:
 * - easy: Beginner-friendly, low maintenance
 * - moderate: Some experience helpful, moderate care required
 * - expert: High maintenance, requires plant care knowledge
 * 
 * BADGES:
 * Special tags to highlight product features:
 * - popular: Best-selling items
 * - new: Recently added products
 * - sale: Items on discount
 * - beginner-friendly: Perfect for new plant parents
 * - air-purifier: Plants that clean indoor air
 * - medicinal: Plants with health benefits
 * - exotic: Rare or unusual varieties
 * - propagation-friendly: Easy to propagate/multiply
 * - lucky: Plants associated with good fortune
 * - fragrant: Plants with pleasant scents
 * - trailing: Hanging or climbing plants
 * - low-maintenance: Requires minimal care
 * - variety-pack: Multiple plants in one purchase
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Filter by category:
 *    products.filter(product => product.category === 'indoor')
 * 
 * 2. Find products on sale:
 *    products.filter(product => product.discount > 0)
 * 
 * 3. Get easy-care plants:
 *    products.filter(product => product.care === 'easy')
 * 
 * 4. Find in-stock items under $30:
 *    products.filter(product => product.inStock && product.price < 30)
 * 
 * 5. Sort by rating:
 *    products.sort((a, b) => b.rating - a.rating)
 * 
 * 6. Get pet-safe plants:
 *    products.filter(product => product.details.toxicity.includes('Non-toxic'))
 */

// This file serves as documentation only and is not used by the application.
// The actual data is stored in products.json as a clean JSON array.