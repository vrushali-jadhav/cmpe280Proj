var slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");

  if (n > slides.length) {slideIndex = 0}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  if(slideIndex>0)
  {
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
  }
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: 37.334789,lng: -121.888138},
  });
  var geocoder = new google.maps.Geocoder();
  codeAddress(geocoder,map);
}

function codeAddress(geocoder,map){
  var address = document.getElementById('address_l').innerHTML;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            center: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
  });
}
// var postId = Document.getElementById("postid");
var postId = 1;
const data = {
  postId: postId
}

function sendLike()
{
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('/postLike', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status == 200) {
                console.log(response.data);
            } else {
                console.log('failed')
            }
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your like has been sent!',
      showConfirmButton: false,
      timer: 2500
    });

    event.preventDefault();
}

function sendNotification()
{
  alert("in send notification");
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  // axios.post('/sendLikeNotification', data)
  //     .then(response => {
  //         console.log("Status Code : ", response.status);
  //         if (response.status == 200) {
  //             console.log(response.data);
  //             swal("Congrats!", ", Your like has been sent!", "success");
  //             sendNotification();
  //         } else {
  //             console.log('failed')
  //         }
  // });
}

function message()
{
  document.location.href="http://35.167.216.61:3001/chat";
  event.preventDefault();
}
