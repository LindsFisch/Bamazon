# Bamazon

### Overview
Created an Amazon-like storefront with the MySQL. The app will take in orders from customers and deplete stock from the store's inventory. The app also tracks product sales across the store's departments and then provides a summary of the highest-grossing departments in the store.

### Customer View
The customer view is run from `bamazonCustomer.js` and displays all the products within the store. The customer is the prompted with what item they would like to purchase along with the quantity.  The total is then given to the customer and the quantity in the database is updated. 
[See here](images/CustomerInterface.jpg). 

### Manager View
The manager view is run from `bamazonManager.js` and prompts 4 different choices. `View all products` shows the manager all of the inventory in the store. `View Low Inventory` shows the manager all products with a quantity of less than 5. [See here](images/ManagerView.jpg).

The manager can also add quantity to specific item in the store with `Add to Inventory` and can also add brand new items to the store with `Add new Product`. [See here](images/ManagerAdd.jpg).

### Supervisor View
The `bamazonSupervisor.js` file will allow a supervisor to add new departments to the store with the `create new department` option and can also view top grossing departments with the `View Product Sales by Departments` option. 
[See here](images/SuperView.jpg).

### Technologies Utilized
MySql and node.js
