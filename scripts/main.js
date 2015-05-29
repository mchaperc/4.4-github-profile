(function(){
  'use strict';

  $(document).ready(function(){

    $.ajax({
      url: "https://api.github.com/user",
      headers: {
        "Authorization": "token " + GITHUB_TOKEN
      }
    }).then(function(user) {
      console.log(user);
      $('.sidebar').prepend(JST['sidebar'](user));
      return user;
    }).then(function(user) {
      $.ajax({
        url: "https://api.github.com/users/" + user.login + "/orgs",
        headers: {
          "Authorization": "token " + GITHUB_TOKEN
        }
      }).then(function(orgs) {
        console.log(orgs);
        $('.sidebar').append(JST['sidebar-orgs'](orgs));
      })
    });

    $.ajax({
      url: "https://api.github.com/user/repos",
      headers: {
        "Authorization": "token " + GITHUB_TOKEN
      }
    }).then(function(data) {
      console.log(data);
      $('.content').append(JST['repo-item']((data.sort(function(a, b){
         var dateA = new Date(a.created_at), dateB = new Date(b.created_at)
         return dateA-dateB;
        })).reverse()));
    });

   	var code = window.location.href.match(/\?code=(.*)/)[1];

   	if (code) {
   		$.getJSON('http://localhost:9999/authenticate/'+code, function(data) {
		 console.log(data.token);
		});
   	}
   	
  });

  $('button').on('click', function(e) {
  	window.location.replace('https://github.com/login/oauth/authorize?client_id=c76a5cce9a1d3c44517e');
  });

})();
