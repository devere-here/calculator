//Pre defined variables and arrays
var screen = document.getElementById("main-content");
var subScreen = document.getElementById("sub-content");
var bool = false;
var numberArray = [];
var operationArray = [];
var buttonSound = new Audio("https://drive.google.com/uc?export=download&id=0Bw2029NKQAh_TU42TEttd3dSN2c");

$(document).ready(function(){
  
  //clear top section of screen
  function clearMainScreen(){
    
    screen.textContent = "";
    
  }
  
  //clears bottom section of screen
  function clearSubScreen(){
        
    subScreen.textContent = "";
    
  }
  
  //clears most recent entry (number or operation) within screen
  function clearLastEntry(){
    
    var lastEntry = screen.textContent;
    var subScreenStatement = subScreen.textContent;
    var index = subScreenStatement.lastIndexOf(lastEntry);
    
    subScreenStatement = subScreenStatement.substring(0, index);
    subScreen.textContent = subScreenStatement;
    screen.textContent = "";
    
  }
  
  //records numbers on screen
  function recordNumberOnScreen(event){
    
    var number = event.target.getAttribute("data-value");
    
    $("#main-content").append(number);
    $("#sub-content").append(number);
      
 }
  
  //records operation on screen
  function recordOperationOnScreen(event){
    
     var operation = event.target.getAttribute("data-operation");
     var number = screen.textContent;
    
     $("#main-content").html(operation);    
     $("#sub-content").append(" " + operation + " ");
    
  }
  
  //takes data from screen and inserts it into array for later computation
  function updateNumberArray(){ 
    
     var screenData = screen.textContent;
    
      if(numberArray.length == operationArray.length){
        
        numberArray.push(screenData);

      }
  }
  
  //takes data from screen and inserts it into array for later computation
  function updateOperationArray(){
    
    var screenData = screen.textContent;
    
    switch(screenData){
        
         case "+":
           operationCode = 0;
           break;
         case "-":
           operationCode = 1;
           break;
         case "*":
           operationCode = 2;
           break;
         case "/":
           operationCode = 3;
           break;
         
       }
           
       operationArray.push(operationCode);
      
  }

  //searches to see if most recent entry was an operation returns a boolean
  function checkForOperation(){
    
    var digit = /[0-9\.]/;        
    var bool = false;
    var operationCode;
    
    if(digit.test(screen.textContent) == false && screen.textContent != ""){

      bool = true;
      
    }
    
    return bool;
    
  }
  
  //searches to see if most recent entry was a number returns a boolean
  function checkForNumber(){

    var digit = /[0-9]/;
    var bool = false;   
    
    if(digit.test(screen.textContent) == true){
      
      bool = true;
      
    }
    
    return bool;
    
  }
  
  //performs calculations
  function compute(){
    
    bool = true;
    
    var number1, number2, finalNumber, operation;
    var length = operationArray.length;
    
    //for setting numbers equal to themselves "8 = 8"
    if(length == 0){
      finalNumber = numberArray[0];
    }
    
    //Combines all data from number and operation arrays
    for(var i = 0; i < length; i++){
      
      number1 = parseFloat(numberArray.shift());
      number2 = parseFloat(numberArray.shift());
      operation = operationArray.shift();
      
      //converts the code in our operation array to actual operations
      switch(operation){
        case 0:
          finalNumber = number1 + number2;
          break;
        case 1:
          finalNumber = number1*10000 - number2*10000;
          finalNumber = finalNumber/10000;
          break;
        case 2:
          finalNumber = number1 * number2;
          break;
        case 3:
          finalNumber = number1 / number2;
          break;

      }
      
      var stringFinalNumber = finalNumber.toString();
      //creates an exponential versioln of our final answer if its too long
      if(stringFinalNumber.length > 10){
        
        finalNumber = finalNumber.toExponential(6);
        
      }
      
      //plugs finalNumber back into array in case the user wants to use it for further computation
      numberArray.unshift(finalNumber);
    
      
    }
    
    return finalNumber;
    
  }
  
  //changes positive numbers to negative and vice-versa
  function changeNumberSign(){
        
    var oringinalNumber = screen.textContent;
    var oringinalSubScreen = subScreen.textContent;
    
    var newNumber = parseFloat(oringinalNumber)*(-1);
    screen.textContent = newNumber;
    
    //changing the subScreen string so that our sign change appears on the bottom portion of the screen
    var index = oringinalSubScreen.lastIndexOf(oringinalNumber);
    var newSubScreen = oringinalSubScreen.substring(0, index);
    
    newSubScreen = newSubScreen + newNumber; 
    subScreen.textContent = newSubScreen;
        
  }
  
  //clears the number array
  function clearNumberArray(){
    
    numberArray = [];
    
  }
  
  //clears the operation array
  function clearOperationArray(){
    
    operationArray = [];
    
  }
  
  //Event handler when user wants to change the number's sign
  $("#change-sign").click(function(event){
    
    bool = false;
    buttonSound.play();
    var check = checkForNumber();
    
    if(check == true){
      
      changeNumberSign();
      
    }
    
  })
  
  //event handler for when user presses a number button    
  $("div[data-value]").click(function(event){
    
    buttonSound.play();
    if(bool == true){ 
      
      clearSubScreen();
      clearMainScreen();
      numberArray = [];
      operationArray = [];
      
    }else{

      var check = checkForOperation();
          
      if(check == true){

        updateOperationArray();
        clearMainScreen();
           
      }
    } 
    
    if(operationArray.length == numberArray.length){    
      bool = false;
      recordNumberOnScreen(event);
    }
    
  })
  
  
  //event handler for when user presses an operation button    
  $("div[data-operation]").click(function(event){
    
    bool = false;
    buttonSound.play();
    var check = checkForNumber();
    
    if(check == true || numberArray.length == operationArray.length + 1){
      
      updateNumberArray();
      clearMainScreen();
      recordOperationOnScreen(event);
      
    }
        
  })
    
  
  //event handler for when user presses the equal sign button    
  $("#equal-button").click(function(){
    
    bool = false;
    buttonSound.play();
    var check = checkForNumber();
    
    if(check == true){
        
      updateNumberArray();
      
      if(numberArray.length > operationArray.length){
                      
        var number = compute();
        screen.textContent = number;
        var subScreenText = subScreen.textContent;
        subScreenText = subScreenText + " = " + number;
        
        if(subScreenText.length > 25){
          
          subScreenText = "= " + number;
          
        }
        
        subScreen.textContent = subScreenText;
                 
      }else{
        
        alert("array length error!!!");
        
      }
    }
  })
 
  
  //event handler for when user presses AC button    
  $("#all-clear").click(function(event){
    
    bool = false;
    buttonSound.play();

    clearMainScreen();
    clearSubScreen();
    clearNumberArray();
    clearOperationArray();

  })

  
  //event handler for when user presses the CE button    
  $("#clear-entry").click(function(event){
    
    buttonSound.play();
    if(bool == true){
      
      clearMainScreen();
      clearSubScreen();
      clearNumberArray();
      clearOperationArray();
      
    }else{
      
      clearLastEntry();
      
    }
    
   bool = false;     
    
  })
  
});