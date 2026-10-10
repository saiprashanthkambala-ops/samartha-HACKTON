/**
 * FarmShield crop catalogue — single source of truth for crop data.
 *
 * Every page (Home gallery, Crops, Crop Details, Market Prices, Weather impact)
 * reads crop identity from this catalogue. Do not duplicate crop info elsewhere.
 *
 * IMPORTANT (data accuracy): the agronomic values below are general reference
 * values for layout/demo purposes. They must be verified against the FarmShield
 * backend data source before being presented as production guidance. `null`
 * values render as "Not available" — never as zero or a made-up figure.
 */

export const CROP_CATEGORIES = {
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
  FIELD: 'field',
};

const stage = (id, name, nameTe, duration) => ({ id, name, nameTe, duration });

const supplementalRows = [["papaya","Papaya","బొప్పాయి","fruit","https://2.wlimg.com/product_images/bc-full/2024/8/3850032/papaya-1724934107-7582819.jpeg","papita, pawpaw","tropical"],["pineapple","Pineapple","అనాస","fruit","https://freshcoindia.net/wp-content/uploads/2024/08/pineapple01.jpg","ananas","tropical"],["sapota","Sapota (Chikoo)","సపోటా","fruit","https://freshcoindia.net/wp-content/uploads/2024/08/chickoo01.jpg","chikoo, sapodilla","tropical"],["litchi","Litchi","లిచ్చి","fruit","https://im.pluckk.in/unsafe/1200x0/uploads/39357-1200-sku-image-82.png","lychee","subtropical"],["jackfruit","Jackfruit","పనస","fruit","https://healthybuddha.in/image/cache/catalog/jackfruit-500x515.jpg","kathal, panasa","tropical"],["sweet-lime","Sweet Lime (Mosambi)","బత్తాయి","fruit","https://freshcoindia.net/wp-content/uploads/2024/09/sweet-lime01.jpg","mosambi","citrus"],["lemon","Lemon","నిమ్మకాయ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Lemon.jpg?width=900","nimbu","citrus"],["acid-lime","Acid Lime","నిమ్మ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Lime_(fruit).jpg?width=900","kagzi lime, nimma","citrus"],["mandarin-orange","Mandarin Orange","నారింజ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Citrus_reticulata_fruits.jpg?width=900","santra, kinnow","citrus"],["watermelon","Watermelon","పుచ్చకాయ","fruit","https://freshcoindia.net/wp-content/uploads/2024/09/watermelon02a-min.jpg","tarbooj, puchakaya","summer"],["muskmelon","Muskmelon","ఖర్బూజ","fruit","https://freshcoindia.net/wp-content/uploads/2024/08/muskmelon01.jpg","kharbuja, kharbooja","summer"],["indian-gooseberry","Indian Gooseberry (Amla)","ఉసిరికాయ","fruit","https://images.squarespace-cdn.com/content/v1/58ffea652994caf8893481e5/1621531627184-J3A9EYB61Q4MPOK9A4PK/Gooseberry.jpeg","amla, aonla","dryland"],["ber","Indian Jujube (Ber)","రేగు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Ziziphus_mauritiana_fruits.jpg?width=900","regu, bor","dryland"],["custard-apple","Custard Apple (Sitaphal)","సీతాఫలం","fruit","https://cdn.grofers.com/cdn-cgi/image/f%3Dauto%2Cfit%3Dscale-down%2Cq%3D70%2Cmetadata%3Dnone%2Cw%3D1080/da/cms-assets/cms/product/15c27214-159e-43c4-937d-27c0126fd740.png","sitaphal, seethaphalam","dryland"],["jamun","Jamun","నేరేడు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Syzygium_cumini_fruits.jpg?width=900","neredu, black plum","tropical"],["fig","Fig (Anjeer)","అత్తి పండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Ficus_carica_fruits.jpg?width=900","anjeer, atthi","dryland"],["dragon-fruit","Dragon Fruit","డ్రాగన్ ఫ్రూట్","fruit","https://freshcoindia.net/wp-content/uploads/2024/08/dragon-fruit01.jpg","pitaya, kamalam","specialty"],["coconut","Coconut","కొబ్బరి","fruit","https://cpimg.tistatic.com/01373121/b/4/Fresh-Coconuts.jpg","nariyal, kobbari","coastal"],["avocado","Avocado (Butter Fruit)","అవకాడో","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Avocado.jpg?width=900","butter fruit","specialty"],["apricot","Apricot","ఖుబానీ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Apricot_fruits.jpg?width=900","khubani","temperate"],["peach","Peach","పీచ్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Peach_fruits.jpg?width=900","aadoo","temperate"],["plum","Plum","ఆలుబుఖారా","fruit","https://imagemo.fsn1.your-objectstorage.com/images/2024/04/22/preview_66260e4c32d401713770060.png","aloo bukhara","temperate"],["pear","Pear","నాష్‌పతి","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Pears.jpg?width=900","nashpati","temperate"],["strawberry","Strawberry","స్ట్రాబెర్రీ","fruit","https://s.alicdn.com/%40sc04/kf/Ad8d24affa2604bff8fa4ba6b27b42b69F/Fresh-strawberry-Wholesale-price-strawberry-fruit-best-quality.jpg","strawberry","specialty"],["kiwi","Kiwi Fruit","కివి","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Kiwifruit.jpg?width=900","kiwi","temperate"],["passion-fruit","Passion Fruit","ప్యాషన్ ఫ్రూట్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Passion_fruit.jpg?width=900","passionfruit","specialty"],["date-palm","Date Palm","ఖర్జూరం","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Dates_fruit.jpg?width=900","khajoor, dates","arid"],["tamarind","Tamarind","చింతపండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Tamarind_fruit.jpg?width=900","imli, chintapandu","dryland"],["grapefruit","Grapefruit","గ్రేప్‌ఫ్రూట్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Grapefruit.jpg?width=900","chakotra","citrus"],["pomelo","Pomelo","పాంపెల్మస్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Pomelo.jpg?width=900","pummelo","citrus"],["loquat","Loquat","లోకాట్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Loquat.jpg?width=900","lokat","subtropical"],["cherry","Cherry","చెర్రీ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Cherries.jpg?width=900","cherry","temperate"],["cashew-apple","Cashew Apple","జీడిపండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Cashew_apple.jpg?width=900","kaju phal","coastal"],["cape-gooseberry","Cape Gooseberry","రసభరి","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Physalis_peruviana_fruits.jpg?width=900","rasbhari","specialty"],["persimmon","Persimmon","పెర్సిమన్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Persimmons.jpg?width=900","japani phal","temperate"],["star-fruit","Star Fruit","కమ్రఖ్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Carambola.jpg?width=900","kamrakh, carambola","tropical"],["mulberry","Mulberry","షాహ్‌తూత్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Mulberries.jpg?width=900","shahtoot","regional"],["bael","Bael","మారేడు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Aegle_marmelos_fruits.jpg?width=900","bel, maredu","dryland"],["wood-apple","Wood Apple","వెలగ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Limonia_acidissima_fruit.jpg?width=900","kaitha, velaga","dryland"],["karonda","Karonda","కరొండ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Carissa_carandas_fruits.jpg?width=900","karonda","dryland"],["phalsa","Phalsa","ఫాల్సా","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Grewia_asia_tica_fruits.jpg?width=900","phalsa","dryland"],["lasoda","Lasoda","లసోడా","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Cordia_dichotoma_fruits.jpg?width=900","lasora, gonda","dryland"],["ker","Ker","కేర్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Capparis_decidua_fruits.jpg?width=900","kair","arid"],["pilu","Pilu","పిలు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Salvadora_persica_fruits.jpg?width=900","pilu","arid"],["manila-tamarind","Manila Tamarind","సీమ చింత","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Pithecellobium_dulce_fruit.jpg?width=900","jungle jalebi","tropical"],["bordi","Bordi","బోర్డి","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Ziziphus_nummularia_fruits.jpg?width=900","bordi","arid"],["jharber","Jhar Ber","ఝర్ బెర్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Ziziphus_nummularia_fruits.jpg?width=900","jhar ber","arid"],["khirni","Khirni","ఖిర్నీ","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Manilkara_hexandra_fruits.jpg?width=900","khirni","regional"],["chironji-fruit","Chironji Tree Fruit","చిరోంజి పండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Buchanania_lanzan_fruits.jpg?width=900","charoli tree fruit","regional"],["mahua-fruit","Mahua Fruit","మహువా పండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Madhuca_longifolia_fruits.jpg?width=900","mahua","regional"],["cactus-pear","Cactus Pear","నాగఫణి పండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Opuntia_ficus-indica_fruits.jpg?width=900","prickly pear","arid"],["rambutan","Rambutan","రంబుటాన్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Rambutan_fruits.jpg?width=900","rambutan","specialty"],["mangosteen","Mangosteen","మాంగోస్టీన్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Mangosteen.jpg?width=900","mangosteen","specialty"],["kokum","Kokum","కోకమ్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Garcinia_indica_fruits.jpg?width=900","kokum","coastal"],["soursop","Soursop","సోర్సాప్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Soursop.jpg?width=900","graviola","specialty"],["malayan-apple","Malayan Apple","మలయన్ ఆపిల్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Syzygium_malaccense_fruits.jpg?width=900","malay apple","tropical"],["rose-apple","Rose Apple","రోజ్ ఆపిల్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Syzygium_jambos_fruits.jpg?width=900","gulab jamun fruit","tropical"],["water-apple","Water Apple","వాటర్ ఆపిల్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Syzygium_aqueum_fruits.jpg?width=900","water apple","tropical"],["wax-apple","Wax Apple","వాక్స్ ఆపిల్","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Syzygium_samarangense_fruits.jpg?width=900","java apple","tropical"],["indian-almond-fruit","Indian Almond Tree Fruit","బాదం చెట్టు పండు","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Terminalia_catappa_fruit.jpg?width=900","tropical almond","coastal"],["elephant-apple","Elephant Apple","చల్తా","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Dillenia_indica_fruit.jpg?width=900","chalta","regional"],["bilimbi","Bilimbi","ఇరుంబన్ పులి","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Averrhoa_bilimbi_fruits.jpg?width=900","bilimbi","tropical"],["hog-plum","Hog Plum","అంబరెల్లా","fruit","https://commons.wikimedia.org/wiki/Special:FilePath/Spondias_mombin_fruits.jpg?width=900","amra","regional"],["pumpkin","Pumpkin","గుమ్మడికాయ","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Pumpkins.jpg?width=900","gummadikaya, kaddu","vegetable"],["bottle-gourd","Bottle Gourd","సొరకాయ","vegetable","https://organicmandya.com/cdn/shop/files/BottleGourd.jpg?v=1757077759&width=1200","lauki, sorakaya","vegetable"],["ridge-gourd","Ridge Gourd","బీరకాయ","vegetable","https://indiabazaar.pl/cdn/shop/products/turai.jpg?v=1680108534","turai, beerakaya","vegetable"],["snake-gourd","Snake Gourd","పొట్లకాయ","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Trichosanthes_cucumerina.jpg?width=900","potlakaya","vegetable"],["drumstick","Drumstick (Moringa Pods)","మునగకాయ","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Moringa_oleifera_pods.jpg?width=900","moringa pods, munagakaya","vegetable"],["spinach","Spinach","పాలకూర","vegetable","https://seedvanam.com/cdn/shop/files/Palak_1200x.jpg?v=1763810056","palak","leafy"],["amaranth-greens","Amaranth Greens","తోటకూర","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Amaranthus_tricolor.jpg?width=900","thotakura, chaulai","leafy"],["fenugreek-leaves","Fenugreek Leaves","మెంతికూర","vegetable","https://zingoxfoods.co.uk/cdn/shop/files/FenugreekLeaves.jpg?v=1770425536","methi, menthikoora","leafy"],["coriander-leaves","Coriander Leaves","కొత్తిమీర","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Coriander_leaves.jpg?width=900","cilantro, kothimeera","leafy"],["beetroot","Beetroot","బీట్‌రూట్","vegetable","https://plantet.pl/img/imagecache/4001-5000/768x768_product_media_4001-5000_burak_czerwona_kula_2_tasma_2-j.webp","beet","root"],["radish","Radish","ముల్లంగి","vegetable","https://uasemena.com.ua/image/cache/catalog/TOVAR/99999/970/4657_redis_18%20dnej_sedos126-700x700.png","mullangi, mooli","root"],["sweet-potato","Sweet Potato","చిలగడదుంప","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Sweet_potatoes.jpg?width=900","chilagada dumpa","root"],["green-peas","Green Peas","పచ్చి బఠాణీలు","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Green_peas.jpg?width=900","matar, batani","legume"],["french-beans","French Beans","ఫ్రెంచ్ బీన్స్","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Green_bean.jpg?width=900","green beans","legume"],["cluster-beans","Cluster Beans","గోరుచిక్కుడు","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Cluster_beans.jpg?width=900","guvar, goruchikkudu","legume"],["ash-gourd","Ash Gourd","బూడిద గుమ్మడికాయ","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Benincasa_hispida.jpg?width=900","winter melon, boodida gummadikaya","vegetable"],["ivy-gourd","Ivy Gourd","దొండకాయ","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Coccinia_grandis_fruits.jpg?width=900","dondakaya, kundru","vegetable"],["garlic","Garlic","వెల్లుల్లి","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Garlic.jpg?width=900","vellulli, lehsun","bulb"],["ginger","Ginger","అల్లం","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Ginger.jpg?width=900","allam, adrak","rhizome"],["turmeric","Turmeric","పసుపు","vegetable","https://commons.wikimedia.org/wiki/Special:FilePath/Turmeric.jpg?width=900","pasupu, haldi","rhizome"]];

