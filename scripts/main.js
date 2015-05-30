(function(){
  'use strict';

  $(document).ready(function(){

    $.ajax({
      url: "https://api.github.com/user",
      headers: {
        "Authorization": "token " + GITHUB_TOKEN
      }
    }).then(userData)
      .then(function(data) {
      $.ajax({
        url: "https://api.github.com/users/" + data.login + "/orgs",
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
    }).then(repoData)
    .then(function(data) {

    });

    function repoData(data) {
      console.log(data);
      $('.content').append(JST['repo-item'](data.sort(sortRepos).reverse()));
      return data;
    }

    function userData(data) {
      console.log(data);
      $('.sidebar').prepend(JST['sidebar'](fixDate(data)));
      $('.top-nav-right').prepend(JST['top-nav-user'](data));
      return data;
    }

    function fixDate(data) {
      var myDate = (data.created_at).slice(0,10).split('-');
      var myMonth = months[myDate[1]](); 
      if (Number(myDate[2]) < 10) {
        myDate[2] = myDate[2].slice(1,2);
      }
      data.created_at = myMonth + ' ' + myDate[2] + ', ' + myDate[0];
      console.log(data.created_at);
      return data;
    }

    function sortRepos(a, b) {
      var dateA = new Date(a.created_at), dateB = new Date(b.created_at)
         return dateA-dateB;
    }

    var months = {
      '01': function() {
        return 'Jan';
      },
      '02': function() {
        return 'Feb';
      },
      '03': function() {
        return 'Mar';
      },
      '04': function() {
        return 'Apr';
      },
      '05': function() {
        return 'May';
      },
      '06': function() {
        return 'Jun';
      },
      '07': function() {
        return 'Jul';
      },
      '08': function() {
        return 'Aug';
      },
      '09': function() {
        return 'Sep';
      },
      '10': function() {
        return 'Oct';
      },
      '11': function() {
        return 'Nov';
      },
      '12': function() {
        return 'Dec';
      },
    }

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
