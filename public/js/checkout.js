const hamburgerBtn = document.querySelector(".hamburger");
const mobilenavigationList = document.querySelector(".mobilenavigationList");
const mobilenavigation = document.querySelector(".mobilenavigation");
const logo = document.querySelector(".logo");

hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("active");
  mobilenavigationList.classList.toggle("active");
  mobilenavigation.classList.toggle("active");
  logo.classList.toggle("active");
});

const decBtn = document.querySelectorAll(".dec");
const incBtn = document.querySelectorAll(".inc");
const qty = document.querySelectorAll(".qtyOne");
const lPrice = document.querySelectorAll(".lPrice");
const fPrice = document.querySelectorAll(".fPrice");
const sTotal = document.querySelector("#sTotal");
const dPrice = document.querySelector("#dPrice");
const tPrice = document.querySelector("#tPrice");

decBtn.forEach((value, index) => {
  value.addEventListener("click", () => {
    if (Number(qty[index].innerHTML) !== 1) {
      qty[index].innerHTML = `${Number(qty[index].innerHTML) - 1}`;
      const sNum = Number(sTotal.innerHTML.replace(/[₹,]/g, ""));
      const fNum = Number(fPrice[index].innerHTML.replace(/[₹,]/g, ""));
      const subNum = sNum - fNum;
      sTotal.innerHTML = subNum.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
      const lNum = Number(lPrice[index].innerHTML.replace(/[₹,]/g, ""));
      let dNum = Number(dPrice.innerHTML.replace(/[-,]/g, ""));
      dNum = dNum - (fNum - lNum);
      if (dNum === 0) {
        dPrice.innerHTML = `0`;
      } else {
        dNum = dNum.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        });
        dPrice.innerHTML = `${dNum.replace(/[₹]/g, "-")}`;
      }
      let tNum = Number(tPrice.innerHTML.replace(/[₹,]/g, ""));
      tNum = tNum - lNum;
      tPrice.innerHTML = tNum.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    }
  });
});

incBtn.forEach((value, index) => {
  value.addEventListener("click", () => {
    qty[index].innerHTML = `${Number(qty[index].innerHTML) + 1}`;
    const sNum = Number(sTotal.innerHTML.replace(/[₹,]/g, ""));
    const fNum = Number(fPrice[index].innerHTML.replace(/[₹,]/g, ""));
    const subNum = sNum + fNum;
    sTotal.innerHTML = subNum.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    const lNum = Number(lPrice[index].innerHTML.replace(/[₹,]/g, ""));
    let dNum = Number(dPrice.innerHTML.replace(/[-,]/g, ""));
    dNum = dNum + (fNum - lNum);
    dNum = dNum.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    dPrice.innerHTML = 0;
    dPrice.innerHTML = `${dNum.replace(/[₹]/g, "-")}`;
    let tNum = Number(tPrice.innerHTML.replace(/[₹,]/g, ""));
    tNum = tNum + lNum;
    tPrice.innerHTML = tNum.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  });
});

const creditCard = document.querySelector("#creditCard");
const credit = document.querySelector(".credit");
const COD = document.querySelector("#COD");

creditCard.addEventListener("click", () => {
  credit.classList.add("togggle");
});

COD.addEventListener("click", () => {
  credit.classList.remove("togggle");
});

const radio = document.querySelectorAll(".radio");
const paymentaddress = document.querySelector(".paymentaddress");
radio.forEach((element) => {
  element.addEventListener("change", () => {
    const value = element.value;
    const data = JSON.parse(value);

    paymentaddress.innerHTML = `${data.address},${data.city},${data.district},${data.state},${data.postcode},`;
  });
});

async function applyCoupon(event) {
    event.preventDefault()
  try {
    const couponName = document.querySelector(".couponName").value;
  const discount =document.getElementById('cDPrice')
    const response = await axios.post(`/userApplyCoupon`, {
      couponCode: couponName,
    });
    const result = response.data;
    const discountedPrice=result.discountedPrice;
    const discountValue =result.coupondiscount;
    if (result.success) {
       tPrice.innerHTML=`₹${discountedPrice}`;
       discount.innerHTML=`${discountValue}%`;
    }
  } catch (err) {
    console.log(err);
  }
}


const radioBtn = document.querySelectorAll('.payMethod');
const paymentaddres = document.querySelector('.paymentaddress')
let payMethod;
radioBtn.forEach((radio)=>{
  radio.addEventListener('change',()=>{
     if(radio.checked){
      payMethod = radio.value
     }
  })
})

async function payment(e){
  e.preventDefault();
  if(!payMethod){
    error.innerHTML='please select payment method'
  }else{
    error.innerHTML =''
    const totalPrice = tPrice.textContent.replace('₹','');
    const address = paymentaddres.textContent.replace(/\s+/g, ' ').trim()
    const response = await axios.post('/chechkoutPayment',{
      payMethod:payMethod,
      address:address,
      totalPrice:totalPrice,
    });
    const result = response.data;
    if(result.COD == true){
      window.location.href = '/oderConfirm'
    }
  }
 
}