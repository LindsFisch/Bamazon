var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Hairbrush50",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
});

function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "WELCOME! What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]

        }
    ]).then(function (answer) {
        switch (answer.option) {
            case "View Products for Sale":
                choice.viewAll();
                break;
            case "View Low Inventory":
                choice.viewLow();
                break;
            case "Add to Inventory":
                choice.displayInventory();
                break;
            case "Add New Product":
                choice.addNew();
                break;
            default:
                console.log("Exiting!");
                break;
        }
    })
};

var choice = {
    viewAll: function () {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.log("All Inventory" + "\n---------------------");
            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + "   " + res[i].product_name + "            " + res[i].price);
            // };

            var table = new Table({
                head: ["item_id", "product_name", "price"]
            });

            for (var i = 0; i < res.length; i++){
                table.push([res[i].item_id, res[i].product_name, res[i].price])
            };
            console.log(table.toString());
        });
    },
    viewLow: function (){
        connection.query("SELECT * FROM products WHERE quantity < 5", function (err, res) {
            if (err) throw err;
            // console.log("Low Inventory" + "\n---------------------");
            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + "   " + res[i].product_name + "            " + res[i].department_name + "      " + res[i].quantity + " remaining");
            // };

            var table = new Table({
               head: ["item_id", "product_name", "department_name", "quantity"]
            });

            for (var i = 0; i < res.length; i++){
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].quantity])
            };
            console.log(table.toString());

            })
    },
    addNew: function () {
        inquirer.prompt([
            {
                name: "item",
                message: "What would you like to add?"
            },
            {
                name: "dept",
                message: "What department does this belong in?"
            },
            {
                name: "price",
                message: "What is the price of this item?"
            },
            {
                name: "quantity",
                message: "How many would you like to order?"
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.dept,
                    price: answer.price,
                    quantity: answer.quantity,
                    product_sales: 0
                }, function (err, res) {
                    if (err) throw err;
                    console.log("Success!");
                })
        })
    },
    addInventory: function () {


        inquirer.prompt([
            {
                name: "product",
                message: "For which product would you like to order more inventory?"
            },
            {
                name: "newQuantity",
                message: "How many more would you like to order?"
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM products WHERE product_name=?", answer.product, function (err, res) {
                if (err) throw err;
                var newTotal = parseInt(res[0].quantity) + parseInt(answer.newQuantity);
                choice.updateInventory(answer.product, newTotal);
            })
        })
    },
    updateInventory: function (product, quantity) {
        connection.query("UPDATE products SET quantity=? WHERE product_name=?", [quantity, product], function (err, res) {
            if (err) throw err;
            console.log("success!");
        })

    },
    displayInventory: function(){
             connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.log("All Inventory" + "\n---------------------");
            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + "   " + res[i].product_name + "            " + res[i].quantity);
            // };
            var table = new Table({
                head: ["item_id", "product_name", "price"]
            });

            for (var i = 0; i < res.length; i++){
                table.push([res[i].item_id, res[i].product_name, res[i].price])
            };
            console.log(table.toString());
            choice.addInventory();
        });
        
    }
}

startPrompt();