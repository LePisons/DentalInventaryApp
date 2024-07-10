# Dental Inventory Management System

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup and Installation](#setup-and-installation)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

The Dental Inventory Management System is a comprehensive web application designed to help dental clinics efficiently manage their inventory. This system provides real-time tracking of dental supplies, equipment, and materials, ensuring that clinics can maintain optimal stock levels and streamline their operations.

## Features

- **User Authentication**: Secure login system for authorized access.
- **Dashboard**: Visual representation of inventory statistics and recent activities.
- **Inventory Management**: 
  - Add, edit, and delete inventory items
  - Categorize items for easy organization
  - Set and monitor low stock thresholds
  - Bulk actions for efficient management
- **Search and Filter**: Quickly find items using search functionality and category filters.
- **Stock Alerts**: Visual indicators for low and medium stock levels.
- **History Tracking**: Log of all inventory actions for auditing purposes.
- **Bulk Import/Export**: Import inventory data from CSV files and export reports.
- **Responsive Design**: User-friendly interface accessible on various devices.

## Technologies Used

- **Frontend**:
  - React.js
  - TypeScript
  - Tailwind CSS for styling
  - Recharts for data visualization
- **Backend**:
  - Node.js
  - Express.js
  - Sequelize ORM
- **Database**:
  - PostgreSQL (assumed, based on Sequelize usage)
- **Additional Libraries**:
  - Axios for HTTP requests
  - Multer for file uploads
  - CSV-parser for CSV file handling

## Project Structure

The project is organized into frontend and backend components:

```
dental-inventory-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddNewItem.tsx
│   │   │   ├── BulkActions.tsx
│   │   │   ├── BulkImport.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ColorScheme.tsx
│   │   │   ├── DentalInventoryDashboard.tsx
│   │   │   ├── InventoryHistory.tsx
│   │   │   ├── InventoryStats.tsx
│   │   │   ├── InventoryStatsChart.tsx
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── LastActions.tsx
│   │   │   ├── Login.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── types.ts
│   │   └── auth.ts
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── routes/
│   │   └── inventory.js
│   ├── models/
│   │   └── index.js (assumed)
│   ├── package.json
│   └── server.js (assumed)
├── README.md
└── .gitignore
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/dental-inventory-system.git
   cd dental-inventory-system
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Set up the database:
   - Install PostgreSQL if not already installed
   - Create a new database for the project
   - Update the database configuration in `backend/config/database.js` (file assumed)

4. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

5. Start the backend server:
   ```
   cd ../backend
   npm start
   ```

6. Start the frontend development server:
   ```
   cd ../frontend
   npm start
   ```

7. Access the application at `http://localhost:3000` in your web browser.

## Usage

1. **Login**: Use your credentials to log into the system.
2. **Dashboard**: View overall inventory statistics and recent actions.
3. **Manage Inventory**: 
   - Add new items using the "Add New Item" form.
   - Edit existing items directly in the inventory table.
   - Delete items using the delete button in the table.
   - Use bulk actions for multiple items.
4. **Search and Filter**: Use the search bar to find specific items or filter by category.
5. **Import/Export**: Use the bulk import feature to add multiple items from a CSV file.
6. **Monitor Stock**: Keep an eye on low stock alerts in the inventory table.
7. **View History**: Check the "Last Actions" section for recent inventory changes.

## API Endpoints

- `GET /api/inventory`: Get all inventory items
- `POST /api/inventory`: Add a new inventory item
- `PUT /api/inventory/:id`: Update an existing inventory item
- `DELETE /api/inventory/:id`: Delete an inventory item
- `POST /api/inventory/bulk-delete`: Delete multiple inventory items
- `POST /api/inventory/bulk-import`: Import inventory items from CSV
- `POST /api/inventory/bulk-update`: Update multiple inventory items
- `GET /api/inventory/history`: Get full inventory history
- `GET /api/inventory/history/last10`: Get last 10 inventory actions

## Contributing

We welcome contributions to improve the Dental Inventory Management System. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).