var i = 0;

window.addEventListener("load", function(){
    var path = window.location.href;
    if(path.includes("http://localhost:3000/register") || path.includes("information.html"))
    {
        let tab1 = document.getElementById("reg");
        tab1.style.color = "#2eca6a";
    }
    else if(path.includes("http://localhost:3000/login"))
    {
        let tab3 = document.getElementById("log");
        tab3.style.color = "#2eca6a";
    }
    else if(path.includes("http://localhost:3000/"))
    {
        let tab2 = document.getElementById("hom");
        tab2.style.color = "#2eca6a";
        window.setInterval(changeImage, 3000);
    }
});

var bckimageele = document.getElementById("bck");

function changeImage() {   
    var BackgroundImg=["images/HomeBackground/Home-Wallpaper-4.jpg",
        "images/HomeBackground/Home-Wallpaper-1.jpg",
        "images/HomeBackground/Home-Wallpaper-6.jpg",
        "images/HomeBackground/Home-Wallpaper-9.jpg",
        "images/HomeBackground/Home-Wallpaper-10.jpg",
        "images/HomeBackground/Home-Wallpaper-17.jpg",
        "images/HomeBackground/Home-Wallpaper-25.jpg",
        "images/HomeBackground/Home-Wallpaper-32.jpg",
        "images/HomeBackground/Home-Wallpaper-33.jpg",
        "images/HomeBackground/Home-Wallpaper-35.jpg"
    ];
    bckimageele.style.backgroundImage = 'url("' + BackgroundImg[i] + '")';
    if(i===9)
    {
        i = 0;
    }
    else
    i++;
}
