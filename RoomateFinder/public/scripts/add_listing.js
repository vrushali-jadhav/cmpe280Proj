
var slideIndex = 0;

function placeGen()
{
        window.localStorage.setItem("place", document.getElementById("place").value);
        window.localStorage.setItem("genderpre", document.getElementById("gender_pref").value);
        window.location = '/getuserlisting2';
}

function rentAvailale()
{
        window.localStorage.setItem("amount", document.getElementById("amount").value);
        window.localStorage.setItem("date_available", document.getElementById("movein").value);
        window.location = '/getuserlisting3';
}

function address()
{
        window.localStorage.setItem("country", document.getElementById("country").value);
        window.localStorage.setItem("add1", document.getElementById("add1").value);
        window.localStorage.setItem("add2", document.getElementById("add2").value);
        window.localStorage.setItem("city", document.getElementById("city").value);
        window.localStorage.setItem("state", document.getElementById("state").value);
        window.localStorage.setItem("zipcode", document.getElementById("zipcode").value);
        window.location = '/getuserlisting4';
}

function amenities()
{
        if(document.getElementById("gym").checked)
            window.localStorage.setItem("gym", "true");
        else
            window.localStorage.setItem("gym", "false");

        if(document.getElementById("pool").checked)
            window.localStorage.setItem("pool", "true");
        else
            window.localStorage.setItem("pool", "false");

        if(document.getElementById("washer_dryer"))
            window.localStorage.setItem("laundry", "yes");
        else
            window.localStorage.setItem("laundry", "false");

        if(document.getElementById("parking").checked)
            window.localStorage.setItem("parking", "yes");
        else
            window.localStorage.setItem("parking", "false");

        window.localStorage.setItem("other", document.getElementById("other").value);

        //pets
        if(document.getElementById("cat").checked)
        {
          console.log("dog checked");
          window.localStorage.setItem("petfriendly", "cat");
        }
        else if(document.getElementById("dog").checked)
        {
          window.localStorage.setItem("petfriendly", "dog");
        }
        else if(window.localStorage.setItem("petfriendly", "no_pets"))
        {
          window.localStorage.setItem("petfriendly", "none");
        }

        //smoking
        if(document.getElementById("yes").checked)
        {
          console.log("smoking checked");
          window.localStorage.setItem("smokingfriendly", "true");
        }

        if(document.getElementById("no").checked)
          window.localStorage.setItem("smokingfriendly", "false");
        
        //save entries to sql
        uploadPosts();
}

function uploadImages()
{
    alert("In 'uploadimages'");
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('/api/photo', {})
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log(response);
            } else {
                console.log('failed')
            }
    });
}

function uploadPosts()
{
  var address =  window.localStorage.getItem("add1") + "," + window.localStorage.getItem("add2") + "," + window.localStorage.getItem("city") + "," 
  + window.localStorage.getItem("state") + "," +window.localStorage.getItem("country") + "," + window.localStorage.getItem("zipcode") + "."
  const data = {
      place: window.localStorage.getItem("place"),
      gender: window.localStorage.getItem("genderpre"),
      amount: window.localStorage.getItem("amount"),
      date: window.localStorage.getItem("date_available"),
      gym: window.localStorage.getItem("gym"),
      pool: window.localStorage.getItem("pool"),
      laundry: window.localStorage.getItem("laundry"),
      parking: window.localStorage.getItem("parking"),
      other: window.localStorage.getItem("zipcode"),
      petfriendly: window.localStorage.getItem("petfriendly"),
      smokingfriendly: window.localStorage.getItem("smokingfriendly"),
      other: window.localStorage.getItem("other"),
      add: address
    }

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('/postuserlisting', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log(response.data);
            } else {
                console.log('failed')
            }
    });

    window.location = '/getuserlisting5';
}

