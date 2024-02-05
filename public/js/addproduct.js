"use strict"
// .......................product image  change....................
function handleImageChange() {
    const imageInput = document.getElementById('productImage');
    const previewImage = document.getElementById('previewImage');

    const file = imageInput.files[0];

    if (file) {
        
        const reader = new FileReader();

       
        reader.onload = function(e) {
      
            previewImage.src = e.target.result;
        };

        
        reader.readAsDataURL(file);
    } else {
       
        previewImage.src = "";
    }
}



// -------------------------------------

const submitBtn=document.querySelector('.submitBtn');
const errMsg=document.querySelector(".errorMsg");

submitBtn.addEventListener('click',async(e)=>{
try{

      e.preventDefault()

                      
const productName = document.getElementsByName('productName')[0].value
const price = document.getElementsByName('price')[0].value
const discount = document.getElementsByName('discount')[0].value
const stock = document.getElementsByName('stock')[0].value
const category = document.getElementsByName('category')[0].value
const  subCategory = document.getElementsByName('subCategory')[0].value
const  description= document.getElementsByName('description')[0].value
const  productImage= document.getElementsByName('productImage')[0].value


const addProductform = document.getElementById('form')
const form = new FormData(addProductform)


if(!productName || !price || !discount || !stock || !category || !subCategory || !subCategory || !description || !productImage){
    errMsg.innerHTML ="please fill the form";
    setTimeout(()=>{
        errMsg.innerHTML = ''

    },2000);
}
else{
    const response = await fetch('/admin/addproducts',{
        method:'POST',
        body:form
    })


 const result = await response.json()
    
    if(!response.ok){
     throw new Error ('Error in add product fetch ,product already exist')
    }
    else{

      if(result.success){
        errMsg.innerHTML = 'product successfuly added'
        errMsg.classList.add('success')
        setTimeout(() => {
            window.location.href = '/admin/home'
        }, 500);

      }
      else{
        errMsg.innerHTML = result.ERR
    }
    }
}
      }catch(error){
        console.log('error in add product',error);
      }
    })