# Vaagai Doors & Interiors 🪵✨

**Data Analytics Driven E-commerce & Customer Engagement Platform**

Vaagai Doors & Interiors is a premium, full-stack retail application designed to deliver an immersive and high-end shopping experience for artisanal wood products. Built with a modern, glass-morphic interface and a dual-stream architecture, the platform caters to both individual homeowners (B2C) and large-scale business projects (B2B).

---

## 🚀 Features

### 🛍️ Artisanal Storefront
- **Luxury Browsing**: Immerse yourself in a high-definition product catalog featuring signature teak entrances and modular living solutions.
- **Glass-morphic UI**: Experience a sophisticated, responsive interface designed with premium aesthetics and smooth animations.
- **Persistent Wishlist**: Curate personal collections for future interior projects.

### 💼 B2B & Business Logic
- **Specialized Onboarding**: Dedicated application workflow for contractors and interior designers.
- **Project-based Discounting**: Automated bulk pricing (e.g., specialized tier discounts for large orders).
- **Inventory Management**: Real-time stock allocation specifically optimized for large-scale projects.

### 📊 Admin Analytics & Management
- **Revenue Engine**: Real-time temporal sales trend visualization for strategic decision-making.
- **Order Lifecycle**: Comprehensive management of orders, from payment verification to final delivery.
- **Appointment Booking**: Integrated scheduling for professional interior design consultations.

### 🛡️ Security & Logistics
- **Secure Authentication**: JWT-based session handling with strict field-level registration validation.
- **Regional Verification**: Automated shipping validation specifically for Southern Indian states (TN, KL, KA).
- **Integrated Checkout**: Seamless transaction flows via the specialized "Vaagai Secure Pay" gateway.

---

## 🛠️ Technology Stack

- **Frontend**: [React](https://reactjs.org/) (Vite), [Axios](https://axios-http.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Backend**: [Django](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Cloud Infrastructure**: [Microsoft Azure](https://azure.microsoft.com/)

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL

### Backend Setup
1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt  # Ensure you create this from your env
   ```
4. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📄 Documentation
Comprehensive technical documentation, including system interface descriptions and architectural diagrams, can be found in the [project_report.md](./project_report.md) file.

## ⚖️ License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Crafted with excellence by the Vaagai Development Team.*
