var running = false;
var new_msg="";
var cat_msg="";
var falg="COMP";
var server="http://127.0.0.1:5000";
/*function catselectmsg() {
     //if ("{{ cat_message }}" == "True") {
     if(document.getElementsByClassName("categorybox").value == "JOBSEEKER" )
     {
            cat_msg="OK Candidate, How can I help you";
            var div = document.createElement("div");
            div.innerHTML = "<div class='chat-message'>" + cat_msg + "</div>";
            div.className = "chat-message-div";
            document.getElementById("message-box").appendChild(div);
            running = false;
     }
    else
    {
        cat_msg="OK, How can I help you";
        var div = document.createElement("div");
        div.innerHTML = "<div class='chat-message'>" + cat_msg + "</div>";
        div.className = "chat-message-div";
        document.getElementById("message-box").appendChild(div);
        running = false;
    }
  }*/

    function Jselect() {
            cat_msg="OK Candidate, How can I help you";
            var div = document.createElement("div");
            div.innerHTML = "<div class='chat-message'>" + cat_msg + "</div>";
            div.className = "chat-message-div";
            document.getElementById("message-box").appendChild(div);
            running = false;
            flag="JS";
            window.setTimeout(function()
                    {
                    // Move to a new location or you can do something else
                            //window.location.href = "http://localhost:8000/templates/login_signup.html";
                            window.open("http://localhost:8000/templates/login_signup.html", "_blank");
                    }, 2000);
            }
    function Cselect() {
            cat_msg="OK, How can I help you";
            var div = document.createElement("div");
            div.innerHTML = "<div class='chat-message'>" + cat_msg + "</div>";
            div.className = "chat-message-div";
            document.getElementById("message-box").appendChild(div);
            running = false;
            flag="COMP";
            }



    function send() {
        if (running == true)
            return;
        var msg = document.getElementById("message").value;
        if (msg == "")
            return;
        running = true;
        //addMsg(msg)
        //AJAX

        //AJAX COMES HERE

        var chat_last = {'lastmsg': [msg],'flag': [flag]};
        $.ajaxSetup({async: false});
        $.ajax({
        type: "POST",
        url: server+"/predict",
        data: JSON.stringify(chat_last),
        dataType: 'json'
        })
        .done(function (resp_dict) {
        console.log(resp_dict.response);
        new_msg = resp_dict.response;
        new_tag = resp_dict.tag;
        })
        .fail(function()   { alert("error")   ; }  );

        $.ajaxSetup({async: true});



        var div = document.createElement("div");
        div.innerHTML = "<span style='flex-grow:1'></span><div class='chat-message'>" + msg + "</div>";
        div.className = "chat-message-div";
        document.getElementById("message-box").appendChild(div);
        document.getElementById("message").value = "";

        //AJAX COMES HERE

        /*var chat_last = {'lastmsg': [msg]};
        var server="http://127.0.0.1:5000";
        $.ajax({
        type: "POST",
        url: server+"/predict",
        data: JSON.stringify(chat_last),
        dataType: 'json'
        })
        .done(function (resp_dict) {
        console.log(resp_dict.response);
        new_msg = resp_dict.response;
        })
        .fail(function()   { alert("error")   ; }  );*/

        
        var div = document.createElement("div");
        div.innerHTML = "<div class='chat-message'>" + new_msg + "</div>";
        div.className = "chat-message-div";
        document.getElementById("message-box").appendChild(div);
        running = false;
        //window.setTimeout(addResponseMsg, 100, new_msg)
        //window.alert(new_tag);
        if(new_tag=='Jobapply')
        {
            window.setTimeout(function()
                    {
                    // Move to a new location or you can do something else
                            //window.location.href = "http://localhost:8000/templates/login_signup.html";
                            window.open("http://localhost:8000/templates/job_appli_form.html", "_blank");
                    }, 2000);
        }


    }
    /*function addMsg(msg) {
        var div = document.createElement("div");
        div.innerHTML = "<span style='flex-grow:1'></span><div class='chat-message'>" + msg + "</div>"
        div.className = "chat-message-div"
        document.getElementById("message-box").appendChild(div)
        document.getElementById("message").value = "";
    }
    /*function addResponseMsg(new_msg) {
        var div = document.createElement("div");
        div.innerHTML = "<div class='chat-message'>" + new_msg + "</div>"
        div.className = "chat-message-div"
        document.getElementById("message-box").appendChild(div)
        running = false;
    }*/
    document.getElementById("message").addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            send();
        }
    });
