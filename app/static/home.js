//slideshow javascript start
// let slideIndex = 0;
// let slidesTimeout = undefined;
// showSlides(slideIndex);
// function plusSlides(n){
//     if(typeof(slidestimeout) != undefined){
//         clearTimeout(slidesTimeout);
//     }
//     showSlides(slideIndex + n);
// }

// function showSlides(currentSlide = slideIndex){
// let i;
// let slides = document.getElementsByClassName("mySlides");
// let dots = document.getElementsByClassName("dot");
// for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
// }
// if(currentSlide == slideIndex){
//     ++slideIndex;
// }
// else{
//     slideIndex = currentSlide;
// }
// if (slideIndex > slides.length) {slideIndex = 1}
// if(slideIndex < 1)              {slideIndex = slides.length;}
// for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" activeSlide", "");
// }
// slides[slideIndex-1].style.display = "block";
// dots[slideIndex-1].className += " activeSlide";
// slidesTimeout = setTimeout(showSlides, 5000); // Change image every 2 seconds
// }
//slideshow javascript end
