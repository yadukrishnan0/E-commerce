
const cartBtn2 = document.querySelector(".cartBtnclass");

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await axios.post("/showaddtocart");

    const result = response.data;
    if (result.success == false) {
      console.log("user not logged");
    }
    if (result.success == true) {
      let cart = response.data.cartlist;
  
      
      cart.forEach((id) => {
      
        if (cartBtn2.classList.contains(`cartBtn${id}`)) {
          const cartBtn3=document.querySelector(`.cartBtn${id}`)
          cartBtn3.innerHTML = "go to cart";
        }
      
      });
    }
  } catch (err) {
    console.log(err);
  }
});

async function addTocart(e, id) {
  e.preventDefault();
  const cartBtn = document.querySelector(`.cartBtn${id}`);
  const cartBtnTxt = cartBtn.textContent;

  try {
    console.log(id);
    if (cartBtnTxt == "add to cart") {
      const response = await axios.post(`/addtocart?id=${id}`);
      const result = response.data;
      console.log(result);
      
      if (result.login == false) {
        window.location.href = "/login";
      } else if (result.success == true) {
        cartBtn.innerHTML = "go to cart";
      }
    } else {
      window.location.href = "/cart";
    }
  } catch (err) {
    console.log(err);
  }
}
