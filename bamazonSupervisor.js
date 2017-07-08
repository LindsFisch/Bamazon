var Table = require("cli-table2");
var mysql = require("mysql");
var inquirer = require ("inquirer");

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

inquirer.prompt([
    {
        type: "list",
        name: "superOption",
        message:"What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"]
    }
]).then(function(answers){
    if (answers.superOption === "View Product Sales by Department") {
        viewSales();
    } else {
        newDept();
    }
});

//if super wants to add new dept
function newDept() {
    inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department to be added?"
        }, 
        {
            name: "cost", 
            message: "What is the overhead cost of this department?"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO departments SET ?", 
        {
            department_name: answer.name,
            over_head_costs: answer.cost
        }, function(err, res){
            if (err) throw err;
        })
        connection.query("SELECT * FROM departments", function (err, res){
            if (err) throw err;

            var table = new Table({
                head: ["department_id", "department_name", "over_head_costs"]
            });

            for (var i = 0; i < res.length; i++){
                table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs])
            }
            console.log("Your updates!")
            console.log(table.toString());
        })
    })

};

//if super wants to view sales
function viewSales() {
    //join select statement
    connection.query("SELECT department_id, d.department_name, over_head_costs, sum(product_sales) AS product_sales, (sum(product_sales) - over_head_costs) AS total_profit FROM departments d INNER JOIN products p ON d.department_name = p.department_name GROUP BY department_name", function(err, res){
        if (err) throw err;
        //set up table head
        var table = new Table({
            head: ["department_id", "department_name", "over_head_costs", "products_sales", "total_profits"]
        });
        //cycle through res and print out values in table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit])
        }
        console.log(table.toString());
    })
}