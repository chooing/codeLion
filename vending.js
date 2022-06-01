const machineDrinkList = document.querySelectorAll('.drinks-list li'); //자판기 음료들
const cartList = document.querySelector('.cart-list'); // 장바구니 음료 리스트
const buyList = document.querySelector('.buy-list'); //획득한 음료 리스트
const cartArr = new Map(); // 클릭된 음료 목록

const buyInfo = document.querySelector('.buy-wrap');
const countMoneyTag = buyInfo.querySelector('.count-money'); //잔액

const userInfo = document.querySelector('.user-info');
const userMoneyTag = userInfo.querySelector('.money-wrap .user-wallet .user-money'); // 소지금
const allMoneyTag = userInfo.querySelector('.user-drinks .all-count .all-money'); // 총금액


let userMoney = 50000000; // 초기 소지금 설정
let countMoney = 0; // 잔액 설정
userMoneyTag.textContent = numComma(userMoney);
countMoneyTag.textContent = numComma(countMoney);

buyInfo.addEventListener('click',(e)=>{
    if(e.target.classList.contains('btn-get')){ //입금버튼 눌렀을 때
        const inpMoney = + e.target.previousElementSibling.value;

        userMoney -= inpMoney;
        countMoney += inpMoney
        
        countMoneyTag.textContent = numComma(countMoney);
        userMoneyTag.textContent = numComma(userMoney);
        
    }else if(e.target.classList.contains('btn-return')){ // 거스름돈 반환 버튼 눌렀을 때
        userMoney += countMoney;
        userMoneyTag.textContent = numComma(userMoney);
        
        countMoney = 0;
        countMoneyTag.textContent = numComma(countMoney);
        
    }else if(e.target.classList.contains('btn-buy')){ // 획득 버튼 눌렀을 때
        console.log('획득 버튼');
    }
});


machineDrinkList.forEach(drinkLi => { // 음료 선택 시 cart-list에 넣기
    drinkLi.addEventListener('click',(e)=>{
        const drinkName = e.currentTarget.dataset.drinkName;

        if(cartArr.has(drinkName)){
            const drinkCountTag = cartList.querySelector(`li[data-drink-name="${drinkName}"]`);
            let count = cartArr.get(drinkName);
            
            if(count<10){
                ++count;
                cartArr.set(drinkName, count);
                drinkCountTag.querySelector('span').textContent=count;

                if(count===10) e.currentTarget.classList.add('sold-out');// 10개 구매 => 품절
            }

        }else{
            cartArr.set(drinkName,1);
            makeDrink(drinkName, cartArr.get(drinkName), true);
        }
    });
});    

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