var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Hairbrush50",
    database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
});

connection.query("SELECT * FROM products", function(err, res){
    console.log("Items for Sale" + "\n---------------------");
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "   " + res[i].product_name + "            " + res[i].price);
    };
});

inquirer.prompt([
    {
        name: "idNumber",
        message:"Enter the ID of the product you'd like to purchase"
    },
    {
        name: "quantity",
        message: "How many would you like to purchase?"
    }
]).then(function(answers){
    //call checkInventory function
    checkInventory(answers.quantity, answers.idNumber);

    function checkInventory(quantity, id) {
        if (quantity > 0) {
            connection.query("SELECT * FROM products WHERE item_id=?", id, function(err, res) {
                //check to see if quantity is available for purchase
                if(res[0].quantity >= quantity) {
                    //pull price on item
                    var price = parseFloat(res[0].price);
                    //get total based on price and quantity
                    var total = price * quantity;
                    //figure out new quantity
                    var newQuantity = parseInt(res[0].quantity) - parseInt(quantity);
                    //log confirmation
                    console.log("---------------------" + "\nThank you for your order of " + quantity+ " " + res[0].product_name + " ! Your total is: " + parseFloat(total) +"\n---------------------");
                    updateServer(newQuantity, id);
                } else { //not enough quantity
                    console.log("Insufficient quantity in our warehouse!");
                }
            })
        } else {
            console.log("You did not enter a valid quantity");
        }
    }

    function updateServer (newQuantity, id) {
        connection.query("UPDATE products SET quantity=? WHERE item_id=?", [newQuantity, id], function(err, res) {
            if (err) throw err;
            console.log("success!");
        } )


    }

})



