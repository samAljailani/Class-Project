var main = document.getElementById("main");

function displayMenu(){
	document.getElementById("menu").style.width="250px";
	document.getElementById("header").style.marginLeft="250px";
	main.style.marginLeft="250px";
	main.addEventListener('click', closeMenu);
	let temp = document.getElementById("button-container");
    if(temp !== undefined){
        temp.style.marginLeft = "250px";
    }
}

function closeMenu(){
	document.getElementById("menu").style.width="0px";
	document.getElementById("header").style.marginLeft="0px";
	main.style.marginLeft="0px";
	main.removeEventListener('click', closeMenu);
	let temp = document.getElementById("button-container");
    if(temp !== undefined){
        temp.style.marginLeft = "0px";
    }

}
