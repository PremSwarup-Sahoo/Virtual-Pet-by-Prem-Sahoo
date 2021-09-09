var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed,lastFed

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  feedFood=createButton("Feed The Dog");
  feedFood.position(650,95);
  feedFood.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  var lastFedRef = database.ref("FeedTime");
  lastFedRef.on("value", function(data) {
    lastFed = data.val();
  });
 
  //write code to display text lastFed time here
  textSize(30)
  stroke(5)
  fill('red')

  if (lastFed>=12){
    calc = lastFed-12
    text('Last Fed : '+calc+' PM',50,35)
  }

  else if (lastFed===0){
    text('Last Fed : 12 AM',50,35)
  }
  
  else{
    text('Last Fed : '+lastFed+' AM',50,35)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  

  //write code here to update food stock and last fed time
  var foodStockVal = foodObj.getFoodStock()
  
  if (foodStockVal<=0){
    foodObj.updateFoodStock(foodStockVal*0)
  }
  else{
    dog.addImage(happyDog);
    foodObj.updateFoodStock(foodStockVal-1)
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
