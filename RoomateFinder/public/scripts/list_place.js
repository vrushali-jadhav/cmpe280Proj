// var postid = 1;document.getElementById("postid").value;
var postid = 1;
const data = {
    postId: postid
}

var likedby = "";

function checkLikes()
{
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('/sendLikeNotification', data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status == 200) {
                var resdata = response.data;
                console.log(resdata);
                likedby = resdata["likedby"];
                console.log(likedby);
                if(likedby == "")
                {
                    Swal.fire('No likes yet.');
                }
                else
                {
                    var msg = "Your post has been liked by: "+likedby;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: false,
                        timer: 5500
                    });
                }
            } else {
                console.log('failed')
            }
    });
    
    event.preventDefault();
}
