const machineDrinkList = document.querySelectorAll('.drinks-list li'); //자판기 음료들
const cartList = document.querySelector('.cart-list'); // 장바구니 음료 리스트
const buyList = document.querySelector('.buy-list'); //획득한 음료 리스트
const cartDrinkMap = new Map(); // 장바구니 음료 Map
const userDrinkMap = new Map(); // 구매한 음료 Map

const buyInfo = document.querySelector('.buy-wrap');
const countMoneyTag = buyInfo.querySelector('.count-money'); //잔액

const userInfo = document.querySelector('.user-info');
const userMoneyTag = userInfo.querySelector('.money-wrap .user-wallet .user-money'); // 소지금
const allMoneyTag = userInfo.querySelector('.user-drinks .all-count .all-money'); // 총금액

let userMoney = 50000000; // 초기 소지금 설정
userMoneyTag.textContent = numComma(userMoney);

let countMoney = 0; // 잔액 설정
countMoneyTag.textContent = numComma(countMoney);

let allMoney = 0; // 총금액 설정
allMoneyTag.textContent = numComma(allMoney);

buyInfo.addEventListener('click',(e)=>{
    if(e.target.classList.contains('btn-get')){ //입금버튼 눌렀을 때
        const inpMoney =  e.target.previousElementSibling;
        const inpMoneyVal = + inpMoney.value;

        userMoney -= inpMoneyVal;
        countMoney += inpMoneyVal
        
        countMoneyTag.textContent = numComma(countMoney);
        userMoneyTag.textContent = numComma(userMoney);

        inpMoney.value = 0;
        
    }else if(e.target.classList.contains('btn-return')){ // 거스름돈 반환 버튼 눌렀을 때
        userMoney += countMoney;
        userMoneyTag.textContent = numComma(userMoney);
        
        countMoney = 0;
        countMoneyTag.textContent = numComma(countMoney);
        
    }else if(e.target.classList.contains('btn-buy')){ // 획득 버튼 눌렀을 때

        let cartMoney=0; //카트 총금액
        cartDrinkMap.forEach((val)=>cartMoney += (val * 1000));
            
        if(countMoney < cartMoney){ // 구매 실패
            alert('잔액이 부족합니다. 충전 후 이용해주세요.');
        }else{ // 구매 성공
            cartList.querySelectorAll('li').forEach(li=>li.remove()); // cart li 목록 지우기

            cartDrinkMap.forEach((val,key)=>{
                if(userDrinkMap.has(key)){
                    const drinkCountTag = buyList.querySelector(`li[data-drink-name="${key}"]`);
                    let hasDrinkCount = userDrinkMap.get(key) + val;
                    userDrinkMap.set(key, hasDrinkCount);
                    drinkCountTag.querySelector('span').textContent=hasDrinkCount;
                }else{
                    userDrinkMap.set(key,val);
                    makeDrink(key, val, false);
                }
                cartDrinkMap.delete(key);
            });

            countMoney -= cartMoney; // 잔액 update
            countMoneyTag.textContent = numComma(countMoney);

            allMoney += cartMoney;//총금액 update
            allMoneyTag.textContent = numComma(allMoney);
        }

    }
});


machineDrinkList.forEach(drinkLi => { // 음료 선택 시 cart-list에 넣기
    drinkLi.addEventListener('click',(e)=>{
        const drinkName = e.currentTarget.dataset.drinkName;

        if(cartDrinkMap.has(drinkName)){
            const drinkCountTag = cartList.querySelector(`li[data-drink-name="${drinkName}"]`);
            let count = cartDrinkMap.get(drinkName);
            
            if(count<10){
                ++count;
                cartDrinkMap.set(drinkName, count);
                drinkCountTag.querySelector('span').textContent=count;

                if(count===10) e.currentTarget.classList.add('sold-out');// 10개 구매 => 품절
            }
        }else{
            cartDrinkMap.set(drinkName,1);
            makeDrink(drinkName, cartDrinkMap.get(drinkName), true);
        }        
    });
    
});    


cartList.addEventListener('click',(e)=>{//장바구니 음료 빼기
    let clickedDrink;
    if(e.target.tagName ==="IMG" || e.target.tagName ==="STRONG" || e.target.tagName ==="SPAN"){
        clickedDrink=e.target.parentNode.parentNode.dataset.drinkName;
    }else if(e.target.tagName ==="BUTTON"){
        clickedDrink=e.target.parentNode.dataset.drinkName;
    }else if(e.target.tagName ==="LI"){
        clickedDrink=e.target.dataset.drinkName;
    }else{
        clickedDrink =null;
    }

    if(clickedDrink){
        let clickedCount = cartDrinkMap.get(clickedDrink);
        cartDrinkMap.set(clickedDrink,--clickedCount);

        const drinkCountTag = cartList.querySelector(`li[data-drink-name="${clickedDrink}"]`);
        drinkCountTag.querySelector('span').textContent=clickedCount;

        if(clickedCount===0){
            drinkCountTag.remove();
            cartDrinkMap.delete(clickedDrink);
        }
    }
},false);


function makeDrink(name, count, isCartList){//음료 li 만들어서 넣기
    const liEl = document.createElement('li');
    const imgEl = document.createElement('img');
    const strongEl = document.createElement('strong');
    const spanEl = document.createElement('span');
    
    imgEl.src = `./images/${name}.png`;
    strongEl.textContent=name;
    spanEl.textContent= count;
    liEl.dataset.drinkName = name;

    if(isCartList){//cart-list에 넣기
        const btnEl = document.createElement('button');
        btnEl.classList.add('cart-drink');
        btnEl.append(imgEl,strongEl,spanEl);
        liEl.appendChild(btnEl);
        cartList.prepend(liEl);

    }else{//buy-list에 넣기
        liEl.append(imgEl,strongEl,spanEl);
        buyList.prepend(liEl);
    }
}

function numComma(num){// 숫자에 , 찍기
    const numArr = (num+'').split('');
    
    if(numArr.length>3){
        let count = Math.floor(numArr.length / 3);
        if(numArr.length % 3 === 0){--count;}
        for (let i = count; i > 0; i--) {
            numArr.splice(i*-3,0,',');
        }
    }
    return numArr.join('');
}