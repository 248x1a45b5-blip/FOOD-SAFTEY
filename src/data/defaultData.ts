import { FoodItem, HygieneItem, SafetyTip, PathogenInfo, SafeCookingTemp, UserProfile } from '../types/foodSafe';

// Helper to create dates relative to today
const getRelativeDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'item-1',
    name: 'Fresh Whole Milk',
    category: 'dairy',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-4),
    expiryDate: getRelativeDate(1), // Expiring tomorrow
    quantity: '1 Liter',
    notes: 'Keep on back shelf, never inside door pocket where temperature fluctuates.',
    idealTempMinC: 1,
    idealTempMaxC: 4,
    riskLevel: 'medium',
    handlingTip: 'Discard immediately if sour aroma, curdling, or yellow discoloration occurs.'
  },
  {
    id: 'item-2',
    name: 'Raw Chicken Breasts',
    category: 'poultry',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-1),
    expiryDate: getRelativeDate(1), // Expiring tomorrow
    quantity: '600 grams',
    notes: 'Stored on bottom shelf in a sealed container to avoid raw drips.',
    idealTempMinC: 0,
    idealTempMaxC: 4,
    riskLevel: 'high',
    handlingTip: 'Must reach internal temperature of 74°C (165°F). Never wash raw poultry!'
  },
  {
    id: 'item-3',
    name: 'Atlantic Salmon Fillets',
    category: 'seafood',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-2),
    expiryDate: getRelativeDate(-1), // Already expired!
    quantity: '2 fillets (400g)',
    notes: 'Should have been cooked within 2 days of purchase.',
    idealTempMinC: 0,
    idealTempMaxC: 2,
    riskLevel: 'high',
    handlingTip: 'High risk of Scombroid or Listeria if stored beyond 2 days refrigerated.'
  },
  {
    id: 'item-4',
    name: 'Greek Yogurt (Plain)',
    category: 'dairy',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-5),
    expiryDate: getRelativeDate(8), // Fresh
    quantity: '500g tub',
    notes: 'Unopened foil seal intact. Keep chilled.',
    idealTempMinC: 2,
    idealTempMaxC: 4,
    riskLevel: 'low',
    handlingTip: 'Once opened, consume within 7 days using a clean spoon every time.'
  },
  {
    id: 'item-5',
    name: 'Leftover Beef Bolognese',
    category: 'leftovers',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-2),
    expiryDate: getRelativeDate(2), // Expiring soon
    quantity: '1 airtight container',
    notes: 'Cooled within 90 minutes of cooking before refrigeration.',
    idealTempMinC: 1,
    idealTempMaxC: 4,
    riskLevel: 'medium',
    handlingTip: 'Reheat thoroughly until steaming hot throughout (min 74°C / 165°F).'
  },
  {
    id: 'item-6',
    name: 'Organic Baby Spinach',
    category: 'produce',
    storageLocation: 'fridge',
    purchaseDate: getRelativeDate(-3),
    expiryDate: getRelativeDate(3),
    quantity: '250g bag',
    notes: 'Crisper drawer with medium humidity.',
    idealTempMinC: 1,
    idealTempMaxC: 4,
    riskLevel: 'low',
    handlingTip: 'Wash thoroughly under running cold potable water prior to eating raw.'
  },
  {
    id: 'item-7',
    name: 'Sourdough Artisan Bread',
    category: 'bakery',
    storageLocation: 'pantry',
    purchaseDate: getRelativeDate(-2),
    expiryDate: getRelativeDate(4),
    quantity: '1 loaf',
    notes: 'Stored in paper bread bag in a cool, dry pantry cupboard.',
    idealTempMinC: 15,
    idealTempMaxC: 22,
    riskLevel: 'low',
    handlingTip: 'Do not refrigerate bread as it accelerates retrogradation (staling).'
  },
  {
    id: 'item-8',
    name: 'Ground Turkey Meat',
    category: 'poultry',
    storageLocation: 'freezer',
    purchaseDate: getRelativeDate(-14),
    expiryDate: getRelativeDate(75),
    quantity: '500g vacuum sealed',
    notes: 'Frozen solid on day of purchase.',
    idealTempMinC: -24,
    idealTempMaxC: -18,
    riskLevel: 'low',
    handlingTip: 'Thaw safely inside refrigerator overnight. Never thaw on ambient kitchen counters.'
  }
];

