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
const cancelBtn = document.querySelector(".cancelBtn");

async function cancelOption(id) {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "Block user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Block!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const statusOrder = document.getElementById("statusOrder" + id);
        const response = await axios.post(`/admin/updatestatus?id=${id}`);
        const result = response.data;
        if (result.success == true) {
          Swal.fire({
            title: "BLOCKED!",
            text: "user blocked!.",
            icon: "success",
          });
        }
        statusOrder.innerHTML = "Cancelled";
        cancelBtn.style.display = "none";
      }
    });
  } catch (err) {
    console.log(err);
  }
}
