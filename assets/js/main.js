const loginBtn = document.querySelector('#signIn');
const signupBtn = document.querySelector('#signUp');
const goBack = document.querySelectorAll('.cancel');
const switchBtn = document.querySelectorAll('.auth-form__switch-btn');

const Modal = document.querySelector('.modal');
const signUpModal = document.querySelector('#signUpModal');
const logInModal = document.querySelector('#logInModal');

loginBtn.addEventListener('click', () => {
    openModal('login');
});

signupBtn.addEventListener('click', () => {
    openModal('signup');
})

for (let i = 0 ; i < goBack.length; i++){
    goBack[i].addEventListener('click', closeModal);
}

for (let i = 0 ; i < switchBtn.length; i++){
    switchBtn[i].addEventListener('click', (e) => {
        const target = e.target.innerText;
        if (target == 'Sign up'){
            openModal('signup');
        } else if (target == 'Sign in'){
            openModal('login');
        }
    });
}


function openModal(modal){
    if (modal == 'login') {
        Modal.style.display = 'flex';
        logInModal.style.display = 'block';
        signUpModal.style.display = 'none';
    } else if (modal == 'signup'){
        Modal.style.display = 'flex';
        logInModal.style.display = 'none';
        signUpModal.style.display = 'block';
    }
}

function closeModal() {
    Modal.style.display = 'none';
}