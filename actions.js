//Pre defined variables and arrays
let screen = document.getElementById('main-content'),
  subScreen = document.getElementById('sub-content'),
  bool = false,
  numberArray = [],
  operationArray = [],
  buttonSound = new Audio('https://drive.google.com/uc?export=download&id=0Bw2029NKQAh_TU42TEttd3dSN2c')

function clearMainScreen(){
  screen.textContent = ''
}

function clearAllData(){
  screen.textContent = ''
  subScreen.textContent = ''
  numberArray = []
  operationArray = []
}

function clearLastEntry(){

  let lastEntry = screen.textContent,
    subScreenStatement = subScreen.textContent,
    index = subScreenStatement.lastIndexOf(lastEntry)

  subScreenStatement = subScreenStatement.substring(0, index)
  subScreen.textContent = subScreenStatement
  screen.textContent = ''
}

function recordNumberOnScreen(event){

  let number = event.target.getAttribute('data-value')

  $('#main-content').append(number)
  $('#sub-content').append(number)
}

function recordOperationOnScreen(event){

  let operation = event.target.getAttribute('data-operation')

    $('#main-content').html(operation)
    $('#sub-content').append(' ' + operation + ' ')
}

function updateNumberArray(){

  let screenData = screen.textContent
  if (numberArray.length === operationArray.length) numberArray.push(screenData)
}

function updateOperationArray(){

  let screenData = screen.textContent,
    operationCode

  switch (screenData){
       case '+':
         operationCode = 0
         break
       case '-':
         operationCode = 1
         break
       case '*':
         operationCode = 2
         break
       default:
         operationCode = 3
         break
  }

  operationArray.push(operationCode)
}

//searches to see if most recent entry was an operation returns a boolean
function checkForOperation(){

  let digit = /[0-9\.]/,
    operation = false

  if (digit.test(screen.textContent) === false && screen.textContent !== '') operation = true

  return operation
}

//searches to see if most recent entry was a number returns a boolean
function checkForNumber(){

  let digit = /[0-9]/,
    number = false

  if (digit.test(screen.textContent) === true) number = true

  return number
}

//performs calculations
function compute(){

  bool = true

  let number1,
    number2,
    finalNumber,
    finalNumberString,
    operation,
    length = operationArray.length

  //for setting numbers equal to themselves "8 = 8"
  if (length === 0) finalNumber = numberArray[0]

  //Combines all data from number and operation arrays
  for (var i = 0; i < length; i++){

    number1 = parseFloat(numberArray.shift())
    number2 = parseFloat(numberArray.shift())
    operation = operationArray.shift()

    //converts the code in our operation array to actual operations
    switch (operation){
      case 0:
        finalNumber = number1 + number2
        break
      case 1:
        finalNumber = number1 * 10000 - number2 * 10000
        finalNumber = finalNumber / 10000
        break
      case 2:
        finalNumber = number1 * number2
        break
      default:
        finalNumber = number1 / number2
        break
    }

    finalNumberString = finalNumber.toString()
    //creates an exponential versioln of our final answer if its too long
    if (finalNumberString.length > 10) finalNumber = finalNumber.toExponential(6)

    //plugs finalNumber back into array in case the user wants to use it for further computation
    numberArray.unshift(finalNumber)
  }

  return finalNumber
}

function changeNumberSign(){

  let oringinalNumber = screen.textContent,
    oringinalSubScreen = subScreen.textContent,
    newNumber = parseFloat(oringinalNumber) * (-1),
    index,
    newSubScreen

  screen.textContent = newNumber

  //changing the subScreen string so that our sign change appears on the bottom portion of the screen
  index = oringinalSubScreen.lastIndexOf(oringinalNumber)
  newSubScreen = oringinalSubScreen.substring(0, index)

  newSubScreen = newSubScreen + newNumber
  subScreen.textContent = newSubScreen
}


$(document).ready(function(){

  //Event handler when user wants to change the number's sign
  $('#change-sign').click(function(){

    let check = checkForNumber()

    bool = false
    buttonSound.play()


    if (check === true) changeNumberSign()
  })

  //event handler for when user presses a number button
  $('div[data-value]').click(function(event){

    let check

    buttonSound.play()
    if (bool === true){

      clearAllData()

    } else {

      check = checkForOperation()

      if (check === true){
        updateOperationArray()
        clearMainScreen()
      }
    }

    if (operationArray.length === numberArray.length){
      bool = false
      recordNumberOnScreen(event)
    }
  })


  //event handler for when user presses an operation button
  $('div[data-operation]').click(function(event){

    let check = checkForNumber()

    bool = false
    buttonSound.play()

    if (check === true || numberArray.length === operationArray.length + 1) {

      updateNumberArray()
      clearMainScreen()
      recordOperationOnScreen(event)
    }
  })


  //event handler for when user presses the equal sign button
  $('#equal-button').click(function(){

    let check = checkForNumber(),
      number,
      subScreenText

    bool = false
    buttonSound.play()

    if (check === true){

      updateNumberArray()

      if (numberArray.length > operationArray.length){

        number = compute()
        screen.textContent = number
        subScreenText = subScreen.textContent + ' = ' + number

        if (subScreenText.length > 25) subScreenText = '= ' + number

        subScreen.textContent = subScreenText

      } else {
        alert('array length error!!!')
      }
    }
  })


  //event handler for when user presses AC button
  $('#all-clear').click(function(){

    bool = false
    buttonSound.play()

    clearAllData()
  })


  //event handler for when user presses the CE button
  $('#clear-entry').click(function(){

    buttonSound.play()

    if (bool === true) clearAllData()
    else clearLastEntry()

    bool = false
  })
})
