# Fly Far International

Welcome to **Fly Far International**, a comprehensive travel solution platform. This project is designed to cater to the diverse needs of travelers, providing seamless access to travel services like flight bookings, hotel reservations, and much more.

## Project Overview
Fly Far International serves as a central hub for users, travel agents, and businesses in the travel industry. The platform offers a user-friendly interface combined with robust backend support to handle high traffic and dynamic operations.

## Features
- **Flight Search and Booking:** Find and book flights quickly and efficiently.
- **Hotel Reservations:** Browse and reserve accommodations globally.
- **Travel Packages:** Explore curated travel packages for various destinations.
- **User Accounts:** Manage bookings, preferences, and travel history.
- **Agent Dashboard:** Dedicated tools and analytics for travel agents.

## Technology Stack
### Frontend
- **Framework:** React.js (with Material UI for design components)
- **Version:** Fly Far International Version 2

### Backend
- **Language:** JavaScript (Node.js with Express.js framework)
- **Database:** MYSQL
- **APIs:** RESTful APIs for handling operations

### Hosting & Infrastructure
- Google Cloud Platform (GCP)
- A2 Hosting for supplementary services

## Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MYSQL
- Redis server

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/FlyFarTech/Fly-Far-Int-V2.git
   cd fly-far-international
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file and include:
   ```env
   PORT=3000
   DB_URI=<your_mongodb_connection_string>
   REDIS_URI=<your_redis_connection_string>
   GCP_KEY=<your_gcp_key>
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:5020`.

## Contribution Guidelines
We welcome contributions to Fly Far International! Please adhere to the following steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
For any queries or support, feel free to reach out to the team:
- **Email:** support@flyfarint.com
- **Phone:** +8809666721921
- **Website:** [flyfarint.com](https://www.flyfarint.com)

---

Thank you for choosing Fly Far International. Happy Travels!