export const INITIAL_HYGIENE_ITEMS: HygieneItem[] = [
  // Handwashing
  {
    id: 'hyg-1',
    category: 'handwashing',
    title: '20-Second Soap & Warm Water Wash',
    description: 'Scrub palms, backs of hands, between fingers, and under fingernails before meal prep.',
    completed: true,
    frequency: 'each_meal'
  },
  {
    id: 'hyg-2',
    category: 'handwashing',
    title: 'Post-Raw Meat Sanitation',
    description: 'Thoroughly wash hands immediately after touching raw poultry, seafood, or red meat.',
    completed: false,
    frequency: 'each_meal'
  },
  {
    id: 'hyg-3',
    category: 'handwashing',
    title: 'Clean Single-Use Towels',
    description: 'Dry hands with disposable paper towels or a freshly laundered hand towel (not the apron).',
    completed: true,
    frequency: 'daily'
  },

  // Kitchen Cleanliness
  {
    id: 'hyg-4',
    category: 'kitchen',
    title: 'Food-Safe Countertop Disinfection',
    description: 'Spray and wipe food prep stations with an EPA-registered food contact surface sanitizer.',
    completed: true,
    frequency: 'daily'
  },
  {
    id: 'hyg-5',
    category: 'kitchen',
    title: 'Separate Chopping Boards for Meats & Veggies',
    description: 'Use color-coded cutting boards: red for raw meat, green for produce to stop cross-contamination.',
    completed: false,
    frequency: 'each_meal'
  },
  {
    id: 'hyg-6',
    category: 'kitchen',
    title: 'Dish Sponge Disinfection or Replacement',
    description: 'Microwave damp sponge for 1 minute or replace weekly; kitchen sponges harbor billions of microbes.',
    completed: false,
    frequency: 'weekly'
  },
  {
    id: 'hyg-7',
    category: 'kitchen',
    title: 'Kitchen Waste Bin Sealed & Cleared',
    description: 'Ensure food scrap bin is sealed and emptied before nightfall to prevent pest attraction.',
    completed: true,
    frequency: 'daily'
  },

  // Food Storage
  {
    id: 'hyg-8',
    category: 'storage',
    title: 'Raw Meat on Lowest Fridge Shelf',
    description: 'Store raw poultry and meats strictly on the bottom shelf in drip-proof containers.',
    completed: true,
    frequency: 'daily'
  },
  {
    id: 'hyg-9',
    category: 'storage',
    title: 'Refrigerator Thermometer Verification (1°C–4°C)',
    description: 'Verify fridge stays strictly under 4°C (40°F) and freezer at or below -18°C (0°F).',
    completed: false,
    frequency: 'daily'
  },
  {
    id: 'hyg-10',
    category: 'storage',
    title: 'First In, First Out (FIFO) Inventory Rotation',
    description: 'Move older items to the front of shelves and place newly purchased items behind.',
    completed: false,
    frequency: 'weekly'
  },
  {
    id: 'hyg-11',
    category: 'storage',
    title: 'Airtight Sealing & Open Date Labeling',
    description: 'Transfer opened canned goods to glass/plastic containers and label with date opened.',
    completed: true,
    frequency: 'daily'
  },

  // Safe Cooking
  {
    id: 'hyg-12',
    category: 'cooking',
    title: 'Digital Probe Food Thermometer Verification',
    description: 'Probe thickest part of meat; poultry to 74°C (165°F), minced beef to 71°C (160°F).',
    completed: false,
    frequency: 'each_meal'
  },
  {
    id: 'hyg-13',
    category: 'cooking',
    title: 'Two-Hour Temperature Rule for Leftovers',
    description: 'Refrigerate cooked meals within 2 hours of cooking (or 1 hour if room temp > 32°C / 90°F).',
    completed: true,
    frequency: 'daily'
  },
  {
    id: 'hyg-14',
    category: 'cooking',
    title: 'Leftovers Reheated to Rolling Steaming 74°C',
    description: 'Always bring leftover soups and gravies to a rolling boil before serving.',
    completed: false,
    frequency: 'each_meal'
  }
];

