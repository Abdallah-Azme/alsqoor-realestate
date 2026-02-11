const fs = require("fs");

const arPath =
  "c:/Users/abdallah/Desktop/sub-coders/real-state/messages/ar.json";
const enPath =
  "c:/Users/abdallah/Desktop/sub-coders/real-state/messages/en.json";

const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

// Helper to title case
function titleCase(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

// Dictionary for common translations
const dictionary = {
  page_title: "Property Requests",
  add_request: "Add Request",
  add_new_request: "Add New Request",
  no_requests: "No requests found",
  loading: "Loading...",
  load_more: "Load More",
  login_required: "Login Required",
  bookmarked: "Bookmarked",
  all: "All",
  villa_sale: "Villa for Sale",
  villa_rent: "Villa for Rent",
  land_sale: "Land for Sale",
  apartment_sale: "Apartment for Sale",
  apartment_rent: "Apartment for Rent",
  floor_sale: "Floor for Sale",
  floor_rent: "Floor for Rent",
  shop_sale: "Shop for Sale",
  shop_rent: "Shop for Rent",
  warehouse_sale: "Warehouse for Sale",
  warehouse_rent: "Warehouse for Rent",
  sale: "Sale",
  rent: "Rent",
  serious_request: "Serious Request",
  subscribers_only: "Subscribers Only",
  sqm: "m²",
  sar: "SAR",
  market_price: "Market Price",
  minutes_ago: "minutes ago",
  hours_ago: "hours ago",
  days_ago: "days ago",
  location_placeholder: "Select location",
  sort_by: "Sort by",
  search: "Search",
  clear: "Clear",
  interests: "Interests",
  add_interest: "Add Interest",
  newest: "Newest",
  oldest: "Oldest",
  price_low: "Price: Low to High",
  price_high: "Price: High to Low",
  title: "Title",
  property_type: "Property Type",
  operation_type: "Operation Type",
  city: "City",
  neighborhoods: "Neighborhoods",
  min_area: "Min Area",
  max_area: "Max Area",
  min_price: "Min Price",
  max_price: "Max Price",
  description: "Description",
  is_serious: "Serious Request",
  cancel: "Cancel",
  submit: "Submit",
  success: "Success",
  error: "Error",
  budget: "Budget",
  details: "Details",
  next: "Next",
  step_title: "Step",
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  member_since: "Member since",
  create_request: "Create Request",
  my_requests: "My Requests",
  all_requests: "All Requests",
  request_details: "Request Details",
  edit_request: "Edit Request",
  buy: "Buy",
  cash: "Cash",
  finance: "Finance",
  specific_budget: "Specific Budget",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  request_number: "Request Number",
  property_age: "Property Age",
  created_at: "Created At",
  updated_at: "Updated At",
  my_offers: "My Offers",
};

function translate(key, fullKeyPath) {
  const parts = key.split(".");
  const lastPart = parts[parts.length - 1];

  if (dictionary[lastPart]) return dictionary[lastPart];

  return titleCase(lastPart);
}

// 1. Add propertyRequestsPage to EN
if (!en.propertyRequestsPage && ar.propertyRequestsPage) {
  console.log("Adding propertyRequestsPage to en.json");
  en.propertyRequestsPage = {};

  function copyStructure(source, target, prefix = "") {
    for (const key in source) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof source[key] === "object" && source[key] !== null) {
        target[key] = {};
        copyStructure(source[key], target[key], fullPath);
      } else {
        target[key] = translate(key, "propertyRequestsPage." + fullPath);
      }
    }
  }

  copyStructure(ar.propertyRequestsPage, en.propertyRequestsPage);
}

// 2. Add Profile.my_offers to EN
if (en.Profile && !en.Profile.my_offers) {
  console.log("Adding Profile.my_offers to en.json");
  en.Profile.my_offers = "My Offers";
}

// 3. Sync Properties
function deepSync(source, target, ns) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepSync(source[key], target[key], ns + "." + key);
    } else {
      if (!target[key]) {
        console.log(
          `Adding ${ns}.${key} to ${target === en ? "en.json" : "ar.json"}`,
        );
        target[key] = translate(key, ns + "." + key);
      }
    }
  }
}

if (ar.properties) {
  if (!en.properties) en.properties = {};
  deepSync(ar.properties, en.properties, "properties");
}

// Sync EN -> AR
if (en.properties) {
  if (!ar.properties) ar.properties = {};
  deepSync(en.properties, ar.properties, "properties");
}

// Write files
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));

console.log("Done merging translations.");
