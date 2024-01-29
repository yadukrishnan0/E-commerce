

const email=document.getElementById('email')
const password=document.getElementById('password')
const confirmpassword=document.getElementById('confirmpassword')

const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
const checkemail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const labemail=document.querySelector(".labemail")
const labpass=document.querySelector(".labpassword")
const labcon=document.querySelector(".labcon")

// const labcon=document.querySelector(".labcon")



password.onblur = () => {
    if (checkPass.test(password.value)) {
        labpass.innerHTML = 'password';
        labpass.classList.remove('redlabel');
    } else if (!checkPass.test(password.value)){
        labpass.innerHTML = 'Invalid password format';
        labpass.classList.add('redlabel');
    }
    else if(!password.value){
        labpass.innerHTML = 'enter your password';
        labpass.classList.add('redlabel');
    }
};
email.onblur = () => {
    
    if (checkemail.test(email.value)) {
        labemail.innerHTML = 'Email';
        labemail.classList.remove('redlabel');
    } else {
        labemail.innerHTML = 'Invalid email ';
        labemail.classList.add('redlabel');
    }
};

confirmpassword.onblur = () => {
    const passTrue=confirmpassword.value === password.value;
    if(!passTrue){
        
        labcon.innerHTML='password is no match';
        labcon.classList.add('redlabel');
    }
    else{
        labcon.innerHTML='Confirm Password';
        labcon.classList.remove('redlabel');
    }
    
}