export const PATHOGENS_DATA: PathogenInfo[] = [
  {
    id: 'path-1',
    name: 'Salmonella enterica',
    type: 'Bacteria',
    commonFoods: ['Raw poultry & eggs', 'Unpasteurized milk & juice', 'Raw sprouts', 'Contaminated melon/produce'],
    onsetDuration: '6 hours to 6 days',
    symptoms: ['Diarrhea (often bloody)', 'Abdominal cramps', 'High fever (38-39°C)', 'Nausea & vomiting'],
    prevention: [
      'Cook poultry to minimum 74°C (165°F) internal temperature',
      'Keep raw meats physically separated from ready-to-eat foods',
      'Wash cutting boards and knives with hot soapy water after raw poultry',
      'Never consume unpasteurized raw milk or raw eggs'
    ],
    dangerTempRange: '4°C to 60°C (multiplies fastest at 37°C)',
    severity: 'Severe'
  },
  {
    id: 'path-2',
    name: 'Escherichia coli (STEC / O157:H7)',
    type: 'Bacteria',
    commonFoods: ['Undercooked ground beef', 'Raw leafy greens & lettuce', 'Unpasteurized cider', 'Untreated water'],
    onsetDuration: '3 to 4 days (can range 1-10 days)',
    symptoms: ['Severe stomach cramps', 'Watery then bloody diarrhea', 'Vomiting', 'Risk of Hemolytic Uremic Syndrome (HUS)'],
    prevention: [
      'Cook ground beef thoroughly to 71°C (160°F) – color is not a safe indicator',
      'Wash all raw vegetables vigorously under clean running water',
      'Avoid unpasteurized juices, milk, and ciders',
      'Prevent cross-contact between raw meat platters and cooked burgers'
    ],
    dangerTempRange: '7°C to 50°C',
    severity: 'Critical'
  },
  {
    id: 'path-3',
    name: 'Listeria monocytogenes',
    type: 'Bacteria',
    commonFoods: ['Deli cold cuts', 'Soft unpasteurized cheeses (Brie, Feta)', 'Smoked fish', 'Hot dogs', 'Pre-made salads'],
    onsetDuration: '1 to 70 days (average 2-3 weeks)',
    symptoms: ['Fever', 'Muscle aches', 'Stiff neck', 'Loss of balance', 'Miscarriage & stillbirth in pregnancy'],
    prevention: [
      'Unique danger: Grows even inside cold refrigerators below 4°C!',
      'Reheat deli meats and hot dogs until steaming hot (74°C)',
      'Pregnant women should avoid soft unpasteurized cheeses',
      'Consume opened deli packages within 3 to 5 days max'
    ],
    dangerTempRange: '-0.4°C to 45°C (Psychrotrophic: survives freezing and fridge)',
    severity: 'Critical'
  },
  {
    id: 'path-4',
    name: 'Norovirus',
    type: 'Virus',
    commonFoods: ['Raw oysters & shellfish', 'Ready-to-eat foods handled by infected individuals', 'Salad greens'],
    onsetDuration: '12 to 48 hours',
    symptoms: ['Acute projectile vomiting', 'Watery diarrhea', 'Abdominal pain', 'Low-grade fever', 'Dehydration'],
    prevention: [
      'Wash hands vigorously with soap for 20+ seconds (alcohol sanitizers are ineffective against Norovirus)',
      'Cook shellfish to 63°C (145°F)',
      'Do not prepare food for others while sick and for 48 hours after symptoms cease',
      'Bleach-sanitize kitchen surfaces contaminated by vomiting'
    ],
    dangerTempRange: 'Survives freezing and temperatures up to 60°C',
    severity: 'Moderate'
  },
  {
    id: 'path-5',
    name: 'Campylobacter jejuni',
    type: 'Bacteria',
    commonFoods: ['Raw and undercooked poultry', 'Unpasteurized milk', 'Untreated contaminated water'],
    onsetDuration: '2 to 5 days',
    symptoms: ['Diarrhea (frequently bloody)', 'Severe cramping mimicking appendicitis', 'Fever', 'Headache'],
    prevention: [
      'Never wash raw chicken under the tap – aerosolized droplets travel up to 1 meter!',
      'Cook all chicken and turkey to 74°C (165°F)',
      'Use dedicated cutting boards for poultry',
      'Wash hands immediately with antibacterial soap after handling bird carcasses'
    ],
    dangerTempRange: '30°C to 45°C (Sensitive to freezing and drying)',
    severity: 'Severe'
  },
  {
    id: 'path-6',
    name: 'Clostridium perfringens',
    type: 'Bacteria',
    commonFoods: ['Large roasts of beef/poultry', 'Casseroles and stews', 'Gravies left in warming trays'],
    onsetDuration: '6 to 24 hours',
    symptoms: ['Intense abdominal cramps', 'Watery diarrhea without fever or vomiting'],
    prevention: [
      'Refrigerate large meat dishes in shallow containers within 2 hours',
      'Do not leave buffet trays warm for more than 2 hours at < 60°C',
      'Reheat leftovers to at least 74°C (165°F) throughout'
    ],
    dangerTempRange: '10°C to 54°C (Spore former that multiplies rapidly in cooling meat)',
    severity: 'Moderate'
  }
];