function buildSupplementalCrop([id, name, nameTe, category, image, aliases, regionalType]) {
  const categoryValue = CROP_CATEGORIES[category.toUpperCase()];
  const context = category === 'fruit' ? 'fruit crop' : 'vegetable crop';
  const generalSeason = regionalType === 'tropical'
    ? 'Varies by state, variety and local monsoon pattern'
    : regionalType === 'citrus'
      ? 'Varies by citrus type, variety and growing region'
      : regionalType === 'temperate'
        ? 'Usually suited to cool or temperate growing regions; verify local suitability'
        : regionalType === 'arid' || regionalType === 'dryland'
          ? 'Often associated with dry or semi-arid systems; verify state-level recommendations'
          : 'Varies by state, cultivar and local climate';
  const harvest = 'Depends on cultivar and local conditions; confirm with the local horticulture department';
  return {
    id, name, nameTe, category: categoryValue, image, popular: false,
    description: `${name} is an Indian ${context} grown in suitable regions. Season, management and harvest timing vary with the cultivar, climate and local growing practices.`,
    descriptionTe: `${nameTe} భారతదేశంలోని అనుకూల ప్రాంతాల్లో పండించే పంట. పంట కాలం, నిర్వహణ మరియు కోత సమయం రకం, వాతావరణం, స్థానిక సాగు పద్ధతులపై ఆధారపడి మారుతాయి.`,
    quickFacts: {
      growingSeason: generalSeason, harvestTime: harvest, idealTemperature: null,
      idealHumidity: null,
      storageLife: 'Crop- and variety-specific; use verified local post-harvest guidance',
    },
    duration: 'Varies by cultivar and production system',
    growingGuidance: [
      'Confirm the recommended planting window and variety for your district before planting.',
      'Use healthy planting material and follow state agriculture or horticulture guidance for irrigation and crop protection.',
    ],
    storageTips: [
      { cat: 'handling', text: `Handle harvested ${name.toLowerCase()} gently and remove damaged produce before packing.`, textTe: 'కోత చేసిన పంటను జాగ్రత్తగా నిర్వహించి, ప్యాకింగ్‌కు ముందు దెబ్బతిన్న వాటిని వేరు చేయండి.' },
      { cat: 'ventilation', text: 'Choose clean, crop-appropriate packaging with suitable airflow; avoid sealing wet produce.', textTe: 'పంటకు సరిపోయే శుభ్రమైన ప్యాకింగ్, గాలి ప్రసరణ ఉండేలా చూసుకోండి; తడి పంటను మూసివేయవద్దు.' },
      { cat: 'moisture', text: 'Follow crop-specific temperature and moisture guidance instead of applying one storage rule to every crop.', textTe: 'ప్రతి పంటకు ఒకే నిల్వ నియమం కాకుండా, ఆ పంటకు సరిపోయే ఉష్ణోగ్రత మరియు తేమ సూచనలను పాటించండి.' },
      { cat: 'inspection', text: 'Inspect stored produce regularly and separate signs of rot, mould or pest damage.', textTe: 'నిల్వలో ఉన్న పంటను క్రమం తప్పకుండా పరిశీలించి కుళ్ళు, బూజు లేదా పురుగు దెబ్బ ఉన్న వాటిని వేరు చేయండి.' },
      { cat: 'risks', text: 'Exact storage duration is not listed until a reliable crop-specific reference is configured.', textTe: 'నమ్మదగిన పంట-ప్రత్యేక మూలం జోడించే వరకు ఖచ్చితమైన నిల్వ కాలాన్ని చూపడం లేదు.' },
    ],
    growthStages: [
      stage('planting', 'Planting / Propagation', 'నాటడం / ప్రవర్ధనం', 'Varies by crop'),
      stage('growth', 'Vegetative Growth', 'వృద్ధి దశ', 'Varies by crop'),
      stage('reproductive', 'Flowering / Fruit or Bulb Development', 'పుష్పాలు / కాయ లేదా దుంప అభివృద్ధి', 'Varies by crop'),
      stage('harvest', 'Harvest & Post-Harvest Handling', 'కోత & కోత తర్వాత నిర్వహణ', 'Varies by crop'),
    ],
    keywords: [name.toLowerCase(), ...aliases.split(',').map((value) => value.trim().toLowerCase()), category, regionalType],
  };
}

const SUPPLEMENTAL_CROPS = supplementalRows.map(buildSupplementalCrop);

