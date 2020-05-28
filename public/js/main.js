//navigation script
const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
const exit = document.querySelector('#exit');

menu.addEventListener('click', function(e){
nav.classList.toggle('hide-mobile');
e.preventDefault();
});

exit.addEventListener('click', function(e){
    nav.classList.add('hide-mobile');
    e.preventDefault();
    });
