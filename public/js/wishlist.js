// window.onload = async function () {
//   try {
//     const response = await axios.post("/showwishlist");

//     const result = response.data;
//     if (result.success == false) {
//       console.log("user not logged");
//     }
//     if (result.success == true) {
//       let wishlists = response.data.wishlist[0].productId;
//       wishlists.forEach((id) => {
//         const heartbtn = document.querySelector(`.ll${id}`);
//         heartbtn.classList.add("fa-solid");
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
const hamburgerBtn = document.querySelector('.hamburger');
const mobilenavigationList = document.querySelector('.mobilenavigationList');
const mobilenavigation = document.querySelector('.mobilenavigation');
const logo = document.querySelector('.logo');

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    mobilenavigationList.classList.toggle('active');
    mobilenavigation.classList.toggle('active');
    logo.classList.toggle('active');
});

const filterBtn = document.querySelector('.fliterIcon');
const fliterMoblie = document.querySelector('.fliter-moblie');

filterBtn.addEventListener('click', () => {
    fliterMoblie.classList.toggle('active');
});



async function wishlist(e, productId) {
  try {
    e.preventDefault();
    // console.log(productId)
    const heartbtn = document.querySelector(`.ll${productId}`);

    if (heartbtn.classList.contains("fa-regular")) {
      heartbtn.classList.replace("fa-regular", "fa-solid");

      const response = await axios.post(`/addwishlist?id=${productId}`);

      const result = response.data;

      // console.log("Rate Limit Headers:", response.headers);

      if (result.login === false) {
        window.location.href = "/login";
      }
    } else {
      const response = await axios.post(`/removewishlist?id=${productId}`);
      const result = response.data;
      if (result.removeproduct === true) {
        heartbtn.classList.replace("fa-solid", "fa-regular");
      } else {
        console.log("remove wishlist error");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// search products functionlity

async function search() {
  try {
    const searchBar = document.getElementById("search_bar");
    const searchValue = searchBar.value.trim();
    if (searchValue) {
      window.location.href = `/search?query=${searchValue}`;
    }
  } catch (err) {
    console.log("search error", err);
  }
}