export const crops = [
  {
    id: 'onion',
    name: 'Onion',
    nameTe: 'ఉల్లిపాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: 'https://www.vedvyasexim.com/imgs/products/onion.jpg',
    popular: true,
    description:
      'Onion is a widely grown bulb vegetable used in kitchens across India. It grows well in cool, dry weather and is stored after proper curing and drying.',
    descriptionTe:
      'ఉల్లిపాయ భారతదేశంలో విస్తృతంగా పండించే దుంప కూరగాయ. చల్లని, పొడి వాతావరణంలో బాగా పెరుగుతుంది మరియు సరైన ఎండబెట్టిన తర్వాత నిల్వ చేస్తారు.',
    quickFacts: {
      growingSeason: 'Rabi / Summer (Oct–Mar in most of India)',
      harvestTime: '90–120 days after transplanting',
      idealTemperature: '13–24 °C (vegetative growth)',
      idealHumidity: null,
      storageLife: 'Weeks to months with cool, dry, ventilated storage (varies by variety)',
    },
    duration: '4–5 months (nursery to harvest)',
    growingGuidance: [
      'Raised beds with good drainage suit onion nursery preparation.',
      'Avoid waterlogging — standing water encourages bulb rot.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Cure bulbs in shade until necks are dry before long storage.', textTe: 'పొడవైన నిల్వకు ముందు మెడలు ఎండే వరకు దుంపలను నీడలో ఎండబెట్టండి.' },
      { cat: 'ventilation', text: 'Store in ventilated crates or bags — do not seal in airtight plastic.', textTe: 'గాలి ప్రసరణ ఉన్న డబ్బాలలో నిల్వ చేయండి — గాలి ఆడని ప్లాస్టిక్‌లో మూసివేయవద్దు.' },
      { cat: 'moisture', text: 'Keep storage dry; moisture encourages sprouting and mould.', textTe: 'నిల్వ ప్రదేశాన్ని పొడిగా ఉంచండి; తేమ మొలకెత్తడానికి, పురుగుపట్టడానికి కారణమవుతుంది.' },
      { cat: 'inspection', text: 'Sort out soft, sprouted or bruised bulbs regularly.', textTe: 'మెత్తని, మొలకెత్తిన లేదా దెబ్బతిన్న దుంపలను వేరు చేయండి.' },
      { cat: 'risks', text: 'Warning signs: foul smell, black mould, soft watery scales.', textTe: 'హెచ్చరిక సంకేతాలు: దుర్వాసన, నల్ల పురుగుపట్టు, మెత్తని నీటి పొరలు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '4–6 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '4–6 weeks'),
      stage('bulb', 'Bulb Formation', 'దుంప ఏర్పాటు', '6–8 weeks'),
      stage('harvest', 'Harvest & Curing', 'కోత & ఎండబెట్టడం', '2–3 weeks'),
    ],
    keywords: ['onion', 'ullipaya', 'bulb', 'rabi', 'storage'],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    nameTe: 'టమాటా',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/tomato.jpg',
    popular: true,
    description:
      'Tomato is an important vegetable crop grown year-round in many regions. It needs steady moisture, staking support and regular picking for quality fruit.',
    descriptionTe:
      'టమాటా చాలా ప్రాంతాలలో సంవత్సరమంతా పండించే ముఖ్యమైన కూరగాయ పంట. స్థిరమైన తేమ, ఆధారం మరియు క్రమం తప్పని కోత అవసరం.',
    quickFacts: {
      growingSeason: 'Year-round in suitable climates; Kharif & Rabi in many states',
      harvestTime: '60–85 days after transplanting',
      idealTemperature: '21–27 °C (fruit set)',
      idealHumidity: null,
      storageLife: 'Short — days at room temperature, longer in cool ventilated storage',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Transplant seedlings when they are 4–5 weeks old.',
      'Remove side shoots (suckers) in staked plantings for better airflow.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Harvest at breaker stage for longer handling life.', textTe: 'ఎక్కువ నిల్వ కోసం తొలిదశలోనే కోయండి.' },
      { cat: 'ventilation', text: 'Do not stack deep — keep crates loosely packed.', textTe: 'లోతుగా పేర్చవద్దు — డబ్బాలను వదులుగా ఉంచండి.' },
      { cat: 'moisture', text: 'Avoid washing before storage; surface moisture speeds decay.', textTe: 'నిల్వకు ముందు కడగవద్దు; ఉపరితల తేమ కుళ్ళిపోవడాన్ని వేగవంతం చేస్తుంది.' },
      { cat: 'inspection', text: 'Sort out cracked or split fruit early.', textTe: 'పగుళ్లున్న కాయలను త్వరగా వేరు చేయండి.' },
      { cat: 'risks', text: 'Warning signs: soft spots, sour smell, fruit fly damage.', textTe: 'హెచ్చరికలు: మెత్తని మచ్చలు, పులుసు వాసన, ఈగ దెబ్బ.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '3–5 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '4–6 weeks'),
      stage('harvest', 'Harvest', 'కోత', '3–5 weeks (picking window)'),
    ],
    keywords: ['tomato', 'tomato', 'vegetable', 'kharif'],
  },
  {
    id: 'potato',
    name: 'Potato',
    nameTe: 'బంగాళాదుంప',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/potato.jpg',
    popular: true,
    description:
      'Potato is a cool-season tuber crop and a staple food in many households. It prefers loose, well-drained soil and cool weather during tuber formation.',
    descriptionTe:
      'బంగాళాదుంప చల్లని-సీజన్ దుంప పంట మరియు చాలా ఇళ్లలో ప్రధాన ఆహారం. వదులుగా ఉన్న నేల, దుంపల సమయంలో చల్లని వాతావరణం అనుకూలం.',
    quickFacts: {
      growingSeason: 'Rabi (Oct–Dec planting in most of India)',
      harvestTime: '80–120 days after planting',
      idealTemperature: '15–20 °C (tuber formation)',
      idealHumidity: null,
      storageLife: 'Weeks in cool, dark, ventilated storage (varies by variety)',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Plant certified seed tubers with healthy sprouts.',
      'Earth up (mound soil) around plants as they grow to protect tubers.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Avoid skin damage during harvest — damaged skin does not heal in storage.', textTe: 'కోతలో తొక్క దెబ్బతినకుండా చూడండి — దెబ్బతిన్న తొక్క నిల్వలో మానదు.' },
      { cat: 'ventilation', text: 'Keep airflow strong; do not seal in airtight sacks.', textTe: 'గాలి ప్రసరణ ఉంచండి; గాలి ఆడని సంచులలో మూసివేయవద్దు.' },
      { cat: 'moisture', text: 'Store dry and dark — light turns tubers green.', textTe: 'పొడిగా, చీకటిగా నిల్వ చేయండి — వెలుతురు దుంపలను ఆకుపచ్చగా మారుస్తుంది.' },
      { cat: 'inspection', text: 'Remove rotting tubers before they spread.', textTe: 'కుళ్ళిపోతున్న దుంపలను వ్యాపించకముందే తీసివేయండి.' },
      { cat: 'risks', text: 'Warning signs: green skin, soft rot, sprouting in warmth.', textTe: 'హెచ్చరికలు: ఆకుపచ్చ తొక్క, మెత్తని కుళ్ళు, వేడిలో మొలకలు.' },
    ],
    growthStages: [
      stage('sowing', 'Sprouting & Planting', 'మొలకలు & నాటడం', '2–3 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '4–6 weeks'),
      stage('tuber', 'Tuber Formation', 'దుంపల ఏర్పాటు', '4–6 weeks'),
      stage('harvest', 'Harvest', 'కోత', '1–2 weeks'),
    ],
    keywords: ['potato', 'bangaladumpa', 'tuber', 'rabi'],
  },
  {
    id: 'chilli',
    name: 'Chilli',
    nameTe: 'మిరపకాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/chilli.jpg',
    popular: true,
    description:
      'Chilli is a spicy vegetable and spice crop grown for green chillies and dry red powder. It needs warm weather and careful pest management.',
    descriptionTe:
      'మిరపకాయ కూరగాయ మరియు మసాలా పంట. పచ్చి మిరప, ఎండిన ఎరుపు పొడి కోసం పండిస్తారు. వేడి వాతావరణం మరియు చీడపీడల నియంత్రణ అవసరం.',
    quickFacts: {
      growingSeason: 'Kharif & Rabi (June–July, Oct–Nov sowing in many states)',
      harvestTime: '90–120 days after transplanting (green picking earlier)',
      idealTemperature: '20–30 °C',
      idealHumidity: null,
      storageLife: 'Green: days; dry red: months if dried below safe moisture',
    },
    duration: '4–6 months (multiple pickings)',
    growingGuidance: [
      'Pick green chillies frequently to encourage more flowering.',
      'For dry chillies, harvest at full red and dry on clean surface.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pick with stalk for better shelf life of green chillies.', textTe: 'పచ్చి మిరపకాయలకు కాండంతో సహా కోయండి.' },
      { cat: 'ventilation', text: 'Dry red chillies in shade with good airflow, not direct harsh sun.', textTe: 'ఎండిన మిరపను నీడలో గాలి ప్రసరణతో ఎండబెట్టండి.' },
      { cat: 'moisture', text: 'Ensure fully dry before bagging — trapped moisture causes mould.', textTe: 'సంచులలో వేయడానికి ముందు పూర్తిగా ఎండబెట్టండి — తేమ పురుగుపట్టుకు కారణం.' },
      { cat: 'inspection', text: 'Watch for fruit borer damage in the field.', textTe: 'పొలంలో కాయ తొలిచే పురుగు దెబ్బను గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: white mould on dried chillies, dull colour.', textTe: 'హెచ్చరికలు: ఎండిన మిరపపై తెల్లని పురుగుపట్టు, మసక రంగు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '4–5 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '6–8 weeks'),
      stage('harvest', 'Multiple Pickings', 'వరుస కోతలు', '6–10 weeks'),
    ],
    keywords: ['chilli', 'mirchi', 'spice', 'green chilli'],
  },
  {
    id: 'carrot',
    name: 'Carrot',
    nameTe: 'క్యారెట్',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/carrot.jpg',
    description:
      'Carrot is a root vegetable rich in vitamin A. It needs loose, deep soil so roots can grow straight and clean.',
    descriptionTe:
      'క్యారెట్ విటమిన్ A సమృద్ధిగా ఉన్న వేరు కూరగాయ. వేర్లు సరిగ్గా పెరగడానికి వదులుగా, లోతుగా ఉన్న నేల అవసరం.',
    quickFacts: {
      growingSeason: 'Rabi (Sep–Nov sowing in most of India)',
      harvestTime: '70–110 days after sowing',
      idealTemperature: '15–21 °C (root development)',
      idealHumidity: null,
      storageLife: 'Weeks in cool, humid-but-not-wet storage with tops removed',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Thin seedlings early to avoid forked roots.',
      'Keep soil evenly moist while roots are developing.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Remove green tops soon after harvest.', textTe: 'కోత తర్వాత త్వరగా ఆకు భాగాన్ని తీసివేయండి.' },
      { cat: 'ventilation', text: 'Store in perforated crates, not sealed bags.', textTe: 'రంధ్రాలున్న డబ్బాలలో నిల్వ చేయండి, మూసిన సంచులలో కాదు.' },
      { cat: 'moisture', text: 'Prevent wilting with moderate humidity; avoid standing water.', textTe: 'మితమైన తేమతో వాడిపోకుండా చూడండి; నీరు నిలబడకుండా చూడండి.' },
      { cat: 'inspection', text: 'Check for splitting or pest tunnels.', textTe: 'పగుళ్లు లేదా పురుగు రంధ్రాలు ఉన్నాయా తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: rubbery texture, black rot, hairy roots.', textTe: 'హెచ్చరికలు: బిగుసుకుపోయిన నిర్మాణం, నల్ల కుళ్ళు, వెంట్రుకల వేర్లు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '2–3 weeks'),
      stage('vegetative', 'Top Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('root', 'Root Development', 'వేర్ల అభివృద్ధి', '6–8 weeks'),
      stage('harvest', 'Harvest', 'కోత', '1–2 weeks'),
    ],
    keywords: ['carrot', 'root vegetable', 'gajar'],
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    nameTe: 'క్యాబేజీ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/cabbage.jpg',
    description:
      'Cabbage forms tight leafy heads in cool weather. It is a hardy vegetable that suits winter gardens and needs steady water.',
    descriptionTe:
      'క్యాబేజీ చల్లని వాతావరణంలో గట్టి ఆకుల తలలను ఏర్పరుస్తుంది. ఇది శీతాకాలపు తోటలకు అనుకూలమైన కూరగాయ; స్థిరమైన నీరు అవసరం.',
    quickFacts: {
      growingSeason: 'Rabi / Winter (Sep–Nov transplanting)',
      harvestTime: '80–110 days after transplanting',
      idealTemperature: '15–20 °C',
      idealHumidity: null,
      storageLife: 'Weeks in cool storage if outer leaves are kept intact',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Transplant when seedlings have 4–5 true leaves.',
      'Harvest when heads are firm but before they split.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Keep 2–3 wrapper leaves on the head for protection.', textTe: 'రక్షణ కోసం తలపై 2–3 బయటి ఆకులను ఉంచండి.' },
      { cat: 'ventilation', text: 'Store heads separately with airflow between them.', textTe: 'తలలను వేరుగా, గాలి ప్రసరణతో నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Avoid wet storage surfaces — condensation causes rot.', textTe: 'తడి నిల్వ ఉపరితలాలు మానండి — తేమ కుళ్ళుకు కారణం.' },
      { cat: 'inspection', text: 'Check for caterpillar holes and slimy outer leaves.', textTe: 'పురుగు రంధ్రాలు, జిగట బయటి ఆకులను తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: black speckling, soft rot at base.', textTe: 'హెచ్చరికలు: నల్ల మచ్చలు, అడుగున మెత్తని కుళ్ళు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '3–4 weeks'),
      stage('vegetative', 'Leaf Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('head', 'Head Formation', 'తల ఏర్పాటు', '5–7 weeks'),
      stage('harvest', 'Harvest', 'కోత', '1–2 weeks'),
    ],
    keywords: ['cabbage', 'cabbage', 'winter vegetable'],
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    nameTe: 'వంకాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/brinjal.jpg',
    description:
      'Brinjal (eggplant) is a warm-season vegetable with many regional varieties. It fruits over a long window with regular picking.',
    descriptionTe:
      'వంకాయ వేడి సీజన్ కూరగాయ; అనేక ప్రాంతీయ రకాలు ఉన్నాయి. క్రమం తప్పని కోతతో ఎక్కువ కాలం కాయలు వస్తాయి.',
    quickFacts: {
      growingSeason: 'Year-round in warm regions; main seasons vary by state',
      harvestTime: '60–80 days after transplanting (first picking)',
      idealTemperature: '22–30 °C',
      idealHumidity: null,
      storageLife: 'Short — best used fresh within days',
    },
    duration: '4–6 months (picking window)',
    growingGuidance: [
      'Pinch growing tips to encourage branching.',
      'Pick fruits while skin is glossy for best quality.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Handle gently — brinjal bruises easily.', textTe: 'జాగ్రత్తగా నిర్వహించండి — వంకాయ సులభంగా దెబ్బతింటుంది.' },
      { cat: 'ventilation', text: 'Keep in a cool, airy place; do not wrap tightly.', textTe: 'చల్లని, గాలి వచ్చే చోట ఉంచండి; గట్టిగా చుట్టవద్దు.' },
      { cat: 'moisture', text: 'Avoid washing before storage.', textTe: 'నిల్వకు ముందు కడగవద్దు.' },
      { cat: 'inspection', text: 'Check for fruit borer entry holes.', textTe: 'కాయ తొలిచే పురుగు రంధ్రాలను తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: dull skin, brown soft patches, seeds darkening.', textTe: 'హెచ్చరికలు: మసక తొక్క, గోధుమ మచ్చలు, విత్తనాలు నల్లబడటం.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '4–5 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '5–7 weeks'),
      stage('harvest', 'Multiple Pickings', 'వరుస కోతలు', '8–12 weeks'),
    ],
    keywords: ['brinjal', 'eggplant', 'vangaya', 'vegetable'],
  },
  {
    id: 'okra',
    name: 'Okra',
    nameTe: 'బెండకాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/okra.jpg',
    description:
      'Okra (ladies’ finger) is a warm, rainy-season vegetable picked young for tender pods. It grows quickly and fruits continuously.',
    descriptionTe:
      'బెండకాయ వేడి, వర్షాకాలపు కూరగాయ; మెత్తని కాయల కోసం చిన్నవిగానే కోస్తారు. త్వరగా పెరిగి వరుసగా కాయలు ఇస్తుంది.',
    quickFacts: {
      growingSeason: 'Kharif & Zaid (Feb–Mar, June–July sowing)',
      harvestTime: '45–60 days after sowering (first picking)',
      idealTemperature: '24–32 °C',
      idealHumidity: null,
      storageLife: 'Very short — use within 2–3 days of picking',
    },
    duration: '3–4 months (picking window)',
    growingGuidance: [
      'Pick pods every 2–3 days when they are 6–8 cm long.',
      'Soak seeds overnight for faster germination.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pick young pods; over-mature pods become woody.', textTe: 'మెత్తని కాయలను కోయండి; ముదిరిన కాయలు గట్టిపడతాయి.' },
      { cat: 'ventilation', text: 'Store loosely in a cool place.', textTe: 'చల్లని చోట వదులుగా నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Keep dry — wet pods go slimy fast.', textTe: 'పొడిగా ఉంచండి — తడి కాయలు త్వరగా జిగటగా మారతాయి.' },
      { cat: 'inspection', text: 'Remove pods with borer holes or browning tips.', textTe: 'తొలిచిన రంధ్రాలు లేదా గోధుమ చివరలున్న కాయలను తీసివేయండి.' },
      { cat: 'risks', text: 'Warning signs: blackening tips, soft slimy pods.', textTe: 'హెచ్చరికలు: నల్లబడే చివరలు, మెత్తని జిగట కాయలు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '1–2 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', '2–3 weeks'),
      stage('harvest', 'Continuous Picking', 'వరుస కోతలు', '6–10 weeks'),
    ],
    keywords: ['okra', 'ladies finger', 'bendakaya', 'bhindi'],
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    nameTe: 'దోసకాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/cucumber.jpg',
    description:
      'Cucumber is a fast-growing vine vegetable with high water content. It suits trellis cultivation and frequent harvesting.',
    descriptionTe:
      'దోసకాయ త్వరగా పెరిగే తీగ కూరగాయ; నీటి శాతం ఎక్కువ. తీగ ఆధారంపై పెంపకం మరియు తరచు కోతకు అనుకూలం.',
    quickFacts: {
      growingSeason: 'Kharif & Zaid (warm months)',
      harvestTime: '45–60 days after sowing',
      idealTemperature: '24–30 °C',
      idealHumidity: null,
      storageLife: 'Short — several days in cool storage',
    },
    duration: '2–3 months',
    growingGuidance: [
      'Grow on a trellis for straighter, cleaner fruit.',
      'Harvest while still firm and green.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Cut with stalk; avoid squeezing fruit.', textTe: 'కాండంతో కోయండి; కాయలను నొక్కవద్దు.' },
      { cat: 'ventilation', text: 'Chill promptly if storing more than a day.', textTe: 'ఒక రోజు కంటే ఎక్కువ నిల్వ చేయాలంటే వెంటనే చల్లగా ఉంచండి.' },
      { cat: 'moisture', text: 'Keep surface dry to prevent slippery skin.', textTe: 'జారిపోయే తొక్క రాకుండా ఉపరితలం పొడిగా ఉంచండి.' },
      { cat: 'inspection', text: 'Look for soft sunken ends after picking.', textTe: 'కోత తర్వాత మెత్తని లోతైన చివరలు ఉన్నాయా చూడండి.' },
      { cat: 'risks', text: 'Warning signs: yellowing, wrinkled skin, bitter odour.', textTe: 'హెచ్చరికలు: పసుపు రంగు, ముడతలు, చేదు వాసన.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '1–2 weeks'),
      stage('vegetative', 'Vine Growth', 'తీగ పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '3–4 weeks'),
      stage('harvest', 'Harvest', 'కోత', '3–5 weeks'),
    ],
    keywords: ['cucumber', 'dosa', 'salad', 'vine'],
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    nameTe: 'కాలీఫ్లవర్',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/cauliflower.jpg',
    description:
      'Cauliflower forms a white curd in cool weather. Timing matters — heat can spoil the curd quality.',
    descriptionTe:
      'కాలీఫ్లవర్ చల్లని వాతావరణంలో తెల్లని పూతను ఏర్పరుస్తుంది. సమయం ముఖ్యం — ఎండ పూత నాణ్యతను దెబ్బతీస్తుంది.',
    quickFacts: {
      growingSeason: 'Rabi / Winter (Sep–Oct transplanting)',
      harvestTime: '75–100 days after transplanting',
      idealTemperature: '15–22 °C',
      idealHumidity: null,
      storageLife: 'Short to moderate in cool storage with leaves intact',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Break inner leaves over the curd to keep it white (blanching).',
      'Harvest when curd is compact and fully formed.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Keep wrapper leaves around the curd during transport.', textTe: 'రవాణాలో పూత చుట్టూ ఆకులను ఉంచండి.' },
      { cat: 'ventilation', text: 'Do not seal in plastic; use breathable crates.', textTe: 'ప్లాస్టిక్‌లో మూసివేయవద్దు; గాలి ఆడే డబ్బాలు వాడండి.' },
      { cat: 'moisture', text: 'Avoid condensation — curds discolour when wet.', textTe: 'తేమ మానండి — తడిసినప్పుడు పూత రంగు మారుతుంది.' },
      { cat: 'inspection', text: 'Watch for riceyness (loose curd) developing.', textTe: 'పూత విడిపోవడం మొదలైతే గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: brown patches, loose grains, foul smell.', textTe: 'హెచ్చరికలు: గోధుమ మచ్చలు, విడిగుళ్లు, దుర్వాసన.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '3–4 weeks'),
      stage('vegetative', 'Leaf Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('curd', 'Curd Formation', 'పూత ఏర్పాటు', '4–6 weeks'),
      stage('harvest', 'Harvest', 'కోత', '1–2 weeks'),
    ],
    keywords: ['cauliflower', 'gobi', 'winter vegetable'],
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
    nameTe: 'క్యాప్సికమ్',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/capsicum.jpg',
    description:
      'Capsicum (bell pepper) is a colourful vegetable used fresh in cooking. Protected cultivation gives better colour and quality.',
    descriptionTe:
      'క్యాప్సికమ్ వంటలలో తాజాగా వాడే రంగురంగుల కూరగాయ. రక్షిత పెంపకంలో మంచి రంగు, నాణ్యత వస్తాయి.',
    quickFacts: {
      growingSeason: 'Year-round under shade net / Kharif & Rabi in open',
      harvestTime: '60–90 days after transplanting',
      idealTemperature: '20–28 °C',
      idealHumidity: null,
      storageLife: 'Moderate — up to a few weeks in cool storage',
    },
    duration: '3–5 months (picking window)',
    growingGuidance: [
      'Harvest at desired colour stage: green, yellow or red.',
      'Maintain even watering to avoid blossom-end rot.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pick with stalk for longer freshness.', textTe: 'ఎక్కువ తాజాదనం కోసం కాండంతో కోయండి.' },
      { cat: 'ventilation', text: 'Store in single layers where possible.', textTe: 'సాధ్యమైనంత వరకు ఒకే పొరలో నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Keep dry; water on skin speeds decay.', textTe: 'పొడిగా ఉంచండి; తొక్కపై నీరు కుళ్ళును వేగవంతం చేస్తుంది.' },
      { cat: 'inspection', text: 'Check for shrivelling and soft spots.', textTe: 'ముడతలు, మెత్తని మచ్చలు తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: wrinkling, fungal spots, stem rot.', textTe: 'హెచ్చరికలు: ముడతలు, పురుగు మచ్చలు, కాండం కుళ్ళు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing / Nursery', 'విత్తనం / నర్సరీ', '4–5 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '5–7 weeks'),
      stage('harvest', 'Multiple Pickings', 'వరుస కోతలు', '8–12 weeks'),
    ],
    keywords: ['capsicum', 'bell pepper', 'shimla mirch'],
  },
  {
    id: 'bitter-gourd',
    name: 'Bitter Gourd',
    nameTe: 'కాకరకాయ',
    category: CROP_CATEGORIES.VEGETABLE,
    image: '/images/crops/bitter-gourd.jpg',
    description:
      'Bitter gourd (karela) is a climbing vegetable valued for its bitter taste and health benefits. It fruits well in warm, humid weather.',
    descriptionTe:
      'కాకరకాయ చేదు రుచి మరియు ఆరోగ్య ప్రయోజనాలకు ప్రసిద్ధమైన తీగ కూరగాయ. వేడి, తేమ వాతావరణంలో బాగా కాయలు ఇస్తుంది.',
    quickFacts: {
      growingSeason: 'Kharif & Zaid (Feb–Mar, June–July sowing)',
      harvestTime: '55–70 days after sowing (first picking)',
      idealTemperature: '24–30 °C',
      idealHumidity: null,
      storageLife: 'Short — several days in cool storage',
    },
    duration: '3–4 months (picking window)',
    growingGuidance: [
      'Provide a sturdy trellis — vines become heavy.',
      'Pick fruits while still light green and firm.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Harvest every 2–3 days for tender fruit.', textTe: 'మెత్తని కాయల కోసం 2–3 రోజులకు ఒకసారి కోయండి.' },
      { cat: 'ventilation', text: 'Store in cool airy shelves.', textTe: 'చల్లని, గాలి వచ్చే అరలలో నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Keep dry to avoid slimy skin.', textTe: 'జిగట తొక్క రాకుండా పొడిగా ఉంచండి.' },
      { cat: 'inspection', text: 'Watch for fruit fly stings and ripening (yellowing).', textTe: 'ఈగ దెబ్బ, పండటం (పసుపు రంగు) గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: yellow skin, soft patches, strong odour.', textTe: 'హెచ్చరికలు: పసుపు తొక్క, మెత్తని మచ్చలు, తీవ్రమైన వాసన.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '1–2 weeks'),
      stage('vegetative', 'Vine Growth', 'తీగ పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Fruiting', 'పుష్పోత్పత్తి & కాయలు', '3–4 weeks'),
      stage('harvest', 'Multiple Pickings', 'వరుస కోతలు', '6–10 weeks'),
    ],
    keywords: ['bitter gourd', 'karela', 'kakarakaya'],
  },
  {
    id: 'mango',
    name: 'Mango',
    nameTe: 'మామిడి',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/mango.jpg',
    popular: true,
    description:
      'Mango is the most widely grown fruit tree of tropical India. Trees fruit seasonally after a cool, dry flowering period.',
    descriptionTe:
      'మామిడి భారతదేశంలో అత్యంత విస్తృతంగా పండించే పండ్ల చెట్టు. చల్లని, పొడి పుష్పోత్పత్తి తర్వాత సీజన్‌లో కాయలు వస్తాయి.',
    quickFacts: {
      growingSeason: 'Flowering in winter; harvest in summer (Apr–Jul)',
      harvestTime: '3–5 months after flowering (varies by variety)',
      idealTemperature: '24–30 °C (fruit development)',
      idealHumidity: null,
      storageLife: 'Ripe fruit: days at room temperature; mature raw: longer in ventilated cool storage',
    },
    duration: 'Annual tree cycle; first commercial crop after several years',
    growingGuidance: [
      'Prune after harvest for light, open canopy.',
      'Do not refrigerate fully ripe mangoes at very low temperatures for long.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Harvest mature-green fruit with stalk sap washed off.', textTe: 'పక్వానికి రాకముందు కాయలను కాండంతో కోయండి, పాలు కడిగివేయండి.' },
      { cat: 'ventilation', text: 'Ripen in airy crates, not in heaps.', textTe: 'పేర్చి కాకుండా గాలి ఆడే డబ్బాలలో పండించండి.' },
      { cat: 'moisture', text: 'Keep fruit dry; sap and moisture cause sap burn.', textTe: 'కాయలను పొడిగా ఉంచండి; పాలు, తేమ మచ్చలకు కారణం.' },
      { cat: 'inspection', text: 'Check for fruit fly stings and stem-end rot.', textTe: 'ఈగ దెబ్బ, కాండం వద్ద కుళ్ళు తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: black spots, spongy texture, sour smell.', textTe: 'హెచ్చరికలు: నల్ల మచ్చలు, స్పాంజీ నిర్మాణం, పులుసు వాసన.' },
    ],
    growthStages: [
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', 'Monsoon growth flush'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', 'Winter flowering'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '2–3 months'),
      stage('harvest', 'Harvest & Ripening', 'కోత & పండటం', '1–2 months'),
    ],
    keywords: ['mango', 'mamidi', 'fruit', 'summer'],
  },
  {
    id: 'banana',
    name: 'Banana',
    nameTe: 'అరటిపండు',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/banana.jpg',
    popular: true,
    description:
      'Banana is an important fruit crop grown across tropical India. It responds well to irrigation and organic matter and fruits year-round.',
    descriptionTe:
      'అరటి ఉష్ణమండల భారతదేశంలో ముఖ్యమైన పండ్ల పంట. నీటిపారుదల, సేంద్రీయ ఎరువులకు బాగా స్పందిస్తుంది; సంవత్సరమంతా కాయలు వస్తాయి.',
    quickFacts: {
      growingSeason: 'Year-round; planting seasons vary by region',
      harvestTime: '11–14 months after planting (plantains vary)',
      idealTemperature: '25–30 °C',
      idealHumidity: null,
      storageLife: 'Ripe bunch: days; green hands: about a week with careful handling',
    },
    duration: '12–15 months per crop cycle',
    growingGuidance: [
      'Desucker regularly to keep one strong follower.',
      'Bunches need propping once fruit load increases.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pad hands during transport to avoid finger bruising.', textTe: 'రవాణాలో అరటి చేతులు దెబ్బతినకుండా రక్షణ ఇవ్వండి.' },
      { cat: 'ventilation', text: 'Ripen in airy rooms; ethylene from ripe fruit speeds ripening.', textTe: 'గాలి వచ్చే గదులలో పండించండి; పండిన పండ్ల వాయువు పండటాన్ని వేగవంతం చేస్తుంది.' },
      { cat: 'moisture', text: 'Keep dry; wet crowns rot quickly.', textTe: 'పొడిగా ఉంచండి; తడి అరటి తొడిమలు త్వరగా కుళ్ళతాయి.' },
      { cat: 'inspection', text: 'Watch for finger drop and crown rot.', textTe: 'అరటి రాలిపోవడం, తొడిమ కుళ్ళు గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: black crown, uneven ripening, sour smell.', textTe: 'హెచ్చరికలు: నల్ల తొడిమ, అసమాన పండటం, పులుసు వాసన.' },
    ],
    growthStages: [
      stage('sowing', 'Planting & Establishment', 'నాటడం & స్థిరపడటం', '2–3 months'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '5–6 months'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', '3–4 months'),
      stage('harvest', 'Bunch Development & Harvest', 'గెల అభివృద్ధి & కోత', '2–3 months'),
    ],
    keywords: ['banana', 'arati', 'fruit', 'plantain'],
  },
  {
    id: 'orange',
    name: 'Orange',
    nameTe: 'నారింజ',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/orange.jpg',
    description:
      'Orange is a citrus fruit grown in several Indian belts. Trees need balanced nutrition and protection from fruit-sucking pests.',
    descriptionTe:
      'నారింజ భారతదేశంలో అనేక ప్రాంతాలలో పండించే సిట్రస్ పండు. సమతుల్య పోషణ మరియు కాయ పీల్చే పురుగుల నుండి రక్షణ అవసరం.',
    quickFacts: {
      growingSeason: 'Harvest season varies by belt (commonly Oct–Mar)',
      harvestTime: '10–12 months after flowering',
      idealTemperature: '20–30 °C',
      idealHumidity: null,
      storageLife: 'Weeks in cool ventilated storage',
    },
    duration: 'Perennial tree; annual fruiting cycle',
    growingGuidance: [
      'Irrigate regularly during fruit development.',
      'Harvest with clippers leaving a short stem.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Clip fruit; pulling tears the peel.', textTe: 'కాయలను కత్తిరించి కోయండి; లాగితే తొక్క చిరిగిపోతుంది.' },
      { cat: 'ventilation', text: 'Store in single layers with airflow.', textTe: 'గాలి ప్రసరణతో ఒకే పొరలో నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Keep dry; wet fruit develops blue mould.', textTe: 'పొడిగా ఉంచండి; తడి పండ్లపై పురుగుపట్టు వస్తుంది.' },
      { cat: 'inspection', text: 'Remove fruit with stem-end rot.', textTe: 'తొడిమ వద్ద కుళ్ళున్న పండ్లను తీసివేయండి.' },
      { cat: 'risks', text: 'Warning signs: soft spots, green mould, shrivelling.', textTe: 'హెచ్చరికలు: మెత్తని మచ్చలు, ఆకుపచ్చ పురుగుపట్టు, ముడతలు.' },
    ],
    growthStages: [
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', 'Monsoon flush'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', 'Spring flowering'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '5–7 months'),
      stage('harvest', 'Harvest', 'కోత', '2–4 months (season)'),
    ],
    keywords: ['orange', 'citrus', 'narinja', 'fruit'],
  },
  {
    id: 'grapes',
    name: 'Grapes',
    nameTe: 'ద్రాక్ష',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/grapes.jpg',
    description:
      'Grapes are a commercial vine fruit, often trained on bower systems. Quality depends on pruning, irrigation management and bunch care.',
    descriptionTe:
      'ద్రాక్ష వాణిజ్య తీగ పండు; సాధారణంగా బోర్లి నిర్మాణాలపై పెంచుతారు. కత్తిరింపు, నీటిపారుదల, గెల సంరక్షణపై నాణ్యత ఆధారపడి ఉంటుంది.',
    quickFacts: {
      growingSeason: 'Pruning seasons vary; harvest commonly Dec–Apr',
      harvestTime: '3–4 months after pruning (annual cycle)',
      idealTemperature: '25–32 °C (fruiting period)',
      idealHumidity: null,
      storageLife: 'Days to a few weeks in cool storage with careful handling',
    },
    duration: 'Perennial vine; annual pruning cycle',
    growingGuidance: [
      'Thin berries for uniform bunches in table varieties.',
      'Protect ripening bunches from birds and rain.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Cut whole bunches with scissors; avoid rubbing bloom.', textTe: 'గెలలను కత్తెరతో కోయండి; పై పొడి తొలగిపోకుండా చూడండి.' },
      { cat: 'ventilation', text: 'Pre-cool promptly after harvest.', textTe: 'కోత తర్వాత వెంటనే చల్లగా ఉంచండి.' },
      { cat: 'moisture', text: 'Keep bunches dry; moisture promotes grey mould.', textTe: 'గెలలను పొడిగా ఉంచండి; తేమ పురుగుపట్టుకు కారణం.' },
      { cat: 'inspection', text: 'Remove cracked or shrivelled berries.', textTe: 'పగుళ్లు లేదా ముడతలున్న ద్రాక్షను తీసివేయండి.' },
      { cat: 'risks', text: 'Warning signs: berry drop, grey fuzz, shanking.', textTe: 'హెచ్చరికలు: గింజలు రాలిపోవడం, బూడిద పురుగుపట్టు, ఎండిపోవడం.' },
    ],
    growthStages: [
      stage('vegetative', 'Pruning & Shoot Growth', 'కత్తిరింపు & కొమ్మల పెరుగుదల', '2–3 months'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', '3–5 weeks'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '2–3 months'),
      stage('harvest', 'Harvest', 'కోత', '3–6 weeks'),
    ],
    keywords: ['grapes', 'draksha', 'vine', 'fruit'],
  },
  {
    id: 'apple',
    name: 'Apple',
    nameTe: 'ఆపిల్',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/apple.jpg',
    description:
      'Apple is a temperate fruit grown in hill regions of India. It needs winter chilling for proper flowering and fruit set.',
    descriptionTe:
      'ఆపిల్ భారతదేశ కొండ ప్రాంతాలలో పండించే శీతల పండు. సరైన పుష్పోత్పత్తికి శీతాకాలపు చలి అవసరం.',
    quickFacts: {
      growingSeason: 'Harvest in hill states: Aug–Oct (varies by variety)',
      harvestTime: '4–6 months after flowering',
      idealTemperature: '21–24 °C (fruit development)',
      idealHumidity: null,
      storageLife: 'Months in controlled cold storage',
    },
    duration: 'Perennial tree; annual fruiting cycle',
    growingGuidance: [
      'Choose varieties suited to local chilling hours.',
      'Thin fruit after set for better size.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pick with stalk; avoid rubbing the natural wax.', textTe: 'తొడిమతో కోయండి; సహజ మైనపు పొరను తొలగించవద్దు.' },
      { cat: 'ventilation', text: 'Pre-cool before long storage.', textTe: 'పొడవైన నిల్వకు ముందు చల్లగా ఉంచండి.' },
      { cat: 'moisture', text: 'Control humidity to avoid shrivelling.', textTe: 'ముడతలు రాకుండా తేమను నియంత్రించండి.' },
      { cat: 'inspection', text: 'Check for scab and bruising after picking.', textTe: 'కోత తర్వాత మచ్చలు, దెబ్బలు తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: bitter pit, scald, core breakdown.', textTe: 'హెచ్చరికలు: చేదు మచ్చలు, కాలిపోవడం, లోపల కుళ్ళు.' },
    ],
    growthStages: [
      stage('vegetative', 'Dormancy & Bud Break', 'విశ్రాంతి & మొగ్గలు', 'Winter period'),
      stage('flowering', 'Flowering & Pollination', 'పుష్పోత్పత్తి & పరాగసంపర్కం', '3–5 weeks'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '3–4 months'),
      stage('harvest', 'Harvest', 'కోత', '1–2 months'),
    ],
    keywords: ['apple', 'seb', 'temperate', 'fruit'],
  },
  {
    id: 'guava',
    name: 'Guava',
    nameTe: 'జామ',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/guava.jpg',
    description:
      'Guava is a hardy fruit tree that grows in many soils. It fruits twice a year in many regions and is rich in vitamin C.',
    descriptionTe:
      'జామ అనేక రకాల నేలలలో పెరిగే పట్టుదల గల పండ్ల చెట్టు. చాలా ప్రాంతాలలో సంవత్సరానికి రెండుసార్లు కాయలు వస్తాయి; విటమిన్ C సమృద్ధి.',
    quickFacts: {
      growingSeason: 'Two seasons common (Kharif & Rabi flowering)',
      harvestTime: '3–5 months after flowering',
      idealTemperature: '23–28 °C',
      idealHumidity: null,
      storageLife: 'Ripe fruit: days; firm raw fruit: about a week in cool storage',
    },
    duration: 'Perennial tree; twice-yearly fruiting in many regions',
    growingGuidance: [
      'Light pruning after each harvest encourages new fruiting wood.',
      'Bagging fruit improves skin quality.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Pick firm, mature fruit; it softens after harvest.', textTe: 'గట్టిగా ఉన్న పక్వ కాయలను కోయండి; కోత తర్వాత మెత్తబడుతుంది.' },
      { cat: 'ventilation', text: 'Store loosely; do not stack deep.', textTe: 'వదులుగా నిల్వ చేయండి; పేర్చవద్దు.' },
      { cat: 'moisture', text: 'Keep dry to avoid skin spotting.', textTe: 'తొక్క మచ్చలు రాకుండా పొడిగా ఉంచండి.' },
      { cat: 'inspection', text: 'Remove fruit with fruit fly stings.', textTe: 'ఈగ దెబ్బతిన్న కాయలను తీసివేయండి.' },
      { cat: 'risks', text: 'Warning signs: soft bruised skin, fermentation smell.', textTe: 'హెచ్చరికలు: మెత్తని దెబ్బలు, పులుసు వాసన.' },
    ],
    growthStages: [
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', 'Post-pruning flush'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', '4–6 weeks'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '2–3 months'),
      stage('harvest', 'Harvest', 'కోత', '2–4 weeks'),
    ],
    keywords: ['guava', 'jama', 'fruit', 'vitamin c'],
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    nameTe: 'దానిమ్మ',
    category: CROP_CATEGORIES.FRUIT,
    image: '/images/crops/pomegranate.jpg',
    description:
      'Pomegranate is a hardy fruit suited to dry regions. It stores better than most fresh fruits and has strong market demand.',
    descriptionTe:
      'దానిమ్మ పొడి ప్రాంతాలకు అనుకూలమైన పట్టుదల గల పండు. ఇతర తాజా పండ్ల కంటే ఎక్కువ కాలం నిల్వ ఉంటుంది; మార్కెట్ డిమాండ్ మంచిది.',
    quickFacts: {
      growingSeason: 'Flowering twice-yearly in many regions; harvest varies',
      harvestTime: '5–7 months after flowering',
      idealTemperature: '25–35 °C (fruiting)',
      idealHumidity: null,
      storageLife: 'Weeks in cool ventilated storage',
    },
    duration: 'Perennial tree; annual fruiting cycles',
    growingGuidance: [
      'Fruit cracking increases with irregular irrigation.',
      'Harvest when fruits develop full colour.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Cut stems short to avoid puncturing other fruit.', textTe: 'ఇతర కాయలను తొలిచే ప్రమాదం లేకుండా కాండాలను చిన్నవిగా కత్తిరించండి.' },
      { cat: 'ventilation', text: 'Store in airy crates in a single layer.', textTe: 'ఒకే పొరలో గాలి ఆడే డబ్బాలలో నిల్వ చేయండి.' },
      { cat: 'moisture', text: 'Keep dry; surface moisture invites crown rot.', textTe: 'పొడిగా ఉంచండి; ఉపరితల తేమ కుళ్ళుకు దారితీస్తుంది.' },
      { cat: 'inspection', text: 'Watch for sunburn and cracking on the tree.', textTe: 'చెట్టుపై ఎండ దెబ్బ, పగుళ్లు గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: leaked arils, musty smell, split skin.', textTe: 'హెచ్చరికలు: గింజలు చిందటం, దుర్వాసన, చిరిగిన తొక్క.' },
    ],
    growthStages: [
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '2–3 months'),
      stage('flowering', 'Flowering', 'పుష్పోత్పత్తి', '1–2 months'),
      stage('fruiting', 'Fruit Development', 'కాయల అభివృద్ధి', '3–5 months'),
      stage('harvest', 'Harvest', 'కోత', '1–2 months'),
    ],
    keywords: ['pomegranate', 'danimma', 'fruit', 'dryland'],
  },
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    nameTe: 'వరి (బియ్యం)',
    category: CROP_CATEGORIES.FIELD,
    image: '/images/crops/paddy.jpg',
    popular: true,
    description:
      'Paddy is the staple field crop of India, grown in flooded or moist fields. Water management and variety choice drive yield.',
    descriptionTe:
      'వరి భారతదేశపు ప్రధాన ప్రధాన పంట; నీటితో నిండిన లేదా తడి పొలాలలో పండిస్తారు. నీటి నిర్వహణ, రకం ఎంపిక దిగుబడిని నిర్ణయిస్తాయి.',
    quickFacts: {
      growingSeason: 'Kharif (monsoon), Rabi and summer in many states',
      harvestTime: '100–150 days after transplanting (variety-dependent)',
      idealTemperature: '22–32 °C',
      idealHumidity: null,
      storageLife: 'Months as dried grain (parboiled/raw) at safe moisture',
    },
    duration: '3.5–5 months per season',
    growingGuidance: [
      'Maintain standing water during critical growth stages.',
      'Drain fields before harvest for better grain quality.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Dry grain to safe moisture before storage.', textTe: 'నిల్వకు ముందు ధాన్యాన్ని సురక్షిత తేమకు ఎండబెట్టండి.' },
      { cat: 'ventilation', text: 'Aerate bins periodically to avoid hot spots.', textTe: 'వేడి కేంద్రాలు రాకుండా గోదాములను తరచు గాలిసోపు చేయండి.' },
      { cat: 'moisture', text: 'Keep bins dry and leak-free.', textTe: 'గోదాములను పొడిగా, చినుకు రానివిగా ఉంచండి.' },
      { cat: 'inspection', text: 'Check for weevils and moisture heating.', textTe: 'పురుగులు, తేమ వేడి తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: musty smell, webbing, discoloured grain.', textTe: 'హెచ్చరికలు: దుర్వాసన, గూడు అల్లిక, రంగు మారిన ధాన్యం.' },
    ],
    growthStages: [
      stage('sowing', 'Nursery & Transplanting', 'నర్సరీ & నాటడం', '3–4 weeks'),
      stage('vegetative', 'Tillering', 'పిలకలు', '4–6 weeks'),
      stage('flowering', 'Panicle Initiation & Flowering', 'విత్తన దండ & పుష్పోత్పత్తి', '4–6 weeks'),
      stage('harvest', 'Grain Fill & Harvest', 'ధాన్యం నిండటం & కోత', '4–6 weeks'),
    ],
    keywords: ['paddy', 'rice', 'vari', 'field crop', 'monsoon'],
  },
  {
    id: 'maize',
    name: 'Maize',
    nameTe: 'మొక్కజొన్న',
    category: CROP_CATEGORIES.FIELD,
    image: '/images/crops/maize.jpg',
    description:
      'Maize (corn) is a versatile field crop used for food, feed and industry. It grows fast and responds well to nitrogen.',
    descriptionTe:
      'మొక్కజొన్న ఆహారం, పశువుల దాణా, పరిశ్రమలకు వాడే బహుముఖ ప్రయోజన పంట. త్వరగా పెరుగుతుంది మరియు నత్రజనికి బాగా స్పందిస్తుంది.',
    quickFacts: {
      growingSeason: 'Kharif, Rabi & summer depending on region',
      harvestTime: '80–110 days after sowing (grain maize)',
      idealTemperature: '21–27 °C',
      idealHumidity: null,
      storageLife: 'Months as dried grain below safe moisture',
    },
    duration: '3–4 months',
    growingGuidance: [
      'Ensure good plant population — maize is sensitive to gaps.',
      'Side-dress nitrogen at knee-high stage.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Dry cobs thoroughly before shelling storage.', textTe: 'నిల్వకు ముందు కంకులను పూర్తిగా ఎండబెట్టండి.' },
      { cat: 'ventilation', text: 'Use ventilated cribs for cobs.', textTe: 'కంకుల కోసం గాలి ఆడే నిల్వ స్థలాలు వాడండి.' },
      { cat: 'moisture', text: 'Keep moisture low to stop aflatoxin risk.', textTe: 'అఫ్లాటాక్సిన్ ప్రమాదాన్ని అరికట్టడానికి తేమ తక్కువగా ఉంచండి.' },
      { cat: 'inspection', text: 'Watch for weevils and cob rot.', textTe: 'పురుగులు, కంకు కుళ్ళు గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: greenish mould on kernels, heating bins.', textTe: 'హెచ్చరికలు: గింజలపై ఆకుపచ్చ పురుగుపట్టు, వేడెక్కిన నిల్వలు.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '1–2 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '4–6 weeks'),
      stage('flowering', 'Tasseling & Silking', 'పుష్పోత్పత్తి', '2–3 weeks'),
      stage('harvest', 'Grain Fill & Harvest', 'ధాన్యం నిండటం & కోత', '6–8 weeks'),
    ],
    keywords: ['maize', 'corn', 'mokka jonna', 'field crop'],
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameTe: 'పత్తి',
    category: CROP_CATEGORIES.FIELD,
    image: '/images/crops/cotton.jpg',
    description:
      'Cotton is a major fibre crop. Boll picking is done in rounds and pest management is central to profitable production.',
    descriptionTe:
      'పత్తి ప్రధాన పీచు పంట. కాయలను వరుసలుగా ఏరుతారు; లాభదాయక సాగుకు చీడపీడల నియంత్రణ కీలకం.',
    quickFacts: {
      growingSeason: 'Kharif (June–July sowing in most of India)',
      harvestTime: 'First picking ~150–180 days after sowing',
      idealTemperature: '25–35 °C',
      idealHumidity: null,
      storageLife: 'Stored as lint/seed cotton in dry conditions before ginning',
    },
    duration: '5–6 months',
    growingGuidance: [
      'Scout for bollworm regularly from flowering.',
      'Pick only opened bolls to keep lint clean.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Keep picked cotton clean and free of trash.', textTe: 'ఏరిన పత్తిని శుభ్రంగా, చెత్త లేకుండా ఉంచండి.' },
      { cat: 'ventilation', text: 'Do not store seed cotton in sealed rooms.', textTe: 'విత్తన పత్తిని మూసిన గదులలో నిల్వ చేయవద్దు.' },
      { cat: 'moisture', text: 'Avoid moisture — wet lint loses grade.', textTe: 'తేమ మానండి — తడి పత్తి నాణ్యత కోల్పోతుంది.' },
      { cat: 'inspection', text: 'Remove wet or discoloured loads separately.', textTe: 'తడి లేదా రంగు మారిన భాగాలను వేరు చేయండి.' },
      { cat: 'risks', text: 'Warning signs: yellowing lint, mould heating.', textTe: 'హెచ్చరికలు: పసుపు రంగు పత్తి, పురుగుపట్టు వేడి.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Establishment', 'విత్తనం & స్థిరపడటం', '3–4 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '6–8 weeks'),
      stage('flowering', 'Flowering & Boll Formation', 'పుష్పోత్పత్తి & కాయలు', '6–8 weeks'),
      stage('harvest', 'Boll Opening & Picking', 'కాయలు తెరుచుకోవడం & కోత', '4–6 weeks'),
    ],
    keywords: ['cotton', 'patti', 'fibre', 'field crop'],
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    nameTe: 'వేరుశనగ',
    category: CROP_CATEGORIES.FIELD,
    image: '/images/crops/groundnut.jpg',
    description:
      'Groundnut (peanut) is an oilseed crop that fixes nitrogen in the soil. Pods develop underground and need careful harvest timing.',
    descriptionTe:
      'వేరుశనగ నేలలో నత్రజనిని స్థిరపరిచే నూనెగింజల పంట. కాయలు భూమిలో ఏర్పడతాయి; సరైన సమయంలో కోత ముఖ్యం.',
    quickFacts: {
      growingSeason: 'Kharif & Rabi (June–July, Jan–Feb sowing)',
      harvestTime: '100–120 days after sowing',
      idealTemperature: '25–30 °C',
      idealHumidity: null,
      storageLife: 'Months as dried pods in dry, cool storage',
    },
    duration: '3.5–4.5 months',
    growingGuidance: [
      'Avoid over-lush vegetative growth — it reduces pegging.',
      'Harvest when inner shell lining turns dark.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Dry pods to safe moisture before storage.', textTe: 'నిల్వకు ముందు కాయలను సురక్షిత తేమకు ఎండబెట్టండి.' },
      { cat: 'ventilation', text: 'Store in breathable bags, not plastic.', textTe: 'గాలి ఆడే సంచులలో నిల్వ చేయండి, ప్లాస్టిక్‌లో కాదు.' },
      { cat: 'moisture', text: 'Keep dry — wet pods develop mould and rancidity.', textTe: 'పొడిగా ఉంచండి — తడి కాయలపై పురుగుపట్టు, చెడిపోవడం వస్తుంది.' },
      { cat: 'inspection', text: 'Check for pod damage and insect holes.', textTe: 'కాయల దెబ్బ, పురుగు రంధ్రాలు తనిఖీ చేయండి.' },
      { cat: 'risks', text: 'Warning signs: shrivelled kernels, musty odour.', textTe: 'హెచ్చరికలు: ముడతలు పడిన గింజలు, దుర్వాసన.' },
    ],
    growthStages: [
      stage('sowing', 'Sowing & Germination', 'విత్తనం & మొలకలు', '1–2 weeks'),
      stage('vegetative', 'Vegetative Growth', 'ఆకుల పెరుగుదల', '3–4 weeks'),
      stage('flowering', 'Flowering & Pegging', 'పుష్పోత్పత్తి & కాయలు', '3–4 weeks'),
      stage('harvest', 'Pod Fill & Harvest', 'కాయల నిండటం & కోత', '4–6 weeks'),
    ],
    keywords: ['groundnut', 'peanut', 'verusenaga', 'oilseed'],
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    nameTe: 'చెరకు',
    category: CROP_CATEGORIES.FIELD,
    image: '/images/crops/sugarcane.jpg',
    description:
      'Sugarcane is a long-duration commercial crop grown for sugar and jaggery. It needs heavy irrigation and good soil fertility.',
    descriptionTe:
      'చెరకు చెక్కెర, బెల్లం కోసం పండించే పొడవైన వ్యవధి వాణిజ్య పంట. భారీ నీటిపారుదల, మంచి నేల సారం అవసరం.',
    quickFacts: {
      growingSeason: 'Planting: Jan–Mar & Sep–Oct in many states',
      harvestTime: '10–12 months after planting (plant cane)',
      idealTemperature: '25–32 °C',
      idealHumidity: null,
      storageLife: 'Processed quickly after harvest; cane deteriorates within days',
    },
    duration: '10–14 months',
    growingGuidance: [
      'Use healthy setts (seed cane) free of disease.',
      'Ratoon crops can follow the plant crop if stool health is good.',
    ],
    storageTips: [
      { cat: 'handling', text: 'Deliver cane to mill quickly after harvest.', textTe: 'కోత తర్వాత వెంటనే చెరకును మిల్లుకు తరలించండి.' },
      { cat: 'ventilation', text: 'Avoid large heaps that heat up.', textTe: 'వేడెక్కే పెద్ద కుప్పలు మానండి.' },
      { cat: 'moisture', text: 'Do not store wet cane in piles.', textTe: 'తడి చెరకును కుప్పలుగా నిల్వ చేయవద్దు.' },
      { cat: 'inspection', text: 'Check for drying of stacked cane.', textTe: 'పేర్చిన చెరకు ఎండిపోవడం గమనించండి.' },
      { cat: 'risks', text: 'Warning signs: browning, low juice quality after delays.', textTe: 'హెచ్చరికలు: గోధుమ రంగు, ఆలస్యంతో రసం నాణ్యత తగ్గడం.' },
    ],
    growthStages: [
      stage('sowing', 'Sett Planting', 'మొక్కల నాటడం', '2–4 weeks'),
      stage('vegetative', 'Tillering', 'పిలకలు', '2–4 months'),
      stage('growth', 'Grand Growth', 'వేగవంతమైన పెరుగుదల', '4–5 months'),
      stage('harvest', 'Maturity & Harvest', 'పక్వం & కోత', '2–3 months'),
    ],
    keywords: ['sugarcane', 'cheruku', 'sugar', 'field crop'],
  },
  ...SUPPLEMENTAL_CROPS,
];

export const cropById = Object.fromEntries(crops.map((c) => [c.id, c]));

export function getCrop(id) {
  return cropById[id] ?? null;
}

export function cropsByCategory(category) {
  if (!category || category === 'all') return crops;
  return crops.filter((c) => c.category === category);
}

/** Simple client-side search across name, category and keywords. */
export function searchCrops(query) {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return crops;
  return crops.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameTe.includes(query?.trim() ?? '') ||
      c.category.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

/** Home gallery order (as specified in the reference). */
export const HOME_ROW_1 = ['onion', 'tomato', 'potato', 'chilli', 'carrot', 'cabbage'];
export const HOME_ROW_2 = ['brinjal', 'okra', 'mango', 'banana', 'orange', 'grapes'];

/** Market page card order. */
export const MARKET_CROP_IDS = [
  'onion',
  'tomato',
  'potato',
  'chilli',
  'carrot',
  'brinjal',
  'okra',
  'cabbage',
];
