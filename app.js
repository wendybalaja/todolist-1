
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");


const app = express();
app.use(bodyParser.urlencoded({extended: true})); //necessary to start body parser for post request!
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const default_item1 = new Item({
  name: "open fridge"
});

const default_item2 = new Item({
  name: "put in the elephant"
});

const default_item3 = new Item({
  name: "close fridge"
});

const defaultItems = [default_item1, default_item2, default_item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');

app.get("/", function(req,res){
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){

        });
    }
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  });
});

/* dynamic route, custom list access */
app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;


  List.findOne({name: customListName}, function(err, foundList){

    if(!err){
      if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();

      }else{
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
      const route = "/" + customListName;
      res.redirect(route);
    }
  });
});

app.get("/about", function(req,res){
  res.render("about.ejs");
})

app.post("/", function(req,res){

    let itemName= req.body.item;
    const listName = req.body.list;

    if(listName === "Today"){

    }
      const newItem = new Item({
        name: itemName
      });

      newItem.save();

      res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(err){
      console.log(err);
    }else{

      res.redirect("/");

      console.log("item removed successfully");
    }
  })
});

app.listen(8080, function(){
  console.log("Server started on port 8080");
})
