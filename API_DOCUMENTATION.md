# Dental Inventory API Documentation

This document provides details on how to use the Dental Inventory API.

## Base URL

All URLs referenced in the documentation have the following base:

http://localhost:3001/api

## Authentication

Currently, the API does not require authentication. (Note: You may want to implement this in the future for security reasons.)

## Endpoints

```markdown
### Get All Inventory Items

Retrieves a list of all inventory items.

- **URL:** `/inventory`
- **Method:** GET
- **URL Params:** 
  - `category` (optional): Filter items by category
  - `search` (optional): Search items by name
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of inventory items
    ```json
    [
      {
        "id": 1,
        "name": "Dental Floss",
        "category": "Hygiene",
        "quantity": 100,
        "unit": "pcs",
        "lowStockThreshold": 20
      },
      ...
    ]
    ```
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "error": "Internal server error" }`

### Create New Inventory Item

Adds a new item to the inventory.

- **URL:** `/inventory`
- **Method:** POST
- **Data Params:**
  ```json
  {
    "name": "Toothbrush",
    "category": "Hygiene",
    "quantity": 50,
    "unit": "pcs",
    "lowStockThreshold": 10
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** The created inventory item
    ```json
    {
      "id": 2,
      "name": "Toothbrush",
      "category": "Hygiene",
      "quantity": 50,
      "unit": "pcs",
      "lowStockThreshold": 10
    }
    ```
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "error": "Error message" }`
```
Great, let's continue with the remaining endpoints. Add the following content to your `API_DOCUMENTATION.md` file, right after the previous section:

```markdown
### Update Inventory Item

Updates an existing inventory item.

- **URL:** `/inventory/:id`
- **Method:** PUT
- **URL Params:** 
  - `id`: ID of the item to update
- **Data Params:**
  ```json
  {
    "name": "Updated Toothbrush",
    "category": "Hygiene",
    "quantity": 75,
    "unit": "pcs",
    "lowStockThreshold": 15
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** The updated inventory item
    ```json
    {
      "id": 2,
      "name": "Updated Toothbrush",
      "category": "Hygiene",
      "quantity": 75,
      "unit": "pcs",
      "lowStockThreshold": 15
    }
    ```
- **Error Response:**
  - **Code:** 404
  - **Content:** `{ "error": "Item not found" }`
  - **Code:** 500
  - **Content:** `{ "error": "Error message" }`

### Delete Inventory Item

Removes an item from the inventory.

- **URL:** `/inventory/:id`
- **Method:** DELETE
- **URL Params:** 
  - `id`: ID of the item to delete
- **Success Response:**
  - **Code:** 204
  - **Content:** No content
- **Error Response:**
  - **Code:** 404
  - **Content:** `{ "error": "Item not found" }`
  - **Code:** 500
  - **Content:** `{ "error": "Error message" }`

### Bulk Import Inventory Items

Imports multiple inventory items from a CSV file.

- **URL:** `/inventory/bulk-import`
- **Method:** POST
- **Data Params:** 
  - Form-data with key 'file' and value as the CSV file
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Bulk import successful" }`
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "error": "Error message" }`

### Bulk Update Inventory Items

Updates multiple inventory items at once.

- **URL:** `/inventory/bulk-update`
- **Method:** POST
- **Data Params:**
  ```json
  {
    "items": [1, 2, 3],
    "bulkUpdateField": "quantity",
    "bulkUpdateValue": 50
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Bulk update successful" }`
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "error": "Bulk update failed", "details": "Error message" }`

### Get Last 10 Inventory Actions

Retrieves the last 10 actions performed on the inventory.

- **URL:** `/inventory/history/last10`
- **Method:** GET
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of last 10 inventory history records
    ```json
    [
      {
        "id": 1,
        "itemId": 2,
        "action": "updated",
        "quantity": 75,
        "createdAt": "2023-04-15T10:30:00.000Z"
      },
      ...
    ]
    ```
- **Error Response:**
  - **Code:** 500
  - **Content:** `{ "error": "Internal server error" }`
```
