// collapse button
$(document).ready(function () {

    $('.hamburger-btn').on('click', function () {
  
      $('.hamburger').toggleClass('open');
    });
  });


  // dropdown menu's
var dropdownButtons = document.querySelectorAll(".dropdownButton");



dropdownButtons.forEach(button => {
  button.addEventListener("click", function() {
  
    if(button.nextElementSibling.classList.contains('hide')==true){
      console.log('yes');
      button.firstElementChild.innerHTML=`<i class="fas fa-chevron-down"></i>`;
      let sibling =button.nextElementSibling;
    sibling.classList.remove('hide');
   
    }else{

    button.firstElementChild.innerHTML=`<i class="fas fa-chevron-right"></i>`;
    let sibling =button.nextElementSibling;
    sibling.classList.add('hide');
  
    }
  });
  
});
   
   
 
