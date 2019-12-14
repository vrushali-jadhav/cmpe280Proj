$(function() {
  $( "i" ).click(function() {
    $( "i,span" ).toggleClass( "press", 1000 );
  });
});

window.addEventListener("load", function(){
    var path = window.location.href;
    if(path.includes("/loginpost"))
    {
        let tab2 = document.getElementById("hom");
        tab2.style.color = "#2eca6a";
    }
    else if(path.includes("/login"))
    {
        let tab3 = document.getElementById("lo");
        tab3.style.color = "#2eca6a";
    }
});


function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