export const SAFE_COOKING_TEMPS: SafeCookingTemp[] = [
  {
    food: 'Whole Poultry (Chicken, Turkey, Duck)',
    minTempC: 74,
    minTempF: 165,
    restTime: 'No rest time required',
    dangerNote: 'Must probe the innermost part of thigh, wing, and thickest part of breast.'
  },
  {
    food: 'Ground Meats (Beef, Pork, Lamb, Veal)',
    minTempC: 71,
    minTempF: 160,
    restTime: 'No rest time required',
    dangerNote: 'Surface bacteria are mixed throughout the interior during grinding.'
  },
  {
    food: 'Whole Cuts of Beef, Pork, Lamb, Veal (Steaks, Chops)',
    minTempC: 63,
    minTempF: 145,
    restTime: '3-minute rest time mandatory',
    dangerNote: 'Resting allows residual heat to destroy lingering surface microbes.'
  },
  {
    food: 'Fresh Fish & Shellfish',
    minTempC: 63,
    minTempF: 145,
    restTime: 'Until flesh is opaque and flakes with fork',
    dangerNote: 'Shrimp, lobster, and crab turn opaque and firm; clams and mussels open.'
  },
  {
    food: 'Egg Dishes & Casseroles',
    minTempC: 71,
    minTempF: 160,
    restTime: 'Firm whites and yolks',
    dangerNote: 'Undercooked runny egg dishes carry high risk of Salmonella.'
  },
  {
    food: 'Leftovers & Reheated Foods',
    minTempC: 74,
    minTempF: 165,
    restTime: 'Steaming hot throughout',
    dangerNote: 'Stir microwave food midway through cooking to prevent cold spots.'
  }
];

export const FOOD_SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'tip-1',
    title: 'The Danger Zone: 4°C to 60°C (40°F–140°F)',
    summary: 'Bacteria multiply fastest in this temperature window. Never leave perishable food in the Danger Zone for more than 2 hours.',
    fullContent: 'Between 4°C and 60°C, harmful microorganisms can double every 20 minutes! Keep cold foods below 4°C (in a calibrated refrigerator) and hot foods above 60°C (in chafing dishes or slow cookers). If food sits at room temperature for over 2 hours (or 1 hour on a hot summer day > 32°C), discard it without tasting.',
    category: 'storage',
    recommendedTemp: 'Keep Cold < 4°C | Keep Hot > 60°C',
    iconName: 'Thermometer'
  },
  {
    id: 'tip-2',
    title: 'Never Wash Raw Chicken or Poultry',
    summary: 'Washing raw poultry splatters bacteria over a 3-foot radius onto countertops, sinks, and clean utensils.',
    fullContent: 'According to food safety scientists and the CDC, washing raw chicken with water does not destroy bacteria. Instead, pressurized water splashing off the carcass aerosolizes Campylobacter and Salmonella, spreading pathogens onto clean dishware, dishcloths, and neighboring ingredients. Cooking to 74°C (165°F) is the ONLY scientifically proven method to eliminate bacteria.',
    category: 'handling',
    iconName: 'Droplet'
  },
  {
    id: 'tip-3',
    title: 'The Refrigerator Shelf Hierarchy',
    summary: 'Organize your fridge from top to bottom based on the minimum cooking temperature of foods.',
    fullContent: 'Store items logically to prevent gravity-assisted cross-contamination:\n• Top Shelf: Ready-to-eat foods, yogurts, leftovers, cooked items.\n• Middle Shelf: Dairy products, raw whole fish (63°C cooking temp).\n• Lower Middle: Raw whole pork and beef steaks (63°C).\n• Second to Bottom: Raw ground beef and pork (71°C).\n• Bottom Shelf: Raw chicken and turkey (74°C) inside sealed trays to catch drips.',
    category: 'storage',
    iconName: 'Layers'
  },
  {
    id: 'tip-4',
    title: 'The 2-Hour / 4-Hour Rule for Leftovers',
    summary: 'Divide large pots into shallow containers so food cools rapidly below 4°C within the safe window.',
    fullContent: 'Placing a giant 5-liter pot of hot chili straight into the fridge creates a warm microclimate where the center can take 12+ hours to cool, allowing Clostridium perfringens spores to germinate! Always divide hot stews into shallow containers (less than 5 cm / 2 inches deep) before placing them in the refrigerator.',
    category: 'poisoning_prevention',
    iconName: 'Clock'
  },
  {
    id: 'tip-5',
    title: 'Thaw Safely: Three Certified Methods',
    summary: 'Never thaw meat on the kitchen counter or in warm water.',
    fullContent: 'The three approved safe thawing methods:\n1. In the Refrigerator: Plan ahead! 24 hours per 2.5 kg of meat.\n2. In Cold Water: Submerge meat in leakproof plastic bag; change cold tap water every 30 minutes.\n3. In Microwave: Only if cooking immediately afterward, as microwave thawing creates warm spots.',
    category: 'handling',
    iconName: 'ShieldCheck'
  }
];

