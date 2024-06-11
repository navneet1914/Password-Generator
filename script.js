
const inputSlider = document.querySelector("[data-lengthSlider]");  //Passed custom attribute for slider custom attribute fetch krane k lie square bracket me likhna jruri hai
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; //symbols ki string khud se bnayi h taaki isme se randomly fetch krwa ske password generate krte waqt


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
// function call-->
handleSlider();  //handleSlider ka kaam bss itna sa h ki ye passwordLength ko UI pe reflect krwata h
//set strength circle color to grey
setIndicator('#ccc')


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min) * 100/(max-min)) + '% 100%'
} 

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow khud se set kre
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min //Check copy
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));  //ASCII code--> a-97 z-123 check copy
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length); //Sbse pehle humne symbols naam ka ek string bnaya h jisme kch symbols ko store krwa lia. Fir getRandomInteger ko use kr k 0 se le k symbols ka jitna length h waha tk random integer fetch krwaya h.
    return symbols.charAt(randNum);  //jo v random integer return hua h 0 se symbols.length tak uss position pe kaun sa character h vo hume charAt bta dega
}

function calcStrength(){
     let hasUpper = false;
     let hasLower = false;
     let hasNum = false;
     let hasSym = false;
     if(uppercaseCheck.checked) hasUpper = true; //koi v checkbox ticked h usko agr check krna h then we use .checked property
     if(lowercaseCheck.checked) hasLower = true;
     if(numbersCheck.Checked) hasNum = true;
     if(symbolsCheck.checked) hasSym = true;

     if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator('#0f0');
     } else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
     ){
        setIndicator('#ff0');
     } else {
        setIndicator('#f00');
     }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);  //always returns a promise. check copy
        copyMsg.innerText = "copied";   //error prone tha esilie try me daale hai
    }
    catch(e) {
        copyMsg.innerText = "Failed";  //fail ho jaega to ye krenge
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");  //jb css add krenge tb kaam aaega ye

    setTimeout( () => {
        copyMsg.classList.remove("active"); //2 sec k baad htane me kaam aaega 
    },2000);

}

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;  //passwordLength waale no ko hm equal kra die hai slider k value k(e.target.value slider ka value darsha rha hai)
    handleSlider();  //UI me change show krne k lie ye kia h
})

copyBtn.addEventListener('click', ()=>{
    if (passwordDisplay.value)  //passwordDisplay agr empty nai h to copy hoga wrna ni hoga
        copyContent();
});


function handleCheckBoxChange(){
   checkCount = 0;
   allCheckBox.forEach((checkbox) =>{
      if(checkbox.checked)
        checkCount++;
   })
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);  //for Each loop lga k harr ek checkbox k upar event listener lga dia.. Agr ye change hai mtlb tick v ho skta h aur unticked v tb hanclecheckbox naam ka funcn call hoga
})

generateBtn.addEventListener('click', () =>{
   //none of the checkbox are selected
   if(checkCount == 0) return;  //agr kch v check ni kia hua h to password ni milega bhiya

   if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();}

    //let's start the journey to find the new password-->
    password = "";  //purane password ko empty kr dia hai-- ye important hai

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    
    //compulsory Addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    function shufflePassword(array){
        //Fisher Yates Method-- ye method kisi v array k upar apply kr k hm shuffle krwa skte h uss array ko
        for (let i = array.length - 1; i > 0; i--) {

            //random j find out kr re h
            const j = Math.floor(Math.random() * (i + 1));

            //swapping kr re h ye teen line se
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }

          //after shuffling hmne password ko in the form of string return kr dia
        let str = ""; //ek empty string bnaya
        array.forEach((val) => (str += val)); //array me for each loop lga k humne uske harr ek value ko string me add krwa dia
        return str; 
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculating strength
    calcStrength();
});
 