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

const fPrice = document.querySelectorAll(".fPrice");
const sTotal = document.querySelector("#sTotal");
const dPrice = document.querySelector("#dPrice");
const tPrice = document.querySelector("#tPrice");

// increment the quantity
async function inc(id, price, stock) {
  const qty = document.querySelector(`.qtyOne${id}`);
  const lPrice = document.querySelector(`.lPrice${id}`);
  const initialPrice = parseFloat(lPrice.innerHTML.replace("₹", ""));
  qty.innerHTML = +qty.innerHTML + 1;
  const newprice = qty.innerHTML * price;
  const qtyval = parseInt(qty.innerHTML);
  const stockval = parseInt(stock);

  const response = await axios.post("/cartquantity", {
    productid: id,
    qty: qtyval,
  });

  lPrice.innerHTML = `₹${newprice}`;

  const total1 = total(price);
  sTotal.innerHTML = `₹${total1}`;
  tPrice.innerHTML = `₹${total1}`;
  
  if (qtyval <= stockval) {
    lPrice.classList.remove("red");
    lPrice.innerHTML = `₹${newprice}`;
  } else {
    lPrice.classList.add("red");
    lPrice.innerHTML = "out of stock";
  }
}
function total(price) {
  const subtoal = sTotal.innerHTML.replace("₹", "");
  const grantTotal = parseInt(subtoal) + parseInt(price);
  return grantTotal;
}

// decrement the quantity
async function dec(id, price, stock) {
  const qty = document.querySelector(`.qtyOne${id}`);
  if (qty.innerHTML > 1) {
    const lPrice = document.querySelector(`.lPrice${id}`);

    const initialPrice = parseFloat(lPrice.innerHTML.replace("₹", ""));
    qty.innerHTML = +qty.innerHTML - 1;
    const newprice = qty.innerHTML * price;
    const qtyval = parseInt(qty.innerHTML);
    const stockval = parseInt(stock);
    const response = await axios.post("/cartquantity", {
      productid: id,
      qty: qtyval,
    });
    if (qtyval <= stockval) {
      lPrice.classList.remove("red");
      lPrice.innerHTML = `₹${newprice}`;
    } else {
      lPrice.classList.add("red");
      lPrice.innerHTML = "out of stock";
    }
    const total1 = total(price * -1);
    sTotal.innerHTML = `₹${total1}`;
    tPrice.innerHTML = `₹${total1}`;
  }
}

//  delete the product

async function deleteCart(id) {
  const response = await axios.post(`/deletecart?id=${id}`);
  const result = response.data;
  if (result.success === true) {
    const length = result.length;
    const proprice =document.querySelector(`.lPrice${id}`)
    let ttalprce = parseInt(tPrice.textContent.replace('₹',''))
    let productPrice =parseInt(proprice.textContent.replace('₹',''));

    let calculate =parseInt(ttalprce - productPrice) 
   
    tPrice.innerHTML=`₹${calculate}`
    sTotal.innerHTML=`₹${calculate}`
    document.querySelector(`.delete_tr${id}`).remove();
   
   
    const count = (document.querySelector(
      ".count"
    ).innerHTML = `Cart(${length})`);

    //
  } else {
    console.log("remove wishlist error");
  }
}
