# 🌹 Velaur — Luxury Car Perfume Ecommerce

## Project Structure
```
velaur/
├── backend/                        ← Django REST API
│   ├── velaur_project/             ← Main Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── products/                   ← Product management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── orders/                     ← Order management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── payments/                   ← EasyPaisa & JazzCash
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/                      ← Auth (JWT)
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── chatbot/                    ← AI Chatbot (Claude API)
│   │   ├── views.py
│   │   └── urls.py
│   ├── contact/                    ← Contact form
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                       ← React App
    └── src/
        ├── pages/
        │   ├── Home.jsx            ← Landing page + About Us
        │   ├── Products.jsx        ← Product listing
        │   ├── ProductDetail.jsx   ← Single product
        │   ├── Cart.jsx            ← Cart page
        │   ├── Checkout.jsx        ← Checkout + payment
        │   ├── Contact.jsx         ← Contact Us
        │   └── Auth.jsx            ← Login / Register
        ├── components/
        │   ├── Navbar.jsx          ← Navigation menu
        │   ├── Footer.jsx          ← Footer
        │   ├── ProductCard.jsx     ← Product card component
        │   ├── ChatBot.jsx         ← AI Chatbot widget
        │   ├── PaymentUpload.jsx   ← Screenshot upload
        │   ├── HeroSection.jsx     ← Home hero banner
        │   └── AboutSection.jsx    ← About Us section
        ├── services/
        │   ├── api.js              ← Axios API calls
        │   ├── authService.js      ← Login/register API
        │   ├── cartService.js      ← Cart logic
        │   └── chatService.js      ← Chatbot API
        ├── assets/
        │   └── css/
        │       └── global.css      ← Global styles + Velaur theme
        ├── App.jsx                 ← Main app + routing
        └── main.jsx                ← React entry point
```

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Color Scheme
- Primary: #F2A7A7 (Rose Pink)
- Secondary: #F9D5C0 (Peach)
- Accent: #FAE8D0 (Cream)
- Dark: #1A1A1A (Near Black)
- Text: #2C1810 (Dark Brown)