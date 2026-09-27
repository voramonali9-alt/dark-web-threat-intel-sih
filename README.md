# 🛒 ShopSync: Smart Shop Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

Welcome to **ShopSync**! This is a complete, full-stack MERN (MongoDB, Express, React, Node.js) application designed to seamlessly connect local shopkeepers with their customers through a smart and modern interface.

## ✨ Key Features

* **👥 Role-Based System:** Secure registration and login that intelligently routes users to either the Shopkeeper Dashboard or the Customer Dashboard based on their account type.
* **🚨 Smart Inventory & Alerts:** Automatically decreases stock when items are purchased. If stock falls below the danger level, the system triggers a **Red Alert** on the shopkeeper's dashboard to reorder items.
* **💰 Real-Time Sales Tracking:** Automatically calculates the total price of purchased items and updates the shopkeeper's total earnings in real-time.
* **🌍 Multi-Language Support (i18n):** Fully localized interface supporting **English, Hindi, Gujarati, and Marathi**. The entire UI instantly translates with a simple dropdown selection.
* **🛍️ Customer Storefront:** Customers can browse all local registered shops, view available inventory, check prices, and purchase items seamlessly.

## 💻 Tech Stack

* **Frontend:** React.js, React-i18next (Multi-language)
* **Backend:** Node.js, Express.js, CORS
* **Database:** MongoDB Atlas (Cloud), Mongoose (ODM)
* **Architecture:** MVC (Model-View-Controller) Pattern

## 🚀 How to Run the Project

### 1. Start the Backend Server
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies: `npm install`
3. Start the server: `npm start`
*(The server will run on http://localhost:5000 and connect to the Cloud Database)*

### 2. Start the Frontend Application
1. Open a **new** terminal and navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Start the React app: `npm start`
*(The app will automatically open in your browser at http://localhost:3000)*

---
*Developed with focus on logic, clean code, and perfection.*
