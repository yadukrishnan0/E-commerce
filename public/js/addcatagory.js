let subcategoryName = document.getElementById('subcategoryName').value
const categoryName=document.getElementById('categoryName').value
const categoryImage=document.getElementById('categoryImage').value
const errMsg=document.querySelector('.errMsg')
const subcatagorys= [];
 function add () {
    if(subcategoryName == '' || categoryName== ''){
       errMsg.innerHTML='please fill the form'
       setTimeout(() => {
        errMsg.innerHTML=''
       },1000);
    }
   else{
    subcatagorys.push(subcategoryName);  
    subcategoryName.value=""
   } 
}


submitBtn.addEventListener('click',async(e)=>{
   try{
   
         e.preventDefault()
   
                         
   
   
   const addProductform = document.getElementById('form')
   const form = new FormData(addProductform)
   
   
   if(!subcategoryName || !categoryName ||!categoryImage){
       errMsg.innerHTML ="please fill the form";
       setTimeout(()=>{
           errMsg.innerHTML = ''
   
       },1000);
   }
   else{
       const response = await fetch('/admin/addcatagory',{
           method:'POST',
           body:form
       })
   
   
    const result = await response.json()
       
       if(!response.ok){
        throw new Error ('Error in add product fetch ,product already exist')
       }
       else{
   
         if(result.success){
           errMsg.innerHTML = 'catagory successfuly added'
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
