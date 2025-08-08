// --- PWA Service Worker & Install Prompt ---
if ('serviceWorker' in navigator) {
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            const toast = document.getElementById('toast');
            if (toast) {
              toast.textContent = 'Update available!';
              const updateButton = document.createElement('button');
              updateButton.textContent = 'Tap to Update';
              updateButton.style.cssText = "margin-left: 1rem; font-weight: bold; background: none; border: none; color: white; cursor: pointer; text-decoration: underline;";
              updateButton.onclick = () => {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              };
              toast.appendChild(updateButton);
              toast.classList.add('show');
            }
          }
        });
      });
    } catch (err) {
      console.log('ServiceWorker registration failed: ', err);
    }
  };
  window.addEventListener('load', registerServiceWorker);
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

  let deferredPrompt;
  const installAppBtn = document.getElementById('install-app-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installAppBtn.style.display = 'flex';
    console.log(`'beforeinstallprompt' event was fired.`);
  });

  installAppBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installAppBtn.style.display = 'none';
    }
  });

  // --- CATEGORY & ITEM DATA ---
  const allBuildingSubCategories = [
      { id: 'Bakery', name: 'Bakery', icon: 'assets/items/Buildings/Bakery.webp' },
      { id: 'Popcorn', name: 'Popcorn Pot', icon: 'assets/items/Buildings/popcorn_Pot.webp' },
      { id: 'BBQ', name: 'BBQ Grill', icon: 'assets/items/Buildings/BBQ_Grill.webp' },
      { id: 'Pie', name: 'Pie Oven', icon: 'assets/items/Buildings/Pie_Oven.webp' },
      { id: 'Cake', name: 'Cake Oven', icon: 'assets/items/Buildings/Cake_Oven.webp' },
      { id: 'Juice', name: 'Juice Press', icon: 'assets/items/Buildings/Juice_Press.webp' },
      { id: 'Ice-Cream', name: 'Ice Cream Maker', icon: 'assets/items/Buildings/Ice_Cream_Maker.webp' },
      { id: 'Jam', name: 'Jam Maker', icon: 'assets/items/Buildings/Jam_Maker.webp' },
      { id: 'Coffee-Kiosk', name: 'Coffee Kiosk', icon: 'assets/items/Buildings/Coffee_Kiosk.webp' },
      { id: 'Soup', name: 'Soup Kitchen', icon: 'assets/items/Buildings/Soup_Kitchen.webp' },
      { id: 'Candy', name: 'Candy Machine', icon: 'assets/items/Buildings/Candy_Machine.webp' },
      { id: 'Sushi', name: 'Sushi Bar', icon: 'assets/items/Buildings/Sushi_Bar.webp' },
	  { id: 'Salad-Bar', name: 'Salad Bar', icon: 'assets/items/Buildings/Salad_Bar.webp' },
	  { id: 'Sandwich-Bar', name: 'Sandwich Bar', icon: 'assets/items/Buildings/Sandwich_Bar.webp' },
	  { id: 'Smoothie-Mixer', name: 'Smoothie Mixer', icon: 'assets/items/Buildings/Smoothie_Mixer.webp' },
	  { id: 'Wok-Kitchen', name: 'Wok Kitchen', icon: 'assets/items/Buildings/Wok_Kitchen.webp' },
	  { id: 'Pasta-Kitchen', name: 'Pasta Kitchen', icon: 'assets/items/Buildings/Pasta_Kitchen.webp' },
	  { id: 'Hot-Dog-Stand', name: 'Hot Dog Stand', icon: 'assets/items/Buildings/Hot_Dog_Stand.webp' },
	  { id: 'Donut-Maker', name: 'Donut Maker', icon: 'assets/items/Buildings/Donut_Maker.webp' },
	  { id: 'Taco-Kitchen', name: 'Taco Kitchen', icon: 'assets/items/Buildings/Taco_Kitchen.webp' },
	  { id: 'Omelet-Station', name: 'Omelet Station', icon: 'assets/items/Buildings/Omelet_Station.webp' },
	  { id: 'Tea-Stand', name: 'Tea Stand', icon: 'assets/items/Buildings/Tea_Stand.webp' },
	  { id: 'Fondue-Pot', name: 'Fondue Pot', icon: 'assets/items/Buildings/Fondue_Pot.webp' },
	  { id: 'Deep-Fryer', name: 'Deep Fryer', icon: 'assets/items/Buildings/Deep_Fryer.webp' },
	  { id: 'Preservation-Station', name: 'Preservation Station', icon: 'assets/items/Buildings/Preservation_Station.webp' },
	  { id: 'Fudge-Shop', name: 'Fudge Shop', icon: 'assets/items/Buildings/Fudge_Shop.webp' },
	  { id: 'Yogurt-Maker', name: 'Yogurt Maker', icon: 'assets/items/Buildings/Yogurt_Maker.webp' },
	  { id: 'Stew-Pot', name: 'Stew Pot', icon: 'assets/items/Buildings/Stew_Pot.webp' },
	  { id: 'Cupcake-Maker', name: 'Cupcake Maker', icon: 'assets/items/Buildings/Cupcake_Maker.webp' },
	  { id: 'Waffle-Maker', name: 'Waffle Maker', icon: 'assets/items/Buildings/Waffle_Maker.webp' },
	  { id: 'Porridge-Bar', name: 'Porridge Bar', icon: 'assets/items/Buildings/Porridge_Bar.webp' },
	  { id: 'Milkshake-Bar', name: 'Milkshake Bar', icon: 'assets/items/Buildings/Milkshake_Bar.webp' },
	  { id: 'Sauce-Maker', name: 'Sauce-Maker', icon: 'assets/items/Buildings/Sauce_Maker.webp' },
	  { id: 'Pasta-Maker', name: 'Pasta maker', icon: 'assets/items/Buildings/Pasta_Maker.webp' },
      { id: 'Dairy', name: 'Dairy', icon: 'assets/items/Buildings/Dairy.webp' },
      { id: 'Honey-Extractor', name: 'Honey Extractor', icon: 'assets/items/Buildings/Honey_Extractor.webp' },
      { id: 'Fish', name: 'Fishing Hut', icon: 'assets/items/Buildings/Fishing_Hut.webp' },
      { id: 'Lobster', name: 'Lobster Pool', icon: 'assets/items/Buildings/Lobster_Pool_Stage_6.webp' },
      { id: 'Duck', name: 'Duck Salon', icon: 'assets/items/Buildings/Duck_Salon_Stage6.webp' },
	  { id: 'Feed-Mill', name: 'Feed Mill', icon: 'assets/items/Buildings/Feed_Mill.webp' },
	  { id: 'Chicken', name: 'Chicken', icon: 'assets/items/Buildings/Chicken.webp' },
	  { id: 'Cow', name: 'Cow', icon: 'assets/items/Buildings/Cow.webp' },
	  { id: 'Pig', name: 'Pig', icon: 'assets/items/Buildings/Pig.webp' },
	  { id: 'Sheep', name: 'Sheep', icon: 'assets/items/Buildings/Sheep.webp' },
	  { id: 'Goat', name: 'Goat', icon: 'assets/items/Buildings/Goat.webp' },
	  { id: 'Bee', name: 'Bee', icon: 'assets/items/Buildings/Honey_Bee.webp' },
	  { id: 'Squirrel', name: 'Squirrel', icon: 'assets/items/Buildings/Squirrel.webp' },
	  { id: 'Sugar-Mill', name: 'Sugar Mill', icon: 'assets/items/Buildings/Sugar_Mill.webp' },
      { id: 'Crops', name: 'Crops', icon: 'assets/items/Buildings/Field.webp' },
      { id: 'Trees', name: 'Trees', icon: 'assets/items/Buildings/Apple_Tree.webp' },
      { id: 'Bushes', name: 'Bushes', icon: 'assets/items/Buildings/Blackberry_Bush.webp' },
	  { id: 'Dead-Tree', name: 'Dead Trees', icon: 'assets/items/Buildings/Dead_Tree.webp' },
	  { id: 'Loom', name: 'Loom', icon: 'assets/items/Buildings/Loom.webp' },
	  { id: 'Sewing-Machine', name: 'Sewing Machine', icon: 'assets/items/Buildings/Sewing_Machine.webp' },
	  { id: 'Smelter', name: 'Smelter', icon: 'assets/items/Buildings/Smelter.webp' },
	  { id: 'Jeweler', name: 'Jeweler', icon: 'assets/items/Buildings/Jeweler.webp' },
	  { id: 'Candle-Maker', name: 'Candle Maker', icon: 'assets/items/Buildings/Candle_Maker.webp' },
	  { id: 'Flower-Shop', name: 'Flower-Shop', icon: 'assets/items/Buildings/Flower_Shop.webp' },
	  { id: 'Essential-Oils-Lab', name: 'Essential Oils Lab', icon: 'assets/items/Buildings/Essential_Oils_Lab.webp' },
	  { id: 'Hat-Maker', name: 'Hat Maker', icon: 'assets/items/Buildings/Hat_Maker.webp' },
	  { id: 'Bath-Kiosk', name: 'Bath Kiosk', icon: 'assets/items/Buildings/Bath_Kiosk.webp' },
	  { id: 'Pottery-Studio', name: 'Pottery Studio', icon: 'assets/items/Buildings/Pottery_Studio.webp' },
	  { id: 'Perfumerie', name: 'Perfumerie', icon: 'assets/items/Buildings/Perfumerie.webp' }
  ];

  const masterCategoryStructure = [
    { 
        name: 'All Production',
        subCategories: allBuildingSubCategories
    },
    { 
        name: 'Food & Drink', 
        subCategories: [
            { id: 'Bakery', name: 'Bakery', icon: 'assets/items/Buildings/Bakery.webp' },
            { id: 'Popcorn', name: 'Popcorn Pot', icon: 'assets/items/Buildings/popcorn_Pot.webp' },
            { id: 'BBQ', name: 'BBQ Grill', icon: 'assets/items/Buildings/BBQ_Grill.webp' },
            { id: 'Pie', name: 'Pie Oven', icon: 'assets/items/Buildings/Pie_Oven.webp' },
            { id: 'Cake', name: 'Cake Oven', icon: 'assets/items/Buildings/Cake_Oven.webp' },
            { id: 'Juice', name: 'Juice Press', icon: 'assets/items/Buildings/Juice_Press.webp' },
            { id: 'Ice-Cream', name: 'Ice Cream Maker', icon: 'assets/items/Buildings/Ice_Cream_Maker.webp' },
            { id: 'Jam', name: 'Jam Maker', icon: 'assets/items/Buildings/Jam_Maker.webp' },
            { id: 'Coffee-Kiosk', name: 'Coffee Kiosk', icon: 'assets/items/Buildings/Coffee_Kiosk.webp' },
            { id: 'Soup', name: 'Soup Kitchen', icon: 'assets/items/Buildings/Soup_Kitchen.webp' },
            { id: 'Candy', name: 'Candy Machine', icon: 'assets/items/Buildings/Candy_Machine.webp' },
            { id: 'Sushi', name: 'Sushi Bar', icon: 'assets/items/Buildings/Sushi_Bar.webp' },
			{ id: 'Salad-Bar', name: 'Salad Bar', icon: 'assets/items/Buildings/Salad_Bar.webp' },
			{ id: 'Sandwich-Bar', name: 'Sandwich Bar', icon: 'assets/items/Buildings/Sandwich_Bar.webp' },
			{ id: 'Smoothie-Mixer', name: 'Smoothie Mixer', icon: 'assets/items/Buildings/Smoothie_Mixer.webp' },
			{ id: 'Wok-Kitchen', name: 'Wok Kitchen', icon: 'assets/items/Buildings/Wok_Kitchen.webp' },
			{ id: 'Pasta-Kitchen', name: 'Pasta Kitchen', icon: 'assets/items/Buildings/Pasta_Kitchen.webp' },
			{ id: 'Hot-Dog-Stand', name: 'Hot Dog Stand', icon: 'assets/items/Buildings/Hot_Dog_Stand.webp' },
			{ id: 'Donut-Maker', name: 'Donut Maker', icon: 'assets/items/Buildings/Donut_Maker.webp' },
			{ id: 'Taco-Kitchen', name: 'Taco Kitchen', icon: 'assets/items/Buildings/Taco_Kitchen.webp' },
			{ id: 'Omelet-Station', name: 'Omelet Station', icon: 'assets/items/Buildings/Omelet_Station.webp' },
			{ id: 'Tea-Stand', name: 'Tea Stand', icon: 'assets/items/Buildings/Tea_Stand.webp' },
			{ id: 'Fondue-Pot', name: 'Fondue Pot', icon: 'assets/items/Buildings/Fondue_Pot.webp' },
			{ id: 'Deep-Fryer', name: 'Deep Fryer', icon: 'assets/items/Buildings/Deep_Fryer.webp' },
			{ id: 'Preservation-Station', name: 'Preservation Station', icon: 'assets/items/Buildings/Preservation_Station.webp' },
			{ id: 'Fudge-Shop', name: 'Fudge Shop', icon: 'assets/items/Buildings/Fudge_Shop.webp' },
			{ id: 'Yogurt-Maker', name: 'Yogurt Maker', icon: 'assets/items/Buildings/Yogurt_Maker.webp' },
			{ id: 'Stew-Pot', name: 'Stew Pot', icon: 'assets/items/Buildings/Stew_Pot.webp' },
			{ id: 'Cupcake-Maker', name: 'Cupcake Maker', icon: 'assets/items/Buildings/Cupcake_Maker.webp' },
			{ id: 'Waffle-Maker', name: 'Waffle Maker', icon: 'assets/items/Buildings/Waffle_Maker.webp' },
			{ id: 'Porridge-Bar', name: 'Porridge Bar', icon: 'assets/items/Buildings/Porridge_Bar.webp' },
			{ id: 'Milkshake-Bar', name: 'Milkshake Bar', icon: 'assets/items/Buildings/Milkshake_Bar.webp' }
        ] 
    },
	{ 
        name: 'Animal Goods', 
        subCategories: [
            { id: 'Dairy', name: 'Dairy', icon: 'assets/items/Buildings/Dairy.webp' },
            { id: 'Honey-Extractor', name: 'Honey Extractor', icon: 'assets/items/Buildings/Honey_Extractor.webp' },
            { id: 'Fish', name: 'Fishing Hut', icon: 'assets/items/Buildings/Fishing_Hut.webp' },
            { id: 'Lobster', name: 'Lobster Pool', icon: 'assets/items/Buildings/Lobster_Pool_Stage_6.webp' },
            { id: 'Duck', name: 'Duck Salon', icon: 'assets/items/Buildings/Duck_Salon_Stage6.webp' },
			{ id: 'Feed-Mill', name: 'Feed Mill', icon: 'assets/items/Buildings/Feed_Mill.webp' },
			{ id: 'Chicken', name: 'Chicken', icon: 'assets/items/Buildings/Chicken.webp' },
			{ id: 'Cow', name: 'Cow', icon: 'assets/items/Buildings/Cow.webp' },
	  		{ id: 'Pig', name: 'Pig', icon: 'assets/items/Buildings/Pig.webp' },
	  		{ id: 'Sheep', name: 'Sheep', icon: 'assets/items/Buildings/Sheep.webp' },
	  		{ id: 'Goat', name: 'Goat', icon: 'assets/items/Buildings/Goat.webp' },
	  		{ id: 'Bee', name: 'Bee', icon: 'assets/items/Buildings/Honey_Bee.webp' },
	  		{ id: 'Squirrel', name: 'Squirrel', icon: 'assets/items/Buildings/Squirrel.webp' }
        ] 
    },
    { 
        name: 'Refined Goods', 
        subCategories: [
            { id: 'Sugar-Mill', name: 'Sugar Mill', icon: 'assets/items/Buildings/Sugar_Mill.webp' },
            { id: 'Sauce-Maker', name: 'Sauce Maker', icon: 'assets/items/Buildings/Sauce_Maker.webp' },
            { id: 'Pasta-Maker', name: 'Pasta Maker', icon: 'assets/items/Buildings/Pasta_Maker.webp' }
        ] 
    },
    { 
        name: 'Harvests', 
        subCategories: [
            { id: 'Crops', name: 'Crops', icon: 'assets/items/Buildings/Field.webp' },
            { id: 'Trees', name: 'Trees', icon: 'assets/items/Buildings/Apple_Tree.webp' },
            { id: 'Bushes', name: 'Bushes', icon: 'assets/items/Buildings/Blackberry_Bush.webp' },
			{ id: 'Dead-Tree', name: 'Dead Trees', icon: 'assets/items/Buildings/Dead_Tree.webp' }
        ] 
    },
    { 
        name: 'Artisan Crafts', 
        subCategories: [
            { id: 'Loom', name: 'Loom', icon: 'assets/items/Buildings/Loom.webp' },
            { id: 'Sewing-Machine', name: 'Sewing Machine', icon: 'assets/items/Buildings/Sewing_Machine.webp' },
            { id: 'Hat-Maker', name: 'Hat Maker', icon: 'assets/items/Buildings/Hat_Maker.webp' },
            { id: 'Smelter', name: 'Smelter', icon: 'assets/items/Buildings/Smelter.webp' },
            { id: 'Jeweler', name: 'Jeweler', icon: 'assets/items/Buildings/Jeweler.webp' },
            { id: 'Candle-Maker', name: 'Candle Maker', icon: 'assets/items/Buildings/Candle_Maker.webp' },
            { id: 'Flower-Shop', name: 'Flower Shop', icon: 'assets/items/Buildings/Flower_Shop.webp' },
            { id: 'Essential-Oils-Lab', name: 'Essential Oils Lab', icon: 'assets/items/Buildings/Essential_Oils_Lab.webp' },
            { id: 'Bath-Kiosk', name: 'Bath Kiosk', icon: 'assets/items/Buildings/Bath_Kiosk.webp' },
            { id: 'Pottery-Studio', name: 'Pottery Studio', icon: 'assets/items/Buildings/Pottery_Studio.webp' },
            { id: 'Perfumerie', name: 'Perfumerie', icon: 'assets/items/Buildings/Perfumerie.webp' }
        ] 
    },
    { 
        name: 'Expansion Materials', 
        subCategories: [
			{ id: 'Silo-Materials', name: 'Silo', icon: 'assets/items/Buildings/Silo.webp' },
            { id: 'Barn-Materials', name: 'Barn', icon: 'assets/items/Buildings/Barn.webp' },
            { id: 'Land-Materials', name: 'Land', icon: 'assets/items/Buildings/Land.webp' },
			{ id: 'Town-Materials', name: 'Town', icon: 'assets/items/Buildings/Town.webp' }
        ] 
    },
    { 
        name: 'Tools', 
        subCategories: [
			{ id: 'Tools', name: 'Tools', icon: 'assets/items/Buildings/Tools.webp' }
        ] 
    }

  ];

  // --- DOM ELEMENT SELECTORS ---
  const loadingOverlay = document.getElementById('loading-overlay');
  const ctx = document.getElementById('inventoryChart').getContext('2d');
  const imgCache = {};
  const statTotalItemsEl = document.getElementById('stat-total-items');
  const statLowStockEl = document.getElementById('stat-low-stock');
  const totalItemsCard = document.getElementById('total-items-card');
  const lowStockCard = document.getElementById('low-stock-card');
  const pages = document.querySelectorAll('.page');
  const menuBtn = document.getElementById('menu-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarProfileList = document.getElementById('sidebar-profile-list');
  const addProfileBtn = document.getElementById('add-profile-btn');
  const accountsListEl = document.getElementById('accounts-list');
  const masterCategoryHeaderEl = document.getElementById('master-category-header');
  const inventorySubcategorySelectorEl = document.getElementById('inventory-subcategory-selector');
  const inventoryDisplayAreaEl = document.getElementById('inventory-display-area');
  const inventorySearchEl = document.getElementById('inventory-search');
  const profileInfoCardEl = document.getElementById('profile-info-card');
  const restockGridEl = document.getElementById('restock-grid');
  const sellGridEl = document.getElementById('sell-grid');
  const restockActionsEl = document.getElementById('restock-actions');
  const sellActionsEl = document.getElementById('sell-actions');
  const orderGridEl = document.getElementById('order-grid');
  const orderActionsEl = document.getElementById('order-actions');
  const pendingOrdersContainer = document.getElementById('pending-orders-container');
  const pendingOrdersList = document.getElementById('pending-orders-list');
  const itemSelectionModal = document.getElementById('item-selection-modal-overlay');
  const itemSelectionModalTitle = document.getElementById('item-selection-modal-title');
  const itemSelectionGrid = document.getElementById('item-selection-grid');
  const itemSelectionSearch = document.getElementById('item-selection-search');
  const buildingSelectionModal = document.getElementById('building-selection-modal-overlay');
  const buildingSelectionModalGrid = document.getElementById('building-selection-modal-grid');
  const buildingSelectionSearch = document.getElementById('building-selection-search');
  const qtySelectionModal = document.getElementById('quantity-selection-modal-overlay');
  const qtySelectionContent = document.getElementById('quantity-selection-modal-content');
  const itemUpdateModal = document.getElementById('item-update-modal-overlay');
  const itemUpdateContent = document.getElementById('item-update-modal-content');
  const screenshotOrderModal = document.getElementById('screenshot-order-modal-overlay');
  const screenshotOrderContent = document.getElementById('screenshot-order-modal-content');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalInputsContainer = document.getElementById('modal-inputs-container');
  const modalInputName = document.getElementById('modal-input-name');
  const modalInputEmail = document.getElementById('modal-input-email');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const createOrderNavBtn = document.querySelector('[data-page="page-create-order"]');
  const headerProfileIconContainer = document.getElementById('header-profile-icon-container');
  
  // Filter Selectors
  const sellerDashboardToggle = document.getElementById('seller-dashboard-toggle');
  const levelFilterToggle = document.getElementById('level-filter-toggle');
  const levelInputContainer = document.getElementById('level-input-container');
  const levelInputMin = document.getElementById('level-input-min');
  const levelInputMax = document.getElementById('level-input-max');
  const buildingFilterToggle = document.getElementById('building-filter-toggle');
  const buildingInputContainer = document.getElementById('building-input-container');
  const selectedBuildingsContainer = document.getElementById('selected-buildings-container');
  
  // Trade Selectors
  const tradeMyItemsGridEl = document.getElementById('trade-my-items-grid');
  const tradeYourItemsGridEl = document.getElementById('trade-your-items-grid');
  const tradeActionsEl = document.getElementById('trade-actions');
  const pendingTradesContainer = document.getElementById('pending-trades-container');
  const pendingTradesList = document.getElementById('pending-trades-list');
  
  // PFP Cropper Selectors
  const pfpUploadInput = document.getElementById('pfp-upload-input');
  const pfpCropperModal = document.getElementById('pfp-cropper-modal-overlay');
  const pfpCropperImage = document.getElementById('pfp-cropper-image');
  const pfpCropperConfirmBtn = document.getElementById('pfp-cropper-confirm-btn');
  const pfpCropperCancelBtn = document.getElementById('pfp-cropper-cancel-btn');


  // --- STATE VARIABLES ---
  let inventoryByProfile = {};
  let profiles = [];
  let filtersByProfile = {};
  let currentProfileId = null;
  let baseInventory = [];
  let inventory = [];
  let chart;
  let currentMasterCategoryIndex = 0;
  let selectedSubCategory = null;
  let isAnimatingCategory = false;
  let chartFilterMode = 'top';
  let restockCart = [];
  let sellCart = [];
  let orderCart = [];
  let tradeCart = { myItems: [], yourItems: [] };
  let pendingOrders = [];
  let pendingTrades = [];
  let currentTransactionType = 'restock';
  let currentTradeSide = 'myItems';
  let qtyInterval = null;
  let searchDebounceTimeout;
  let virtualScroller = null;
  let cropper = null;


  // --- UTILITY FUNCTIONS ---
  function debounce(func, delay) {
      return function(...args) {
          clearTimeout(searchDebounceTimeout);
          searchDebounceTimeout = setTimeout(() => func.apply(this, args), delay);
      };
  }

  function formatCurrency(amount) {
    return `Rp. ${amount.toLocaleString('id-ID')}`;
  }
  
  // --- FILTERING LOGIC ---
  function getFilteredInventory() {
      const searchTerm = inventorySearchEl.value.toLowerCase().trim();
      
      const filters = (currentProfileId && filtersByProfile[currentProfileId]) 
                              ? filtersByProfile[currentProfileId] 
                              : { level: { active: false }, building: { active: false, selected: [] }, sellerDashboard: { active: false } };
      const levelSettings = filters.level;
      const buildingSettings = filters.building;

      return inventory.filter(item => {
          const searchMatch = searchTerm ? item.name.toLowerCase().includes(searchTerm) : true;
          
          const levelMatch = !levelSettings.active || (item.level >= levelSettings.min && item.level <= levelSettings.max);
          
          const buildingMatch = !buildingSettings.active || buildingSettings.selected.length === 0 || buildingSettings.selected.includes(item.category);
          
          if (searchTerm) {
              return searchMatch;
          } else {
              const categoryMatch = selectedSubCategory ? item.category === selectedSubCategory : true;
              return categoryMatch && levelMatch && buildingMatch;
          }
      });
  }


  // --- NAVIGATION & UI ---
  function showPage(pageId) {
    if ((pageId === 'page-profile' || pageId === 'page-transactions' || pageId === 'page-create-order') && !currentProfileId) {
        showCreateProfilePrompt();
        return;
    }
    
    document.querySelector('.app-container').style.overflowY = (pageId === 'page-inventory') ? 'hidden' : 'auto';

    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId)?.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageId)
    });
  }

  function toggleSidebar() {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('show');
  }
  
  function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = (isError ? '⚠️ ' : '✨ ') + msg;
    t.classList.toggle('error', isError);
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // --- MODALS (Generic & Confirmation) ---
  function showProfileModal(options) {
      document.body.classList.add('modal-active');
      modalTitle.textContent = options.title;
      modalMessage.innerHTML = options.message;
      modalConfirmBtn.textContent = options.confirmText || 'Confirm';

      const singleInputContainer = document.getElementById('modal-single-input-container');
      const singleInput = document.getElementById('modal-input-single');
      
      if (options.inputType === 'single') {
          modalInputsContainer.style.display = 'none';
          singleInputContainer.style.display = 'block';
          singleInput.value = options.value || '';
          singleInput.placeholder = options.placeholder || '';
      } else {
          singleInputContainer.style.display = 'none';
          const showInputs = options.showInputs !== false; 
          modalInputsContainer.style.display = showInputs ? 'block' : 'none';
          if (showInputs) {
            modalInputName.value = options.name || '';
            modalInputName.placeholder = 'Profile Name';
            modalInputEmail.value = options.email || '';
            modalInputEmail.placeholder = 'email@example.com';
          }
      }

      modalOverlay.classList.remove('hidden');

      const confirmHandler = () => {
        if(options.onConfirm) {
            let confirmData;
            if (options.inputType === 'single') {
                confirmData = singleInput.value;
            } else {
                confirmData = options.showInputs !== false ? { name: modalInputName.value, email: modalInputEmail.value } : {};
            }
            options.onConfirm(confirmData);
        }
        hideModal();
      };

      const cancelHandler = () => {
        if (options.onCancel) options.onCancel();
        hideModal();
      };
      
      modalConfirmBtn.onclick = confirmHandler;
      modalCancelBtn.onclick = cancelHandler;
      modalOverlay.onclick = (e) => {
          if (e.target === modalOverlay) cancelHandler();
      };
      
      if (options.inputType === 'single') {
          singleInput.focus();
          singleInput.onkeydown = (e) => {
              if (e.key === 'Enter') {
                  e.preventDefault();
                  confirmHandler();
              }
          };
      }
  }

  function hideModal() {
      document.body.classList.remove('modal-active');
      modalOverlay.classList.add('hidden');
  }

  function showConfirmationModal(options) {
    showProfileModal({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Continue',
        cancelText: 'Cancel',
        showInputs: false,
        onConfirm: options.onConfirm
    });
  }

  function showCreateProfilePrompt() {
      showConfirmationModal({
          title: 'Create a Profile',
          message: 'To manage your inventory and track items, you need to create a profile first.',
          confirmText: 'Create Profile',
          onConfirm: () => toggleSidebar()
      });
  }

  // --- DATA MANAGEMENT ---
  function migrateData() {
      let oldProfiles = JSON.parse(localStorage.getItem('profiles'));
      if (oldProfiles && oldProfiles.length > 0 && typeof oldProfiles[0] === 'string') {
          const newProfiles = oldProfiles.map(name => ({ id: crypto.randomUUID(), name: name, email: '' }));
          const newInventory = {};
          const newFilters = {};
          let newCurrentProfileId = null;
          
          newProfiles.forEach(p => {
              const oldInv = JSON.parse(localStorage.getItem('inventoryByProfile') || '{}')[p.name];
              if (oldInv) newInventory[p.id] = oldInv;

              const oldLevels = JSON.parse(localStorage.getItem('levelsByProfile') || '{}')[p.name];
              newFilters[p.id] = {
                  level: { active: false, min: 0, max: 130 },
                  building: { active: false, selected: [] },
                  sellerDashboard: { active: false }
              };
              if (Array.isArray(oldLevels)) {
                  newFilters[p.id].level.min = oldLevels[0];
                  newFilters[p.id].level.max = oldLevels[1];
              } else if (oldLevels && typeof oldLevels === 'object') {
                  newFilters[p.id].level = oldLevels;
              }

              if (p.name === localStorage.getItem('currentProfile')) newCurrentProfileId = p.id;
          });

          localStorage.setItem('profiles', JSON.stringify(newProfiles));
          localStorage.setItem('inventoryByProfile', JSON.stringify(newInventory));
          localStorage.setItem('filtersByProfile', JSON.stringify(newFilters));
          localStorage.setItem('currentProfileId', newCurrentProfileId || (newProfiles[0]?.id || null));
          
          localStorage.removeItem('levelsByProfile');
          localStorage.removeItem('currentProfile');
      }
  }

  function loadData() {
      migrateData();
      profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      inventoryByProfile = JSON.parse(localStorage.getItem('inventoryByProfile') || '{}');
      filtersByProfile = JSON.parse(localStorage.getItem('filtersByProfile') || '{}');
      currentProfileId = localStorage.getItem('currentProfileId');
      pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
      pendingTrades = JSON.parse(localStorage.getItem('pendingTrades') || '[]');

      if (profiles.length > 0) {
          let needsSave = false;
          profiles.forEach((p, index) => {
              if (!p.hasOwnProperty('pfpDataUrl')) {
                  p.pfpDataUrl = null;
                  needsSave = true;
              }
              if (!p.hasOwnProperty('pfpId')) {
                  p.pfpId = (index % 6) + 1;
                  needsSave = true;
              }
              if (!p.hasOwnProperty('gameTag')) {
                  p.gameTag = '#EDIT_YOUR_TAG';
                  needsSave = true;
              }
              
              if (!filtersByProfile[p.id]) {
                  filtersByProfile[p.id] = {
                      level: { active: false, min: 0, max: 130 },
                      building: { active: false, selected: [] },
                      sellerDashboard: { active: false }
                  };
                  needsSave = true;
              } else {
                  if (!filtersByProfile[p.id].level) {
                      filtersByProfile[p.id].level = { active: false, min: 0, max: 130 };
                      needsSave = true;
                  }
                  if (!filtersByProfile[p.id].building) {
                      filtersByProfile[p.id].building = { active: false, selected: [] };
                      needsSave = true;
                  }
                  if (!filtersByProfile[p.id].sellerDashboard) {
                      filtersByProfile[p.id].sellerDashboard = { active: false };
                      needsSave = true;
                  }
              }
          });
          if (needsSave) saveProfiles();
      }

      if (!currentProfileId || !profiles.find(p => p.id === currentProfileId)) {
          currentProfileId = profiles.length > 0 ? profiles[0].id : null;
          saveProfiles();
      }
  }

  async function loadBaseInventory() {
    let all = [];
    const allSubCategories = masterCategoryStructure.flatMap(mc => mc.subCategories);
    const uniqueSubCategories = [...new Map(allSubCategories.map(item => [item.id, item])).values()];

    for (let subCat of uniqueSubCategories) {
      try {
        const res = await fetch(`assets/items/${subCat.id}/index.json`, {cache: 'no-cache'});
        if (!res.ok) throw res.status;
        const arr = await res.json();
        arr.forEach(item => {
          if (item.enabled !== false) {
            all.push({...item, category: subCat.id, level: item.level || 0 });
          }
        });
      } catch (e) { 
        console.warn('Could not load', subCat.id, e);
      }
    }
    return all;
  }

  async function initProfileData() {
    baseInventory = await loadBaseInventory();
    baseInventory.forEach(item => {
      if (!imgCache[item.name]) {
        const im = new Image();
        im.src = item.src;
        imgCache[item.name] = im;
      }
    });
    profiles.forEach(p => {
      const exist = inventoryByProfile[p.id] || [];
      inventoryByProfile[p.id] = baseInventory.map(item => {
        const f = exist.find(e => e.name === item.name && e.category === item.category);
        return {...item, qty: f ? f.qty : 0, price: f ? f.price : 0 };
      });
    });
    saveProfiles();
  }

  function saveProfiles() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('inventoryByProfile', JSON.stringify(inventoryByProfile));
    localStorage.setItem('filtersByProfile', JSON.stringify(filtersByProfile));
    localStorage.setItem('currentProfileId', currentProfileId);
    localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
    localStorage.setItem('pendingTrades', JSON.stringify(pendingTrades));
  }

  function switchProfile(profileId) {
    currentProfileId = profileId;
    inventory = inventoryByProfile[currentProfileId] || baseInventory.map(i => ({...i, qty: 0, price: 0}));
    restockCart = [];
    sellCart = [];
    orderCart = [];
    tradeCart = { myItems: [], yourItems: [] };
    pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    pendingTrades = JSON.parse(localStorage.getItem('pendingTrades') || '[]');
    saveProfiles();
    renderAll();
    inventorySearchEl.value = '';
  }

  // --- RENDERING FUNCTIONS ---

  function renderAll() {
      renderHeaderProfileIcon(); // New function call
      renderProfiles();
      renderAccountsList();
      renderMasterCategoryHeader();
      renderInventoryPage();
      renderTransactionsPage(); 
      renderCreateOrderPage();
      renderPendingOrders();
      renderPendingTrades();
      renderProfilePage();
      renderSellerDashboardToggle();
      renderLevelFilter();
      renderBuildingFilter();
      renderBottomNav();
      updateChart();
      updateStats();
      updateStatCardStyles();
  }

  function renderHeaderProfileIcon() {
    const currentProfile = profiles.find(p => p.id === currentProfileId);
    if (currentProfile) {
        const pfpSrc = currentProfile.pfpDataUrl || `assets/items/pfp/${currentProfile.pfpId}.png`;
        headerProfileIconContainer.innerHTML = `
            <img src="${pfpSrc}" alt="${currentProfile.name}" class="header-pfp">
        `;
    } else {
        headerProfileIconContainer.innerHTML = `
            <div class="header-pfp-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
        `;
    }
  }

  function renderBottomNav() {
    if (!currentProfileId) {
        createOrderNavBtn.classList.add('hidden');
        return;
    }
    const sellerModeActive = filtersByProfile[currentProfileId].sellerDashboard.active;
    createOrderNavBtn.classList.toggle('hidden', !sellerModeActive);
  }

  function renderProfiles() {
    sidebarProfileList.innerHTML = '';
    profiles.forEach((p) => {
        const pfpSrc = p.pfpDataUrl || `assets/items/pfp/${p.pfpId}.png`;
        const li = document.createElement('li');
        li.className = 'sidebar-profile-item';
        li.innerHTML = `
            <div class="sidebar-profile-info" data-id="${p.id}">
                <img src="${pfpSrc}" alt="${p.name}">
                <div>
                    <div>${p.name}</div>
                    <div class="email">${p.email || 'No email'}</div>
                </div>
            </div>
            <div class="flex items-center gap-2 text-gray-400">
                <button class="p-1 hover:text-purple-500" data-action="edit" data-id="${p.id}" title="Edit Profile">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                </button>
                ${profiles.length > 1 ? `<button class="p-1 hover:text-pink-500" data-action="delete" data-id="${p.id}" title="Delete Profile">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                </button>` : ''}
            </div>
        `;
        sidebarProfileList.appendChild(li);
    });
  }
  
  function renderAccountsList() {
      accountsListEl.innerHTML = profiles.map(p => {
          const isActive = p.id === currentProfileId;
          const pfpSrc = p.pfpDataUrl || `assets/items/pfp/${p.pfpId}.png`;
          return `
            <div class="account-item ${isActive ? 'active' : ''}" data-id="${p.id}">
              <img src="${pfpSrc}" alt="${p.name}">
              <div class="account-item-info">
                <div class="name">${p.name}</div>
                <div class="email">${p.email || 'No email provided'}</div>
              </div>
            </div>`;
      }).join('') + `
        <div class="add-account-card" id="add-account-card">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
            <span>Add Profile</span>
        </div>
      `;

      document.querySelectorAll('.account-item').forEach(el => {
        el.onclick = () => switchProfile(el.dataset.id);
      });
      document.getElementById('add-account-card').onclick = () => toggleSidebar();
  }

  function renderMasterCategoryHeader() {
    masterCategoryHeaderEl.innerHTML = `
        <button class="px-2 text-3xl font-bold text-gray-300 hover:text-pink-500 transition-colors" data-direction="-1">‹</button>
        <span id="master-category-title">${masterCategoryStructure[currentMasterCategoryIndex].name}</span>
        <button class="px-2 text-3xl font-bold text-gray-300 hover:text-pink-500 transition-colors" data-direction="1">›</button>
    `;
  }

  function createVirtualScroller(container, allItems, renderItem, options) {
      const { itemHeight, itemWidth, gap } = options;
      
      container.innerHTML = `
          <div class="virtual-scroll-viewport">
              <div class="virtual-scroll-sizer">
                  <div class="virtual-scroll-content">
                      <div id="inventory-item-grid"></div>
                  </div>
              </div>
          </div>
      `;
      
      const viewport = container.querySelector('.virtual-scroll-viewport');
      const sizer = container.querySelector('.virtual-scroll-sizer');
      const content = container.querySelector('.virtual-scroll-content');
      const grid = container.querySelector('#inventory-item-grid');

      let items = allItems;
      let columns = 1;

      function update() {
          const viewportWidth = viewport.clientWidth;
          columns = Math.max(1, Math.floor((viewportWidth + gap) / (itemWidth + gap)));
          grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

          const rowCount = Math.ceil(items.length / columns);
          const totalHeight = rowCount * (itemHeight + gap);
          sizer.style.height = `${totalHeight}px`;

          render();
      }

      function render() {
          const scrollTop = viewport.scrollTop;
          const viewportHeight = viewport.clientHeight;

          const startIndex = Math.floor(scrollTop / (itemHeight + gap)) * columns;
          const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + viewportHeight) / (itemHeight + gap)) * columns);
          
          const paddingTop = Math.floor(startIndex / columns) * (itemHeight + gap);
          content.style.transform = `translateY(${paddingTop}px)`;
          
          let html = '';
          for (let i = startIndex; i <= endIndex; i++) {
              if (items[i]) {
                  html += renderItem(items[i]);
              }
          }
          grid.innerHTML = html;
      }

      viewport.addEventListener('scroll', () => window.requestAnimationFrame(render));
      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(viewport);

      update();

      return {
          updateItems: (newItems) => {
              items = newItems;
              update();
          },
          destroy: () => {
              viewport.removeEventListener('scroll', render);
              resizeObserver.disconnect();
              container.innerHTML = '';
          }
      };
  }

  function renderInventoryPage() {
    if (isAnimatingCategory) return;
    isAnimatingCategory = true;
    
    if (virtualScroller) {
        virtualScroller.destroy();
        virtualScroller = null;
    }

    inventorySubcategorySelectorEl.classList.add('fade-out');
    inventoryDisplayAreaEl.classList.add('fade-out');
    
    setTimeout(() => {
        const searchTerm = inventorySearchEl.value.toLowerCase().trim();
        const filters = (currentProfileId && filtersByProfile[currentProfileId]) 
                                ? filtersByProfile[currentProfileId] 
                                : { level: { active: false }, building: { active: false, selected: [] } };
        const levelSettings = filters.level;
        const buildingSettings = filters.building;

        if (searchTerm) {
            masterCategoryHeaderEl.style.display = 'none';
            inventorySubcategorySelectorEl.style.display = 'none';
            
            const itemsToRender = getFilteredInventory();
            if (itemsToRender.length > 0) {
                 virtualScroller = createVirtualScroller(inventoryDisplayAreaEl, itemsToRender, createItemCard, { itemHeight: 154, itemWidth: 120, gap: 16 });
            } else {
                 inventoryDisplayAreaEl.innerHTML = `<p class="text-center text-gray-500 col-span-full">No items found.</p>`;
            }

        } else {
            masterCategoryHeaderEl.style.display = 'flex';
            inventorySubcategorySelectorEl.style.display = 'flex';
            
            const currentMC = masterCategoryStructure[currentMasterCategoryIndex];
            
            let visibleSubcategories = currentMC.subCategories.filter(sc => {
                const levelMatch = !levelSettings.active || inventory.some(item => 
                    item.category === sc.id && 
                    item.level >= levelSettings.min && 
                    item.level <= levelSettings.max
                );
                const buildingMatch = !buildingSettings.active || buildingSettings.selected.length === 0 || buildingSettings.selected.includes(sc.id);
                
                return levelMatch && buildingMatch;
            });

            if (selectedSubCategory && !visibleSubcategories.some(sc => sc.id === selectedSubCategory)) {
                selectedSubCategory = null;
            }

            inventorySubcategorySelectorEl.innerHTML = visibleSubcategories.map(sc => `
                <div class="subcategory-tab ${selectedSubCategory === sc.id ? 'active' : ''}" data-id="${sc.id}">
                    <div class="subcategory-tab-icon"><img src="${sc.icon}" alt="${sc.name}"></div>
                    <div class="subcategory-tab-name">${sc.name}</div>
                </div>
            `).join('');
            
            const itemsToRender = getFilteredInventory();

			if (selectedSubCategory) {
				const itemsToRender = getFilteredInventory();
				if (itemsToRender.length > 0) {
				inventoryDisplayAreaEl.innerHTML = `
				<div id="inventory-item-grid">
                ${itemsToRender.map(createItemCard).join('')}
				</div>
			`;
				} else {
						inventoryDisplayAreaEl.innerHTML = `<p class="text-center text-gray-500 col-span-full p-4">No items match the current filters.</p>`;
				}

				} else {

                inventoryDisplayAreaEl.innerHTML = visibleSubcategories.map(sc => {
                    const items = itemsToRender.filter(i => i.category === sc.id);
                    if (items.length === 0) return '';
                    
                    return `
                        <div class="category-section">
                            <h3 class="category-title">${sc.name}</h3>
                            <div class="items-scroll-container">${items.map(createItemCard).join('')}</div>
                        </div>`;
                }).join('');

                if (inventoryDisplayAreaEl.innerHTML.trim() === '') {
                     inventoryDisplayAreaEl.innerHTML = `<p class="text-center text-gray-500 col-span-full p-4">No items or buildings match the current filters.</p>`;
                }
            }
        }

        inventorySubcategorySelectorEl.classList.remove('fade-out');
        inventoryDisplayAreaEl.classList.remove('fade-out');
        isAnimatingCategory = false;
    }, 200);
  }


  function createItemCard(item) {
    const filters = (currentProfileId && filtersByProfile[currentProfileId]) ? filtersByProfile[currentProfileId] : {};
    const sellerModeActive = filters.sellerDashboard && filters.sellerDashboard.active;
    const priceDisplay = sellerModeActive ? `<div class="price">Price: ${item.price || 0}</div>` : '';

    return `
        <div class="inventory-item-card" data-name="${item.name}" data-context="inventory-page">
            <img src="${item.src}" alt="${item.name}" loading="lazy" width="100" height="100">
            <div class="name">${item.name}</div>
            <div class="qty">In Stock: ${item.qty || 0}</div>
            ${priceDisplay}
        </div>`;
  }

  function renderTransactionsPage() {
    if (!currentProfileId) {
        restockGridEl.innerHTML = createAddItemCard('restock');
        sellGridEl.innerHTML = createAddItemCard('sell');
        tradeMyItemsGridEl.innerHTML = createAddItemCard('trade', 'myItems');
        tradeYourItemsGridEl.innerHTML = createAddItemCard('trade', 'yourItems');
        restockActionsEl.classList.add('hidden');
        sellActionsEl.classList.add('hidden');
        tradeActionsEl.classList.add('hidden');
        return;
    }
    
    restockGridEl.innerHTML = restockCart.map(item => createStagedItemCard(item, 'restock')).join('') + createAddItemCard('restock');
    restockActionsEl.classList.toggle('hidden', restockCart.length === 0);

    sellGridEl.innerHTML = sellCart.map(item => createStagedItemCard(item, 'sell')).join('') + createAddItemCard('sell');
    sellActionsEl.classList.toggle('hidden', sellCart.length === 0);
    
    tradeMyItemsGridEl.innerHTML = tradeCart.myItems.map(item => createStagedItemCard(item, 'trade', 'myItems')).join('') + createAddItemCard('trade', 'myItems');
    tradeYourItemsGridEl.innerHTML = tradeCart.yourItems.map(item => createStagedItemCard(item, 'trade', 'yourItems')).join('') + createAddItemCard('trade', 'yourItems');
    tradeActionsEl.classList.toggle('hidden', tradeCart.myItems.length === 0 && tradeCart.yourItems.length === 0);
  }

  function renderCreateOrderPage() {
    if (!currentProfileId) {
        orderGridEl.innerHTML = createAddItemCard('order');
        orderActionsEl.classList.add('hidden');
        return;
    }
    
    orderGridEl.innerHTML = orderCart.map(item => createStagedItemCard(item, 'order')).join('') + createAddItemCard('order');
    
    if (orderCart.length > 0) {
        orderActionsEl.innerHTML = `
            <button class="action-cancel-btn" data-action="cancel-order">Clear List</button>
            <button class="action-process-btn" data-action="process-order">Process Order</button>
        `;
        orderActionsEl.classList.remove('hidden');
    } else {
        orderActionsEl.classList.add('hidden');
    }
  }
  
  function renderPendingOrders() {
      if (!currentProfileId) {
          pendingOrdersContainer.classList.add('hidden');
          return;
      }

      if (pendingOrders.length > 0) {
          pendingOrdersContainer.classList.remove('hidden');
          pendingOrdersList.innerHTML = pendingOrders.map((order, index) => {
              const orderDate = new Date(order.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              const firstItem = order.items[0];
              const totalItems = order.items.length;

              const iconHtml = `
                <div class="relative w-12 h-12 flex-shrink-0">
                    <img src="${firstItem.src}" alt="${firstItem.name}" class="w-full h-full rounded-lg object-contain bg-white/80 border-2 border-white shadow-sm">
                    ${totalItems > 1 ? `
                        <div class="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow">
                            ${totalItems}
                        </div>
                    ` : ''}
                </div>
              `;

              return `
                  <div class="card p-4">
                      <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center gap-3">
                              ${iconHtml}
                              <div>
                                  <div class="font-semibold" style="color: var(--color-text-body);">Order #${index + 1}</div>
                                  <div class="text-sm" style="color: var(--color-text-subtle);">${totalItems} items &bull; ${orderDate}</div>
                              </div>
                          </div>
                      </div>
                      <div class="flex flex-wrap justify-end gap-2">
                           <button class="modal-cancel-btn !p-2 !px-3 flex items-center gap-1" data-order-id="${order.id}" data-action="delete-order" title="Delete Order">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Delete</span>
                          </button>
                          <button class="p-2 px-3 rounded-full hover:bg-purple-100 text-purple-500 border border-purple-200 flex items-center gap-1" data-order-id="${order.id}" data-action="edit-order" title="Edit Order">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Edit</span>
                          </button>
                          <button class="p-2 px-3 rounded-full hover:bg-pink-100 text-pink-500 border border-pink-200 flex items-center gap-1" data-order-id="${order.id}" data-action="view-order-screenshot" title="View for Screenshot">
                               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                               <span class="text-sm font-semibold">View List</span>
                          </button>
                          <button class="modal-confirm-btn !p-2 !px-3 flex items-center gap-1" data-order-id="${order.id}" data-action="fulfill-order" title="Fulfill Order">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Complete Order</span>
                          </button>
                      </div>
                  </div>
              `;
          }).join('');
      } else {
          pendingOrdersContainer.classList.add('hidden');
          pendingOrdersList.innerHTML = '';
      }
  }
  
  function renderPendingTrades() {
      if (!currentProfileId) {
          pendingTradesContainer.classList.add('hidden');
          return;
      }

      if (pendingTrades.length > 0) {
          pendingTradesContainer.classList.remove('hidden');
          pendingTradesList.innerHTML = pendingTrades.map((trade, index) => {
              const tradeDate = new Date(trade.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const myFirstItem = trade.myItems[0];
              const yourFirstItem = trade.yourItems[0];

              const iconHtml = `
                <div class="relative w-24 h-12 flex-shrink-0 flex items-center">
                    <img src="${myFirstItem.src}" alt="${myFirstItem.name}" class="w-12 h-12 rounded-lg object-contain bg-red-100/80 border-2 border-white shadow-sm z-10">
                    <svg class="w-8 h-8 text-gray-400 absolute left-1/2 -translate-x-1/2 z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h.01M12 7h.01M16 7h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <img src="${yourFirstItem.src}" alt="${yourFirstItem.name}" class="w-12 h-12 rounded-lg object-contain bg-green-100/80 border-2 border-white shadow-sm -ml-4 z-0">
                </div>
              `;

              return `
                  <div class="card p-4">
                      <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center gap-3">
                              ${iconHtml}
                              <div>
                                  <div class="font-semibold" style="color: var(--color-text-body);">Trade #${index + 1}</div>
                                  <div class="text-sm" style="color: var(--color-text-subtle);">${trade.myItems.length} for ${trade.yourItems.length} items &bull; ${tradeDate}</div>
                              </div>
                          </div>
                      </div>
                      <div class="flex flex-wrap justify-end gap-2">
                           <button class="modal-cancel-btn !p-2 !px-3 flex items-center gap-1" data-trade-id="${trade.id}" data-action="delete-trade" title="Delete Trade">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Delete</span>
                          </button>
                          <button class="p-2 px-3 rounded-full hover:bg-purple-100 text-purple-500 border border-purple-200 flex items-center gap-1" data-trade-id="${trade.id}" data-action="edit-trade" title="Edit Trade">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Edit</span>
                          </button>
                          <button class="p-2 px-3 rounded-full hover:bg-pink-100 text-pink-500 border border-pink-200 flex items-center gap-1" data-trade-id="${trade.id}" data-action="view-trade-screenshot" title="View for Screenshot">
                               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                               <span class="text-sm font-semibold">View</span>
                          </button>
                          <button class="modal-confirm-btn !p-2 !px-3 flex items-center gap-1" data-trade-id="${trade.id}" data-action="complete-trade" title="Complete Trade">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                              <span class="text-sm font-semibold">Complete</span>
                          </button>
                      </div>
                  </div>
              `;
          }).join('');
      } else {
          pendingTradesContainer.classList.add('hidden');
          pendingTradesList.innerHTML = '';
      }
  }


  function renderProfilePage() {
    const currentProfile = profiles.find(p => p.id === currentProfileId);
    if (!currentProfile) {
        profileInfoCardEl.innerHTML = '<p class="text-center text-gray-500">No profile selected. Create one from the menu.</p>';
        return;
    };

    const pfpSrc = currentProfile.pfpDataUrl || `assets/items/pfp/${currentProfile.pfpId}.png`;

    profileInfoCardEl.innerHTML = `
        <button id="profile-pfp-container" title="Change profile picture">
            <img src="${pfpSrc}" alt="${currentProfile.name}" class="pfp-image">
            <div class="pfp-edit-overlay">
                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
            </div>
        </button>
        <div class="info-container">
            <div class="name">${currentProfile.name}</div>
            <div class="email">${currentProfile.email || 'No email provided'}</div>
            <div class="profile-gametag-container">
                <span id="profile-game-tag-text">${currentProfile.gameTag}</span>
                <div class="profile-gametag-actions">
                    <button id="copy-tag-btn" title="Copy Tag">
                        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M15 1H5a2 2 0 00-2 2v11h2V3h10V1zM11 5H3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2zm0 13H3V7h8v11z"></path></svg>
                    </button>
                    <button id="edit-tag-btn" title="Edit Tag">
                       <svg fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        </div>`;
  }

  function renderSellerDashboardToggle() {
    if (!currentProfileId) return;
    const settings = filtersByProfile[currentProfileId].sellerDashboard;
    sellerDashboardToggle.checked = settings.active;
  }

  function renderLevelFilter() {
    if (!currentProfileId) return;
    const settings = filtersByProfile[currentProfileId].level;
    
    levelFilterToggle.checked = settings.active;
    levelInputMin.value = settings.min;
    levelInputMax.value = settings.max;
    levelInputContainer.classList.toggle('inactive', !settings.active);
  }

  function renderBuildingFilter() {
    if (!currentProfileId) return;
    const settings = filtersByProfile[currentProfileId].building;
    const allBuildings = masterCategoryStructure.flatMap(mc => mc.subCategories);

    buildingFilterToggle.checked = settings.active;
    buildingInputContainer.classList.toggle('inactive', !settings.active);

    selectedBuildingsContainer.innerHTML = settings.selected.map(buildingId => {
        const building = allBuildings.find(b => b.id === buildingId);
        if (!building) return '';
        return `
            <div class="selected-building-card">
                <button class="remove-building-btn" data-id="${building.id}">&times;</button>
                <img src="${building.icon}" alt="${building.name}">
                <div class="name">${building.name}</div>
            </div>
        `;
    }).join('') + `
        <div class="add-building-card" data-action="add-building">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
            <span>Add</span>
        </div>
    `;
  }

  function renderBuildingSelectionModalGrid(searchTerm = '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
      const allBuildings = masterCategoryStructure.flatMap(mc => mc.subCategories);
      const uniqueBuildings = [...new Map(allBuildings.map(b => [b.id, b])).values()];
      
      const selected = filtersByProfile[currentProfileId].building.selected;

      const buildingsToShow = uniqueBuildings.filter(b => 
          !selected.includes(b.id) &&
          b.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      
      buildingSelectionModalGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';

      buildingSelectionModalGrid.innerHTML = buildingsToShow.map(b => `
        <div class="inventory-item-card selection-item-card" data-id="${b.id}" data-context="building-selection">
            <div class="item-content">
                <img src="${b.icon}" alt="${b.name}">
                <div class="name">${b.name}</div>
            </div>
        </div>`).join('') || `<p class="col-span-full text-center text-gray-500">No buildings found.</p>`;
  }

  function createAddItemCard(type, tradeSide = '') {
    return `
        <div class="add-item-card" data-type="${type}" data-trade-side="${tradeSide}">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
            <span>Add Item</span>
        </div>`;
  }

  function createStagedItemCard(item, type, tradeSide = '') {
      const qtyDisplay = (type === 'restock') ? `+${item.changeQty}` : `-${item.changeQty}`;
      const priceDisplay = (type === 'order' && item.price > 0) 
        ? `<div class="price">${formatCurrency(item.price * item.changeQty)}</div>` 
        : '';
      const tradeQtyDisplay = (tradeSide === 'myItems') ? `-${item.changeQty}` : `+${item.changeQty}`;
      const tradeSideClass = type === 'trade' ? tradeSide : '';

      return `
        <div class="staged-item-card ${type} ${tradeSideClass}">
            <button class="staged-item-remove-btn" data-name="${item.name}" data-type="${type}" data-trade-side="${tradeSide}" data-action="remove-staged-item">&times;</button>
            <img src="${item.src}" alt="${item.name}" loading="lazy">
            <div class="name">${item.name}</div>
            <div class="qty">${type === 'trade' ? tradeQtyDisplay : qtyDisplay}</div>
            ${priceDisplay}
        </div>`;
  }

  // --- TRANSACTION MODALS & LOGIC ---
  function showItemSelectionModal() {
      document.body.classList.add('modal-active');
      
      if (currentTransactionType === 'trade') {
          const title = currentTradeSide === 'myItems' ? "Select Item to Offer" : "Select Item to Request";
          itemSelectionModalTitle.textContent = title;
      } else {
          itemSelectionModalTitle.textContent = "Choose an Item";
      }

      itemSelectionGrid.innerHTML = '';
      itemSelectionGrid.classList.remove('expanded');
      itemSelectionModal.classList.remove('hidden');
      itemSelectionSearch.value = '';
      itemSelectionSearch.focus();
  }

  function hideItemSelectionModal() {
      document.body.classList.remove('modal-active');
      itemSelectionModal.classList.add('hidden');
  }
  
  function showBuildingSelectionModal() {
      document.body.classList.add('modal-active');
      buildingSelectionModalGrid.innerHTML = '';
      buildingSelectionModalGrid.classList.remove('expanded');
      buildingSelectionModal.classList.remove('hidden');
      buildingSelectionSearch.value = '';
      buildingSelectionSearch.focus();
  }

  function hideBuildingSelectionModal() {
      document.body.classList.remove('modal-active');
      buildingSelectionModal.classList.add('hidden');
  }

  function renderItemSelectionGrid(searchTerm = '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
      
      let itemsToShow;
      if (currentTransactionType === 'trade' && currentTradeSide === 'yourItems') {
          itemsToShow = baseInventory.filter(item => 
              item.name.toLowerCase().includes(lowerCaseSearchTerm)
          );
      } else {
          itemsToShow = inventory.filter(item => 
              item.name.toLowerCase().includes(lowerCaseSearchTerm)
          );
      }
      
      itemSelectionGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';

      itemSelectionGrid.innerHTML = itemsToShow.map(item => {
        const isReceivingTrade = currentTransactionType === 'trade' && currentTradeSide === 'yourItems';
        const qtyDisplay = isReceivingTrade ? '' : `<div class="qty">In Stock: ${item.qty || 0}</div>`;

        return `
            <div class="inventory-item-card selection-item-card" data-name="${item.name}">
                <div class="item-content">
                    <img src="${item.src}" alt="${item.name}" loading="lazy">
                    <div class="name">${item.name}</div>
                    ${qtyDisplay}
                </div>
            </div>`;
      }).join('') || `<p class="col-span-full text-center text-gray-500">No items found.</p>`;
  }
  
  function showQuantitySelectionModal(item) {
      document.body.classList.add('modal-active');
      let verb = 'Confirm';
      if(currentTransactionType === 'restock') verb = 'Add to List';
      if(currentTransactionType === 'sell') verb = 'Add to List';
      if(currentTransactionType === 'order') verb = 'Add to Order';
      if(currentTransactionType === 'trade') {
          verb = currentTradeSide === 'myItems' ? 'Offer Item' : 'Request Item';
      }

      const currentStockText = (currentTransactionType === 'trade' && currentTradeSide === 'yourItems') 
          ? '' 
          : `<div class="text-sm text-gray-500 mb-4">Current stock: ${item.qty}</div>`;

      qtySelectionContent.innerHTML = `
        <img src="${item.src}" class="w-24 h-24 object-contain mx-auto mb-2">
        <div class="text-2xl font-bold" style="color: var(--color-text-header);">${item.name}</div>
        ${currentStockText}
        <div class="flex items-center justify-center gap-4 mb-6">
            <button id="qty-minus-btn" class="qty-btn minus">-</button>
            <input type="number" id="item-change-qty-input" value="1" min="1" pattern="\\d*" class="w-28 p-2 text-center border-2 rounded-lg text-xl font-bold focus:ring-opacity-50 focus:ring-2 outline-none" style="border-color: var(--color-border); background-color: rgba(255,255,255,0.5); focus-border-color: var(--color-primary); focus-ring-color: var(--color-primary);">
            <button id="qty-plus-btn" class="qty-btn plus">+</button>
        </div>
        <button id="item-confirm-change-btn" data-name="${item.name}" class="modal-confirm-btn w-full">${verb}</button>`;
    
    qtySelectionModal.classList.remove('hidden');
    
    const qtyInput = document.getElementById('item-change-qty-input');
    const minusBtn = document.getElementById('qty-minus-btn');
    const plusBtn = document.getElementById('qty-plus-btn');

    const changeValue = (direction) => {
      let currentVal = parseInt(qtyInput.value, 10);
      if (direction === 'plus') {
          qtyInput.value = currentVal + 1;
      } else if (direction === 'minus' && currentVal > 1) {
          qtyInput.value = currentVal - 1;
      }
    };

    const startChangingValue = (direction) => {
      changeValue(direction);
      qtyInterval = setInterval(() => changeValue(direction), 100);
    };

    const stopChangingValue = () => {
      clearInterval(qtyInterval);
    };

    ['mousedown', 'touchstart'].forEach(startEvent => {
        minusBtn.addEventListener(startEvent, (e) => { e.preventDefault(); startChangingValue('minus'); });
        plusBtn.addEventListener(startEvent, (e) => { e.preventDefault(); startChangingValue('plus'); });
    });

    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(endEvent => {
        document.addEventListener(endEvent, stopChangingValue);
    });
  }
  
  function hideQuantitySelectionModal() {
      clearInterval(qtyInterval);
      document.body.classList.remove('modal-active');
      qtySelectionModal.classList.add('hidden');
  }
  
  function showItemUpdateModal(item) {
    document.body.classList.add('modal-active');
    const filters = (currentProfileId && filtersByProfile[currentProfileId]) ? filtersByProfile[currentProfileId] : {};
    const sellerModeActive = filters.sellerDashboard && filters.sellerDashboard.active;

    let backCardContentHTML = '';

    if (sellerModeActive) {
        backCardContentHTML = `
            <div class="text-2xl font-bold" style="color: var(--color-text-header);">${item.name}</div>
            <div class="w-full my-auto mb-4">
                <div class="text-sm text-gray-500 mb-2">Enter new quantity</div>
                <div class="mb-2">
                     <input type="number" id="item-update-qty-input" value="${item.qty}" min="0" pattern="\\d*" 
                           class="w-full p-2 text-center border-2 rounded-lg text-xl font-bold focus:ring-opacity-50 focus:ring-2 outline-none" 
                           style="border-color: var(--color-border); background-color: rgba(255,255,255,0.5); focus-border-color: var(--color-primary); focus-ring-color: var(--color-primary);">
                </div>
                <div class="text-sm text-gray-500 mb-2 mt-2">Set Price</div>
                <div>
                     <input type="number" id="item-update-price-input" value="${item.price || 0}" min="0" pattern="\\d*" 
                           class="w-full p-2 text-center border-2 rounded-lg text-xl font-bold focus:ring-opacity-50 focus:ring-2 outline-none" 
                           style="border-color: var(--color-border); background-color: rgba(255,255,255,0.5); focus-border-color: var(--color-primary); focus-ring-color: var(--color-primary);">
                </div>
            </div>
            <button id="item-update-confirm-btn" data-name="${item.name}" class="modal-confirm-btn w-full">Save Changes</button>
        `;
    } else {
        backCardContentHTML = `
            <div class="text-2xl font-bold" style="color: var(--color-text-header);">${item.name}</div>
            <div class="w-full h-full flex flex-col justify-center">
                <div>
                    <div class="text-sm text-gray-500 mb-2">Enter new quantity</div>
                    <input type="number" id="item-update-qty-input" value="${item.qty}" min="0" pattern="\\d*" 
                           class="w-full p-2 text-center border-2 rounded-lg text-xl font-bold focus:ring-opacity-50 focus:ring-2 outline-none" 
                           style="border-color: var(--color-border); background-color: rgba(255,255,255,0.5); focus-border-color: var(--color-primary); focus-ring-color: var(--color-primary);">
                </div>
            </div>
            <button id="item-update-confirm-btn" data-name="${item.name}" class="modal-confirm-btn w-full">Save Changes</button>
        `;
    }

    const qtyIconHTML = item.qty > 0 ? `<div class="qty-icon">+${item.qty}</div>` : '';
    const priceDisplayHTML = sellerModeActive ? `<div class="text-sm font-semibold mb-4" style="color: var(--color-primary);">Price: ${item.price || 0}</div>` : '<div class="mb-4"></div>';

    itemUpdateContent.innerHTML = `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="image-container mx-auto mb-2">
                ${qtyIconHTML}
                <img src="${item.src}" class="w-full h-full object-contain">
            </div>
            <div class="text-2xl font-bold" style="color: var(--color-text-header);">${item.name}</div>
            <div class="text-sm text-gray-500">Current stock: ${item.qty}</div>
            ${priceDisplayHTML}
            <p class="text-xs text-gray-400 mt-auto">Tap to edit</p>
          </div>
          <div class="flip-card-back">
            ${backCardContentHTML}
          </div>
        </div>
      </div>
    `;
    itemUpdateModal.classList.remove('hidden');
    
    const flipCard = itemUpdateContent.querySelector('.flip-card');

    flipCard.addEventListener('click', (e) => {
        if (e.target.closest('input, button')) return;
        flipCard.classList.toggle('is-flipped');
    });
  }

  function hideItemUpdateModal() {
    const modalBox = itemUpdateModal.querySelector('.modal-box');
    if (modalBox) {
        modalBox.style.transition = 'opacity 0.3s ease-out';
        modalBox.style.opacity = '0';
    }
    
    setTimeout(() => {
        document.body.classList.remove('modal-active');
        itemUpdateModal.classList.add('hidden');
        if(modalBox) {
            modalBox.style.opacity = '1';
        }
    }, 300);
  }

  function showScreenshotOrderModal(order) {
    document.body.classList.add('modal-active');
    
    let contentHtml = '';
    let modalTitleText = '';

    if (order.items) { // It's a regular order
        const orderIndex = pendingOrders.findIndex(o => o.id === order.id);
        const orderNumber = orderIndex + 1;
        const orderDate = new Date(order.timestamp).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        modalTitleText = `Order #${orderNumber}`;

        const itemsHtml = order.items.map(item => {
            const itemTotal = item.price * item.changeQty;
            const priceInfo = `<div class="text-sm" style="color: var(--color-text-subtle);">${item.changeQty} x ${formatCurrency(item.price)}</div>`;
            const priceDisplay = `<div class="font-semibold text-lg text-right" style="color: var(--color-primary);">${formatCurrency(itemTotal)}</div>`;

            return `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <img src="${item.src}" alt="${item.name}" class="w-12 h-12 object-contain bg-white/50 rounded-lg p-1 flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-lg leading-tight" style="color: var(--color-text-body);">${item.name}</div>
                            ${priceInfo}
                        </div>
                    </div>
                    <div class="pl-4">${priceDisplay}</div>
                </div>
            `;
        }).join('');

        contentHtml = `
            <p class="text-sm text-gray-500 mb-6">${orderDate}</p>
            <div class="space-y-3 text-left max-h-[50vh] overflow-y-auto pr-2">${itemsHtml}</div>
            <div class="text-right font-bold text-2xl mt-4 pt-4 border-t-2 border-white/50">
                Total: ${formatCurrency(order.total)}
            </div>
        `;
    } else { // It's a trade
        modalTitleText = 'Want To Trade';

        const createTradeList = (items, title) => `
            <div class="mt-4">
                <h4 class="font-bold text-lg text-left mb-2" style="color: var(--color-text-header);">${title}</h4>
                <div class="space-y-2 text-left">
                    ${items.map(item => `
                        <div class="flex items-center gap-3">
                            <img src="${item.src}" alt="${item.name}" class="w-10 h-10 object-contain bg-white/50 rounded-lg p-1 flex-shrink-0">
                            <div>
                                <div class="font-medium">${item.name}</div>
                                <div class="text-sm text-gray-500">Qty: ${item.changeQty}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        contentHtml = `
            ${createTradeList(order.myItems, "Offering:")}
            ${createTradeList(order.yourItems, "Requesting:")}
        `;
    }

    screenshotOrderContent.innerHTML = `
        <div class="text-center p-4">
            <h3 class="text-3xl font-bold mb-2" style="color: var(--color-text-header);">${modalTitleText}</h3>
            ${contentHtml}
        </div>
    `;
    screenshotOrderModal.classList.remove('hidden');
  }


  function hideScreenshotOrderModal() {
      document.body.classList.remove('modal-active');
      screenshotOrderModal.classList.add('hidden');
  }

  function showTransactionConfirmationModal(type) {
    const cart = (type === 'restock') ? restockCart : (type === 'sell' ? sellCart : (type === 'order' ? orderCart : null));
    if (type === 'trade' && tradeCart.myItems.length === 0 && tradeCart.yourItems.length === 0) return;
    if (cart && cart.length === 0) return;

    const title = `Confirm ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let messagePreamble = `Process the following ${type}?`;
    let itemsHtml = '';
    let totalCostHtml = '';

    if (type === 'trade') {
        const createList = (items, header) => {
            if (items.length === 0) return '';
            const sideClass = header === 'Giving:' ? 'giving' : 'receiving';
            return `
                <h4 class="font-semibold text-left mt-2">${header}</h4>
                ${items.map(item => `
                    <div class="transaction-confirm-item ${type} ${sideClass}">
                        <img src="${item.src}" alt="${item.name}">
                        <div class="info"><div class="name">${item.name}</div></div>
                        <div class="qty-change">${header === 'Giving:' ? '-' : '+'}${item.changeQty}</div>
                    </div>
                `).join('')}
            `;
        };
        itemsHtml = createList(tradeCart.myItems, 'Giving:') + createList(tradeCart.yourItems, 'Receiving:');
    } else {
        let totalCost = 0;
        itemsHtml = cart.map(item => {
            const itemTotal = item.price * item.changeQty;
            if (type === 'order') totalCost += itemTotal;
            
            const priceDisplay = (type === 'order') 
                ? `<div class="font-semibold text-right" style="color: var(--color-primary);">${formatCurrency(itemTotal)}</div>` 
                : '';
            
            const qtyDisplay = type === 'restock' ? `+${item.changeQty}` : `-${item.changeQty}`;
            const priceInfo = (type === 'order') ? `<div class="text-xs text-gray-500">${item.changeQty} x ${formatCurrency(item.price)}</div>` : '';

            return `
                <div class="transaction-confirm-item ${type}">
                    <img src="${item.src}" alt="${item.name}">
                    <div class="info">
                        <div class="name">${item.name}</div>
                        ${priceInfo}
                    </div>
                    <div class="text-right">
                        ${priceDisplay}
                        <div class="qty-change">${qtyDisplay}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        if (type === 'order') {
            totalCostHtml = `<div class="text-right font-bold mt-2 pt-2 border-t border-gray-200/50">Total: ${formatCurrency(totalCost)}</div>`;
        }
    }

    const fullMessageHtml = `
        <p>${messagePreamble}</p>
        <div class="transaction-confirm-list">
            ${itemsHtml}
        </div>
        ${totalCostHtml}
    `;

    showConfirmationModal({
        title: title,
        message: fullMessageHtml,
        onConfirm: () => processTransaction(type)
    });
  }

  function processTransaction(type) {
      if (type === 'trade') {
          if (tradeCart.myItems.length === 0 || tradeCart.yourItems.length === 0) {
              showToast("Both sides of the trade must have items.", true);
              return;
          }
          const newTrade = {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              myItems: [...tradeCart.myItems],
              yourItems: [...tradeCart.yourItems],
          };
          pendingTrades.push(newTrade);
          tradeCart = { myItems: [], yourItems: [] };
          saveProfiles();
          renderAll();
          showToast(`Trade proposal sent!`);
          return;
      }

      const cart = (type === 'restock') ? restockCart : (type === 'sell' ? sellCart : orderCart);
      if (cart.length === 0) return;

      if (type === 'order') {
          const totalCost = cart.reduce((sum, item) => sum + (item.price * item.changeQty), 0);
          const newOrder = {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              items: [...cart],
              total: totalCost,
          };
          pendingOrders.push(newOrder);
          orderCart = [];
          saveProfiles();
          renderAll();
          showToast(`Order list created!`);
      } else { // for restock and sell
          cart.forEach(cartItem => {
              const masterIndex = inventory.findIndex(i => i.name === cartItem.name);
              if (masterIndex !== -1) {
                  const op = type === 'restock' ? 1 : -1;
                  inventory[masterIndex].qty = Math.max(0, inventory[masterIndex].qty + (cartItem.changeQty * op));
              }
          });

          if (type === 'restock') restockCart = [];
          else if (type === 'sell') sellCart = [];
          
          saveProfiles();
          renderAll();
          showToast(`Stock updated!`);
      }
  }

  function cancelTransaction(type) {
      const cartName = type === 'trade' ? 'Trade' : 'List';
      showConfirmationModal({
          title: `Clear ${cartName}`,
          message: `Are you sure you want to clear all items from this ${cartName.toLowerCase()}?`,
          onConfirm: () => {
              if (type === 'restock') restockCart = [];
              else if (type === 'sell') sellCart = [];
              else if (type === 'order') orderCart = [];
              else if (type === 'trade') tradeCart = { myItems: [], yourItems: [] };

              renderTransactionsPage();
              renderCreateOrderPage();
              showToast(`${cartName} cleared.`);
          }
      });
  }
  
  // --- CHART & STATS ---
  const barIconsPlugin = {
    id: 'barIcons',
    afterDatasetDraw(chart, args) {
      const {ctx} = chart;
      const meta = chart.getDatasetMeta(args.index);
      meta.data.forEach((bar, i) => {
        const img = imgCache[chart.data.labels[i]];
        if (img && img.complete) {
          const size = Math.min(bar.width, 24);
          ctx.drawImage(img, bar.x - size / 2, bar.y - size - 4, size, size);
        }
      });
    }
  };
  Chart.register(barIconsPlugin);

  function initChart() {
    chart = new Chart(ctx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Quantity', data: [], backgroundColor: [], borderWidth: 1 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        layout: { padding: { top: 30 } },
        scales: { y: { beginAtZero: true }, x: { ticks: { display: false } } }
      }
    });
  }

  function updateChart() {
    if (!chart) return;
    const getColor = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const items = [...inventory].filter(i => i.qty > 0).sort((a, b) => b.qty - a.qty);
    const lowStockItems = [...inventory].filter(i => i.qty > 0).sort((a,b) => a.qty - b.qty);
    
    const itemsToShow = chartFilterMode === 'top' ? items.slice(0, 7) : lowStockItems.slice(0, 7);
    const colors = chartFilterMode === 'top' ? Array(7).fill(getColor('--color-secondary')) : Array(7).fill(getColor('--color-primary'));

    chart.data.labels = itemsToShow.map(i => i.name);
    chart.data.datasets[0].data = itemsToShow.map(i => i.qty);
    chart.data.datasets[0].backgroundColor = colors;
    chart.update();
  }

  function updateStats() {
      statTotalItemsEl.textContent = inventory.reduce((acc, item) => acc + item.qty, 0);
      statLowStockEl.textContent = inventory.filter(item => item.qty > 0 && item.qty < 20).length;
  }
  
  function updateStatCardStyles() {
    totalItemsCard.classList.toggle('active', chartFilterMode === 'top');
    lowStockCard.classList.toggle('active', chartFilterMode === 'low');
  }
  
  // --- EVENT LISTENERS ---
  document.addEventListener('click', e => {
      if (e.target.closest('.sidebar-profile-info')) {
          switchProfile(e.target.closest('.sidebar-profile-info').dataset.id);
          toggleSidebar();
      }
      const profileActionBtn = e.target.closest('button[data-action]');
      if (profileActionBtn) {
          const id = profileActionBtn.dataset.id;
          const action = profileActionBtn.dataset.action;
          const profile = profiles.find(p => p.id === id);
          if (action === 'edit') {
              showProfileModal({
                  title: 'Edit Profile', message: `Update details for "${profile.name}".`,
                  name: profile.name, email: profile.email, confirmText: 'Update',
                  onConfirm: (data) => {
                      if (data.name) {
                          profile.name = data.name;
                          profile.email = data.email;
                          saveProfiles();
                          renderAll();
                      }
                  }
              });
          } else if (action === 'delete') {
              showConfirmationModal({
                  title: 'Delete Profile', message: `Delete "${profile.name}"? This cannot be undone.`,
                  onConfirm: () => {
                      delete inventoryByProfile[id];
                      delete filtersByProfile[id];
                      profiles = profiles.filter(x => x.id !== id);
                      if (currentProfileId === id) currentProfileId = profiles[0]?.id || null;
                      saveProfiles();
                      switchProfile(currentProfileId);
                  }
              });
          }
      }

      const editTagBtn = e.target.closest('#edit-tag-btn');
      if (editTagBtn) {
          const currentProfile = profiles.find(p => p.id === currentProfileId);
          if (currentProfile) {
              showProfileModal({
                  inputType: 'single',
                  title: 'Edit Game Tag',
                  message: 'Enter your Hay Day game tag.',
                  value: currentProfile.gameTag,
                  placeholder: '#YourTag123',
                  confirmText: 'Update',
                  onConfirm: (newTag) => {
                      if (newTag && typeof newTag === 'string') {
                          let finalTag = newTag.trim();
                          if (!finalTag.startsWith('#')) {
                              finalTag = '#' + finalTag;
                          }
                          currentProfile.gameTag = finalTag;
                          saveProfiles();
                          renderAll();
                          showToast('Game tag updated!');
                      }
                  }
              });
          }
      }

      const copyTagBtn = e.target.closest('#copy-tag-btn');
      if (copyTagBtn) {
          const tagText = document.getElementById('profile-game-tag-text')?.textContent;
          if (tagText && navigator.clipboard) {
              navigator.clipboard.writeText(tagText).then(() => {
                  showToast('Tag copied!');
              }).catch(err => {
                  console.error('Failed to copy tag: ', err);
                  showToast('Could not copy tag.', true);
              });
          }
      }

      const pfpContainer = e.target.closest('#profile-pfp-container');
      if (pfpContainer) {
          pfpUploadInput.click();
      }
      
      const catNavBtn = e.target.closest('#master-category-header button');
      if (catNavBtn) {
          if (isAnimatingCategory) return;
          currentMasterCategoryIndex = (currentMasterCategoryIndex + masterCategoryStructure.length + parseInt(catNavBtn.dataset.direction)) % masterCategoryStructure.length;
          selectedSubCategory = null;
          renderMasterCategoryHeader();
          renderInventoryPage();
      }

      const subCatTab = e.target.closest('.subcategory-tab');
      if (subCatTab) {
          selectedSubCategory = selectedSubCategory === subCatTab.dataset.id ? null : subCatTab.dataset.id;
          renderInventoryPage();
      }

      const addItemCard = e.target.closest('.add-item-card');
      if (addItemCard) {
          if (!currentProfileId) {
              showCreateProfilePrompt();
              return;
          }
          currentTransactionType = addItemCard.dataset.type;
          if (currentTransactionType === 'trade') {
              currentTradeSide = addItemCard.dataset.tradeSide;
          }
          showItemSelectionModal();
      }

      const inventoryItemCard = e.target.closest('.inventory-item-card');
      if (inventoryItemCard) {
          if (!currentProfileId) {
              showCreateProfilePrompt();
              return;
          }
          const context = inventoryItemCard.dataset.context;
          if (context === 'inventory-page') {
              const item = inventory.find(i => i.name === inventoryItemCard.dataset.name);
              if (item) showItemUpdateModal(item);
          } else if (context === 'building-selection') {
              const buildingId = inventoryItemCard.dataset.id;
              const settings = filtersByProfile[currentProfileId].building;
              if (!settings.selected.includes(buildingId)) {
                  settings.selected.push(buildingId);
                  saveProfiles();
                  renderBuildingFilter();
                  renderInventoryPage();
                  hideBuildingSelectionModal();
              }
          }
      }
      
      const selectionItemCard = e.target.closest('.selection-item-card');
      if (selectionItemCard) {
          const itemName = selectionItemCard.dataset.name;
          const item = inventory.find(i => i.name === itemName) || baseInventory.find(i => i.name === itemName);
          if (item) {
              hideItemSelectionModal();
              showQuantitySelectionModal(item);
          }
      }
      
      const confirmChangeBtn = e.target.closest('#item-confirm-change-btn');
      if (confirmChangeBtn) {
          const itemName = confirmChangeBtn.dataset.name;
          const item = inventory.find(i => i.name === itemName) || baseInventory.find(i => i.name === itemName);
          const qtyInput = document.getElementById('item-change-qty-input');
          const changeQty = parseInt(qtyInput.value);

          if (!item || isNaN(changeQty) || changeQty <= 0) {
              showToast("Please enter a valid quantity.", true); return;
          }

          const isGivingItem = (currentTransactionType === 'sell' || currentTransactionType === 'order' || (currentTransactionType === 'trade' && currentTradeSide === 'myItems'));
          if (isGivingItem && changeQty > item.qty) {
              showToast(`Not enough stock. You only have ${item.qty}.`, true); return;
          }

          let cart;
          if (currentTransactionType === 'trade') {
              cart = tradeCart[currentTradeSide];
          } else {
              cart = (currentTransactionType === 'restock') ? restockCart : (currentTransactionType === 'sell' ? sellCart : orderCart);
          }
          
          const existingItem = cart.find(i => i.name === item.name);
          if (existingItem) existingItem.changeQty += changeQty;
          else cart.push({ ...item, changeQty });
          
          hideQuantitySelectionModal();
          renderTransactionsPage();
          renderCreateOrderPage();
      }

      const confirmUpdateBtn = e.target.closest('#item-update-confirm-btn');
      if (confirmUpdateBtn) {
          const item = inventory.find(i => i.name === confirmUpdateBtn.dataset.name);
          const qtyInput = document.getElementById('item-update-qty-input');
          const priceInput = document.getElementById('item-update-price-input');
          
          const newQty = parseInt(qtyInput.value);
          const newPrice = priceInput ? parseFloat(priceInput.value) : item.price;

          if (!item || isNaN(newQty) || newQty < 0 || (priceInput && (isNaN(newPrice) || newPrice < 0))) {
              showToast("Please enter a valid quantity and value.", true); return;
          }
          
          hideItemUpdateModal();
          showConfirmationModal({
              title: 'Confirm Item Update',
              message: `Update ${item.name}?<br>Qty: ${item.qty} → ${newQty}<br>${priceInput ? `Price: ${item.price} → ${newPrice}` : ''}`,
              onConfirm: () => {
                  const masterIndex = inventoryByProfile[currentProfileId].findIndex(i => i.name === item.name);
                  if (masterIndex !== -1) {
                      inventoryByProfile[currentProfileId][masterIndex].qty = newQty;
                      inventoryByProfile[currentProfileId][masterIndex].price = newPrice;
                  }
                  inventory = inventoryByProfile[currentProfileId];
                  saveProfiles();
                  renderAll();
                  showToast(`${item.name} updated!`);
              }
          });
      }
      
      const transactionBtn = e.target.closest('.transaction-actions button');
      if(transactionBtn) {
          const action = transactionBtn.dataset.action;
          if (action === 'process-restock') showTransactionConfirmationModal('restock');
          else if (action === 'cancel-restock') cancelTransaction('restock');
          else if (action === 'process-sell') showTransactionConfirmationModal('sell');
          else if (action === 'cancel-sell') cancelTransaction('sell');
          else if (action === 'process-order') showTransactionConfirmationModal('order');
          else if (action === 'cancel-order') cancelTransaction('order');
          else if (action === 'process-trade') showTransactionConfirmationModal('trade');
          else if (action === 'cancel-trade') cancelTransaction('trade');
      }

      const removeStagedBtn = e.target.closest('[data-action="remove-staged-item"]');
      if (removeStagedBtn) {
          const name = removeStagedBtn.dataset.name;
          const type = removeStagedBtn.dataset.type;
          
          if (type === 'restock') restockCart = restockCart.filter(item => item.name !== name);
          else if (type === 'sell') sellCart = sellCart.filter(item => item.name !== name);
          else if (type === 'order') orderCart = orderCart.filter(item => item.name !== name);
          else if (type === 'trade') {
              const tradeSide = removeStagedBtn.dataset.tradeSide;
              tradeCart[tradeSide] = tradeCart[tradeSide].filter(item => item.name !== name);
          }
          
          renderTransactionsPage();
          renderCreateOrderPage();
      }

      const addBuildingCard = e.target.closest('[data-action="add-building"]');
      if (addBuildingCard) {
          showBuildingSelectionModal();
      }
      
      const removeBuildingBtn = e.target.closest('.remove-building-btn');
      if (removeBuildingBtn) {
          const buildingId = removeBuildingBtn.dataset.id;
          const settings = filtersByProfile[currentProfileId].building;
          settings.selected = settings.selected.filter(id => id !== buildingId);
          saveProfiles();
          renderBuildingFilter();
          renderInventoryPage();
      }

      const screenshotBtn = e.target.closest('[data-action="view-order-screenshot"], [data-action="view-trade-screenshot"]');
      if (screenshotBtn) {
          const orderId = screenshotBtn.dataset.orderId;
          const tradeId = screenshotBtn.dataset.tradeId;
          const itemToView = orderId ? pendingOrders.find(o => o.id === orderId) : pendingTrades.find(t => t.id === tradeId);
          if (itemToView) {
              showScreenshotOrderModal(itemToView);
          }
      }

      const editOrderBtn = e.target.closest('[data-action="edit-order"]');
      if (editOrderBtn) {
          const orderId = editOrderBtn.dataset.orderId;
          showConfirmationModal({
              title: "Edit Order",
              message: "This will move the order back to the creation screen for editing. The original pending order will be removed. Continue?",
              onConfirm: () => {
                  const orderIndex = pendingOrders.findIndex(o => o.id === orderId);
                  if (orderIndex > -1) {
                      const [orderToEdit] = pendingOrders.splice(orderIndex, 1);
                      orderCart = orderToEdit.items;
                      saveProfiles();
                      showPage('page-create-order');
                      renderAll();
                      showToast("Editing your order list.");
                  }
              }
          });
      }
      
      const editTradeBtn = e.target.closest('[data-action="edit-trade"]');
      if (editTradeBtn) {
          const tradeId = editTradeBtn.dataset.tradeId;
          showConfirmationModal({
              title: "Edit Trade",
              message: "This will move the trade back to the transaction screen for editing. The original pending trade will be removed. Continue?",
              onConfirm: () => {
                  const tradeIndex = pendingTrades.findIndex(t => t.id === tradeId);
                  if (tradeIndex > -1) {
                      const [tradeToEdit] = pendingTrades.splice(tradeIndex, 1);
                      tradeCart = { myItems: tradeToEdit.myItems, yourItems: tradeToEdit.yourItems };
                      saveProfiles();
                      showPage('page-transactions');
                      renderAll();
                      showToast("Editing your trade proposal.");
                  }
              }
          });
      }

      const deleteOrderBtn = e.target.closest('[data-action="delete-order"]');
      if(deleteOrderBtn) {
          const orderId = deleteOrderBtn.dataset.orderId;
           showConfirmationModal({
              title: 'Delete Order',
              message: 'Are you sure you want to delete this pending order? This cannot be undone.',
              onConfirm: () => {
                  pendingOrders = pendingOrders.filter(o => o.id !== orderId);
                  saveProfiles();
                  renderAll();
                  showToast('Order list deleted.');
              }
          });
      }
      
      const deleteTradeBtn = e.target.closest('[data-action="delete-trade"]');
      if(deleteTradeBtn) {
          const tradeId = deleteTradeBtn.dataset.tradeId;
           showConfirmationModal({
              title: 'Delete Trade',
              message: 'Are you sure you want to delete this pending trade? This cannot be undone.',
              onConfirm: () => {
                  pendingTrades = pendingTrades.filter(t => t.id !== tradeId);
                  saveProfiles();
                  renderAll();
                  showToast('Trade proposal deleted.');
              }
          });
      }

      const fulfillOrderBtn = e.target.closest('[data-action="fulfill-order"]');
      if(fulfillOrderBtn) {
          const orderId = fulfillOrderBtn.dataset.orderId;
          const order = pendingOrders.find(o => o.id === orderId);
          if (!order) return;

          const insufficientItems = order.items.filter(orderItem => {
              const inventoryItem = inventory.find(invItem => invItem.name === orderItem.name);
              return !inventoryItem || inventoryItem.qty < orderItem.changeQty;
          });

          if (insufficientItems.length > 0) {
              const itemsList = insufficientItems.map(item => `<li>${item.name}</li>`).join('');
              showConfirmationModal({
                  title: 'Insufficient Stock',
                  message: `Cannot fulfill order. Not enough stock for:<ul>${itemsList}</ul>`,
                  confirmText: 'OK',
                  onConfirm: () => {}
              });
              return;
          }

          showConfirmationModal({
              title: 'Fulfill Order',
              message: 'This will remove the items from your inventory. Are you sure?',
              onConfirm: () => {
                  order.items.forEach(cartItem => {
                      const masterIndex = inventory.findIndex(i => i.name === cartItem.name);
                      if (masterIndex !== -1) {
                          inventory[masterIndex].qty = Math.max(0, inventory[masterIndex].qty - cartItem.changeQty);
                      }
                  });
                  pendingOrders = pendingOrders.filter(o => o.id !== orderId);
                  saveProfiles();
                  renderAll();
                  showToast('Order completed! Inventory updated.');
              }
          });
      }
      
      const completeTradeBtn = e.target.closest('[data-action="complete-trade"]');
      if(completeTradeBtn) {
          const tradeId = completeTradeBtn.dataset.tradeId;
          const trade = pendingTrades.find(t => t.id === tradeId);
          if (!trade) return;

          const insufficientItems = trade.myItems.filter(tradeItem => {
              const inventoryItem = inventory.find(invItem => invItem.name === tradeItem.name);
              return !inventoryItem || inventoryItem.qty < tradeItem.changeQty;
          });

          if (insufficientItems.length > 0) {
              const itemsList = insufficientItems.map(item => `<li>${item.name}</li>`).join('');
              showConfirmationModal({
                  title: 'Insufficient Stock',
                  message: `Cannot complete trade. Not enough stock for:<ul>${itemsList}</ul>`,
                  confirmText: 'OK',
                  onConfirm: () => {}
              });
              return;
          }

          showConfirmationModal({
              title: 'Complete Trade',
              message: 'This will update your inventory based on the trade. Are you sure?',
              onConfirm: () => {
                  trade.myItems.forEach(itemToGive => {
                      const invIndex = inventory.findIndex(i => i.name === itemToGive.name);
                      if (invIndex !== -1) {
                          inventory[invIndex].qty -= itemToGive.changeQty;
                      }
                  });
                  trade.yourItems.forEach(itemToGet => {
                      const invIndex = inventory.findIndex(i => i.name === itemToGet.name);
                      if (invIndex !== -1) {
                          inventory[invIndex].qty += itemToGet.changeQty;
                      }
                  });
                  
                  pendingTrades = pendingTrades.filter(t => t.id !== tradeId);
                  saveProfiles();
                  renderAll();
                  showToast('Trade complete! Inventory updated.');
              }
          });
      }
  });

  document.getElementById('bottom-nav').addEventListener('click', e => {
    const navBtn = e.target.closest('.nav-btn');
    if (navBtn) {
        showPage(navBtn.dataset.page);
    }
  });

  menuBtn.addEventListener('click', toggleSidebar);
  closeSidebarBtn.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);
  addProfileBtn.onclick = () => {
      showProfileModal({
        title: 'Create New Profile', message: 'Enter the details for the new profile.',
        confirmText: 'Create',
        onConfirm: (data) => {
          if (data.name) {
              const newProfile = { 
                id: crypto.randomUUID(), 
                name: data.name, 
                email: data.email,
                pfpId: (profiles.length % 6) + 1,
                pfpDataUrl: null,
                gameTag: '#EDIT_YOUR_TAG'
              };
              profiles.push(newProfile);
              inventoryByProfile[newProfile.id] = baseInventory.map(item => ({ ...item, qty: 0, price: 0 }));
              filtersByProfile[newProfile.id] = { 
                  level: { active: false, min: 0, max: 130 },
                  building: { active: false, selected: [] },
                  sellerDashboard: { active: false }
              };
              saveProfiles();
              switchProfile(newProfile.id);
          }
          toggleSidebar();
        },
        onCancel: () => {
            toggleSidebar();
        }
      });
  };
  
  inventorySearchEl.addEventListener('input', debounce(() => renderInventoryPage(), 250));

  totalItemsCard.addEventListener('click', () => { if (chartFilterMode !== 'top') { chartFilterMode = 'top'; updateChart(); updateStatCardStyles(); } });
  lowStockCard.addEventListener('click', () => { if (chartFilterMode !== 'low') { chartFilterMode = 'low'; updateChart(); updateStatCardStyles(); } });
  itemSelectionModal.querySelector('.modal-close-btn').onclick = hideItemSelectionModal;
  buildingSelectionModal.querySelector('.modal-close-btn').onclick = hideBuildingSelectionModal;
  
  itemSelectionSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.trim();
      itemSelectionGrid.classList.toggle('expanded', searchTerm.length > 0);
      renderItemSelectionGrid(searchTerm);
  });
  
  buildingSelectionSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.trim();
      buildingSelectionModalGrid.classList.toggle('expanded', searchTerm.length > 0);
      renderBuildingSelectionModalGrid(searchTerm);
  });


  qtySelectionModal.querySelector('.modal-close-btn').onclick = hideQuantitySelectionModal;
  itemUpdateModal.querySelector('.modal-close-btn').onclick = hideItemUpdateModal;
  screenshotOrderModal.querySelector('.modal-close-btn').onclick = hideScreenshotOrderModal;

  sellerDashboardToggle.addEventListener('change', (e) => {
    if(!currentProfileId) return;
    const isActive = e.target.checked;
    filtersByProfile[currentProfileId].sellerDashboard.active = isActive;
    saveProfiles();
    renderInventoryPage();
    renderBottomNav();

    if (!isActive && document.querySelector('#page-create-order.active')) {
        showPage('page-home');
    }
  });

  function handleLevelInput() {
      if (!currentProfileId) return;
      const settings = filtersByProfile[currentProfileId].level;

      let minVal = parseInt(levelInputMin.value, 10);
      let maxVal = parseInt(levelInputMax.value, 10);

      if (isNaN(minVal)) minVal = 0;
      if (isNaN(maxVal)) maxVal = 130;

      minVal = Math.max(0, Math.min(130, minVal));
      maxVal = Math.max(0, Math.min(130, maxVal));
      
      if (minVal > maxVal) {
        if (document.activeElement === levelInputMin) {
          minVal = maxVal;
          levelInputMin.value = minVal;
        } else {
          maxVal = minVal;
          levelInputMax.value = maxVal;
        }
      }

      settings.min = minVal;
      settings.max = maxVal;
      saveProfiles();
      renderInventoryPage();
  }
  
  levelFilterToggle.addEventListener('change', (e) => {
    if(!currentProfileId) return;
    const isActive = e.target.checked;
    filtersByProfile[currentProfileId].level.active = isActive;
    levelInputContainer.classList.toggle('inactive', !isActive);
    saveProfiles();
    renderInventoryPage();
  });

  const debouncedLevelHandler = debounce(handleLevelInput, 400);
  levelInputMin.addEventListener('input', debouncedLevelHandler);
  levelInputMax.addEventListener('input', debouncedLevelHandler);

  buildingFilterToggle.addEventListener('change', (e) => {
    if(!currentProfileId) return;
    const isActive = e.target.checked;
    filtersByProfile[currentProfileId].building.active = isActive;
    buildingInputContainer.classList.toggle('inactive', !isActive);
    saveProfiles();
    renderInventoryPage();
  });

  function showPfpCropperModal(imageSrc) {
      document.body.classList.add('modal-active');
      pfpCropperImage.src = imageSrc;
      pfpCropperModal.classList.remove('hidden');

      if (cropper) {
          cropper.destroy();
      }

      cropper = new Cropper(pfpCropperImage, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 1,
          restore: false,
          guides: false,
          center: false,
          highlight: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false,
      });
  }

  function hidePfpCropperModal() {
      document.body.classList.remove('modal-active');
      pfpCropperModal.classList.add('hidden');
      if (cropper) {
          cropper.destroy();
          cropper = null;
      }
      pfpUploadInput.value = '';
  }

  pfpUploadInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          const reader = new FileReader();
          reader.onload = () => {
              showPfpCropperModal(reader.result);
          };
          reader.readAsDataURL(files[0]);
      }
  });

  pfpCropperCancelBtn.addEventListener('click', hidePfpCropperModal);

  pfpCropperConfirmBtn.addEventListener('click', () => {
      if (cropper) {
          const croppedCanvas = cropper.getCroppedCanvas({
              width: 256,
              height: 256,
              imageSmoothingQuality: 'high',
          });

          const dataUrl = croppedCanvas.toDataURL('image/png');
          const currentProfile = profiles.find(p => p.id === currentProfileId);

          if (currentProfile) {
              currentProfile.pfpDataUrl = dataUrl;
              saveProfiles();
              renderAll();
              showToast('Photo updated!');
          }
          hidePfpCropperModal();
      }
  });


  // --- APP INITIALIZATION ---
  (async () => {
    loadData();
    await initProfileData();
    inventory = inventoryByProfile[currentProfileId] || baseInventory.map(i => ({...i, qty: 0, price: 0}));
    initChart();
    renderAll();
    showPage('page-home'); 
    
    loadingOverlay.classList.add('hidden');
  })();