export const PRESET_FOOD_ITEMS = [
  { name: 'Fresh Milk', category: 'dairy', defaultLocation: 'fridge', shelfLifeDays: 7, idealTemp: '1°C–4°C', risk: 'medium' },
  { name: 'Raw Chicken Breast', category: 'poultry', defaultLocation: 'fridge', shelfLifeDays: 2, idealTemp: '0°C–4°C', risk: 'high' },
  { name: 'Eggs (Carton)', category: 'dairy', defaultLocation: 'fridge', shelfLifeDays: 28, idealTemp: '1°C–4°C', risk: 'medium' },
  { name: 'Ground Beef', category: 'meat', defaultLocation: 'fridge', shelfLifeDays: 2, idealTemp: '0°C–4°C', risk: 'high' },
  { name: 'Fresh Salmon Fillet', category: 'seafood', defaultLocation: 'fridge', shelfLifeDays: 2, idealTemp: '0°C–2°C', risk: 'high' },
  { name: 'Cooked Rice / Pasta', category: 'leftovers', defaultLocation: 'fridge', shelfLifeDays: 4, idealTemp: '1°C–4°C', risk: 'high' },
  { name: 'Raw Spinach / Salad', category: 'produce', defaultLocation: 'fridge', shelfLifeDays: 6, idealTemp: '1°C–4°C', risk: 'low' },
  { name: 'Cheddar Cheese', category: 'dairy', defaultLocation: 'fridge', shelfLifeDays: 21, idealTemp: '2°C–5°C', risk: 'low' },
  { name: 'Yogurt Tub', category: 'dairy', defaultLocation: 'fridge', shelfLifeDays: 14, idealTemp: '1°C–4°C', risk: 'low' },
  { name: 'Apples / Citrus', category: 'produce', defaultLocation: 'pantry', shelfLifeDays: 14, idealTemp: '15°C–20°C', risk: 'low' },
  { name: 'Bread Loaf', category: 'bakery', defaultLocation: 'pantry', shelfLifeDays: 5, idealTemp: '18°C–22°C', risk: 'low' },
  { name: 'Canned Tomatoes', category: 'canned', defaultLocation: 'pantry', shelfLifeDays: 365, idealTemp: '10°C–25°C', risk: 'low' }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.foodsafe@gmail.com',
  householdType: 'family_with_kids',
  isLoggedIn: true,
  notificationDaysBefore: 2,
  enableExpiryPush: true,
  enableHygieneReminder: true,
  dietaryNotes: 'Strict allergen separation (Nut allergy & sensitivity to raw seafood)',
  safetyScore: 92,
  teamMembers: [
    {
      id: 'tm-1',
      name: 'Karthik Juvva',
      role: 'Project Lead & Flutter Architect',
      studentId: '21CS042',
      email: 'karthikjuvva02@gmail.com',
      contribution: 'App architecture, MultiProvider state management, SQLite integration & navigation routing.',
      avatarColor: 'bg-emerald-600'
    },
    {
      id: 'tm-2',
      name: 'Priya Sharma',
      role: 'UI/UX & Mobile Ergonomics Lead',
      studentId: '21CS058',
      email: 'priya.sharma@college.edu',
      contribution: 'Material 3 green & white design system, responsive touch targets, and Food Card components.',
      avatarColor: 'bg-teal-600'
    },
    {
      id: 'tm-3',
      name: 'Rahul Varma',
      role: 'Database & Storage Engineer',
      studentId: '21CS089',
      email: 'rahul.varma@college.edu',
      contribution: 'sqflite local database helper, schema migrations, and SharedPreferences persistence.',
      avatarColor: 'bg-indigo-600'
    },
    {
      id: 'tm-4',
      name: 'Ananya Patel',
      role: 'Food Safety Specialist & QA',
      studentId: '21CS015',
      email: 'ananya.patel@college.edu',
      contribution: 'WHO & USDA pathogen database curation, danger zone algorithmic calculations, and widget unit tests.',
      avatarColor: 'bg-amber-600'
    }
  ]
};
