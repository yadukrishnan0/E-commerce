
async function removeSubcata(event,catId,id) {
    const subcata=document.querySelector(`.sublist${id}`)
    const subtxnt=subcata.textContent;
    console.log()
  event.preventDefault(subtxnt);

  try {
    const response = await axios.delete(`/admin/deletesubcategory?id=${catId}&sub=${subtxnt}`);
    const result = response.data;
    if (result.success) {
      document.querySelector(`.sublist${id}`).remove();
    }
  } catch (error) {
    console.log(error);
  }
}



const addCategory = document.getElementById('categoryForm');
const submitBtn = document.getElementById('addBtn');
const id=submitBtn.getAttribute('data-id')


let subCategories = [];

const categoryName = document.getElementById('categoryName').value;



const addBtn = document.getElementById('subcategoryBtn');
addBtn.addEventListener('click', () => {
    let subCategoryInput = document.getElementById('subCategoryName');
    let subCategory = subCategoryInput.value;

    if (subCategory) {
        subCategories.push(subCategory);
        subCategoryInput.value = ''; 
    }

});


submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const errorMsg = document.querySelector('.errorMg');
    let subCategoryInput = document.getElementById('subCategoryName').value
    if(subCategoryInput){
        subCategories.push(subCategoryInput);
    }
    const categoryName = document.getElementById('categoryName').value
    const categoryimage = document.getElementById('imageInput').files[0];
   
     
        try {
            console.log(subCategories);
            const formData = new FormData()
            formData.append('subCategory',JSON.stringify(subCategories));
            formData.append('categoryName',JSON.stringify(categoryName));
            formData.append('categoryImage',categoryimage)
            
            const response = await axios.post(`/admin/updatecatagory?id=${id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'  
                }
              });
        
            if (response.status === 200) {  
              errorMsg.style.visibility = 'visible';
              errorMsg.classList.add('success');
              errorMsg.innerHTML = 'Category update';
        
              setTimeout(() => {
                window.location.href = '/admin/categoryList';
              }, 1000);
            } else {
              console.log('Error adding category');
              
            }
          } catch (err) {
            console.error(err);
          }
        
    });
    