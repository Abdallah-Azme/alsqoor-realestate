# Project Endpoints Implementation Status

**Total Endpoints:** 112
**Implemented:** 38 ✅
**Remaining:** 74 ❌

## Detailed Status by Category

### Auth (8/11)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Login | POST | ✅ | middleware.ts<br>page.tsx<br>...and 15 more |
| Register | POST | ✅ | auth.service.ts<br>registration.service.ts |
| Verification | POST | ✅ | otp-form.tsx |
| resend-verification | POST | ✅ | otp-form.tsx |
| forgot-password | POST | ✅ | forget-form.tsx<br>login-form.tsx<br>...and 1 more |
| verify-reset-code | POST | ✅ | reset-code-form.tsx |
| reset-password | POST | ✅ | new-password-form.tsx<br>auth.service.ts |
| logout | POST | ✅ | user-context.tsx<br>auth.service.ts |
| delete account | DELETE | ❌ | - |
| Refresh | POST | ❌ | - |
| Update Fcm Token | POST | ❌ | - |

### Blog (1/6)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| all blogs | GET | ✅ | sitemap.ts<br>page-client-example.tsx<br>...and 12 more |
| singleBlog | GET | ❌ | - |
| search | GET | ❌ | - |
| similarBlogs | GET | ❌ | - |
| categoryWithBlog | GET | ❌ | - |
| filterCategory | GET | ❌ | - |

### Chat (0/12)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| startChat | POST | ❌ | - |
| sendMessage | POST | ❌ | - |
| getMessages | GET | ❌ | - |
| getMyChats | GET | ❌ | - |
| getChat | GET | ❌ | - |
| markAsRead | POST | ❌ | - |
| replyMessage | POST | ❌ | - |
| deleteMessage | DELETE | ❌ | - |
| deleteMessageForEveryone | DELETE | ❌ | - |
| getUnreadCount | GET | ❌ | - |
| deleteAllMessagesForMe | DELETE | ❌ | - |
| pusherAuth | POST | ❌ | - |

### Complaints (2/4)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| get Types | GET | ❌ | - |
| add complaint | POST | ✅ | sitemap.ts<br>page.tsx<br>...and 5 more |
| featured users | GET | ✅ | sitemap.ts<br>page.tsx<br>...and 7 more |
| single featured user | GET | ❌ | - |

### Countries (2/2)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| countries | GET | ✅ | add-form.tsx<br>country-selector.tsx |
| cities | GET | ✅ | add-form.tsx<br>advertisements.service.ts |

### Direct Deal (2/3)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Add Direct Deal | POST | ✅ | deals.ts |
| Update Direct Deal | POST | ❌ | - |
| Direct Deals | GET | ✅ | deals.ts |

### Favorites (0/4)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| user favorites | GET | ❌ | - |
| show single favorite using property id | GET | ❌ | - |
| addFavorite | POST | ❌ | - |
| removeFavorite | DELETE | ❌ | - |

### Filter (1/2)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Search properties | GET | ✅ | state-filter.tsx<br>companies-actions.ts |
| Search sold properties | GET | ❌ | - |

### News Letter (0/1)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| subscribe | POST | ❌ | - |

### Notifications (1/5)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| all user notifications | GET | ✅ | robots.ts<br>navbar.tsx |
| search | GET | ❌ | - |
| single notification using id | GET | ❌ | - |
| markAsRead | POST | ❌ | - |
| markAllAsRead | POST | ❌ | - |

### Packages (1/3)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| All Packages | GET | ✅ | sitemap.ts<br>page.tsx<br>...and 7 more |
| single Package | GET | ❌ | - |
| getUserPoints | GET | ❌ | - |

### Profile (2/3)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| profile | GET | ✅ | robots.ts<br>page.tsx<br>...and 10 more |
| update profile | POST | ✅ | robots.ts<br>page.tsx<br>...and 10 more |
| profile change-password | POST | ❌ | - |

### Property Category (1/3)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| all categories | GET | ❌ | - |
| single category | GET | ❌ | - |
| all amenities | GET | ✅ | add-form.tsx<br>properties.service.ts |

### Property New (0/6)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| add owner properties | POST | ❌ | - |
| update | POST | ❌ | - |
| index | GET | ❌ | - |
| show | GET | ❌ | - |
| destroy | DELETE | ❌ | - |
| user properties | GET | ❌ | - |

### Property Offers (2/4)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| User Offers | GET | ✅ | page.tsx<br>property-offers-index.ts<br>...and 4 more |
| submitOffer | POST | ✅ | page.tsx<br>property-offers-index.ts<br>...and 4 more |
| acceptOffer | POST | ❌ | - |
| rejectOffer | POST | ❌ | - |

### Reviews (0/3)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Property reviews | GET | ❌ | - |
| Add or update review | POST | ❌ | - |
| Delete  Review | DELETE | ❌ | - |

### Setting (5/6)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| About Page | GET | ✅ | sitemap.ts<br>page.tsx<br>...and 7 more |
| User Guide Page | GET | ✅ | page.tsx<br>index.ts<br>...and 2 more |
| Home Page | GET | ✅ | page.tsx<br>page.tsx<br>...and 5 more |
| topnav color | GET | ✅ | settings.service.ts |
| currency | GET | ❌ | - |
| setting | GET | ✅ | layout.tsx<br>page.tsx<br>...and 8 more |

### Testmonial (2/2)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Faqs | GET | ✅ | faq-actions.ts |
| testmonial | GET | ✅ | use-reviews.ts<br>reviews.service.ts |

### Trusted Comapnies (2/4)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| all trusted companies with pagination, search and filters | GET | ✅ | use-partners.ts<br>partners.service.ts |
| Get single company details | GET | ❌ | - |
| Get available company types for filtering | GET | ❌ | - |
| getFeaturedUsers | GET | ✅ | sitemap.ts<br>page.tsx<br>...and 7 more |

### ads (3/9)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| Featured properties | GET | ❌ | - |
| Similar properties | GET | ❌ | - |
| single property | GET | ❌ | - |
| Add property | POST | ✅ | property-actions.ts |
| Update Property | POST | ❌ | - |
| All amenities | GET | ✅ | add-form.tsx<br>properties.service.ts |
| User Properties | GET | ✅ | properties.service.ts |
| Convert to advertisement | POST | ❌ | - |
| reactivate | POST | ❌ | - |

### offers (1/2)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| all offers | GET | ✅ | sitemap.ts<br>page.tsx<br>...and 8 more |
| single offer | GET | ❌ | - |

### subscrption (0/9)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| subscribeToPackage | POST | ❌ | - |
| subscribeToOffer | POST | ❌ | - |
| paymentCallback | GET | ❌ | - |
| userSubscriptions | GET | ❌ | - |
| activeSubscription | GET | ❌ | - |
| renewSubscription | POST | ❌ | - |
| getPaymentMethods | GET | ❌ | - |
| User Transactions | GET | ❌ | - |
| User Statistics | GET | ❌ | - |

### success stories (0/2)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| index | GET | ❌ | - |
| show | GET | ❌ | - |

### talbat (2/6)
| Endpoint | Method | Status | Found In |
| --- | --- | --- | --- |
| index | GET | ✅ | requests.service.ts |
| show | GET | ❌ | - |
| store | POST | ✅ | requests.service.ts |
| update | POST | ❌ | - |
| User Requests | GET | ❌ | - |
| destroy | DELETE | ❌ | - |