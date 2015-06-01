(function(){
  'use strict';

  var repoArray = [];

  $(document).ready(function(e){
    var token = localStorage.getItem('GITHUB_TOKEN');
    $('body').prepend(JST['application']({loggedIn: !!token}));
    if(token) {
      app(token);
    } else {
      var matches = window.location.href.match(/\?code=(.*)/);
      var code = matches && matches[1];
      if(code) {
        $.getJSON('http://localhost:9999/authenticate/'+code, function(data) {
          localStorage.setItem('GITHUB_TOKEN', data.token);
          window.location.replace('/');
        });
      }
    }
  });


    function app(token) {
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
        })
        .then(userOrgs);
      });

      $.ajax({
        url: "https://api.github.com/user/repos",
        headers: {
          "Authorization": "token " + GITHUB_TOKEN
        }
      }).then(repoData)
    }

    function userData(data) {
      console.log(data);
      $('.sidebar').prepend(JST['sidebar'](fixDate(data)));
      $('.top-nav-right').prepend(JST['top-nav-user'](data));
      getStarred(data);
      return data;
    }

    function getStarred(data) {
      $.ajax({
        url: "https://api.github.com/users/" + data.login + "/starred"
      }).then(starredData);
    }

    function starredData(data) {
      $('.user-starred h4').text(data.length);
    }

    function userOrgs(data) {
      $('.sidebar').append(JST['sidebar-orgs'](data));
    }

    function repoData(data) {
      _.each(data, function(item) {
        var today = new Date();
        var difference = today - (new Date(item.updated_at));
        return item.updated = updatedLast(difference, item.updated_at);
      });
      $('.repo-list').append(JST['repo-item'](data.sort(sortRepos).reverse()));
      repoArray = data;
      return data;
    }

    function updatedLast(difference, updated) {
      if (Number(difference) < 86400000) {
        return lessThanADay[difference](difference);
      } else if(Number(difference) < 2592000000) {
        return (Math.round(difference / 86400000)).toString() + " days ago";
      } else {
        return shortHandDate(updated);
      }
    }

    function shortHandDate(updated) {
      var myDate = updated.slice(0,10).split('-');
      var myMonth = months[myDate[1]]();
      if (Number(myDate[2]) < 10) {
        myDate[2] = myDate[2].slice(1,2);
      }
      return updated = myMonth + ' ' + myDate[2];
    }

    function fixDate(data) {
      var myDate = (data.created_at).slice(0,10).split('-');
      var myMonth = months[myDate[1]](); 
      if (Number(myDate[2]) < 10) {
        myDate[2] = myDate[2].slice(1,2);
      }
      data.created_at = myMonth + ' ' + myDate[2] + ', ' + myDate[0];
      return data;
    }

    function sortRepos(a, b) {
      var dateA = new Date(a.updated_at), dateB = new Date(b.updated_at)
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

    var lessThanADay = {
      '60000': function(item) {
        return (Math.round(item / 1000)).toString() + ' seconds ago'
      },
      '3600000': function(item) {
        return (Math.round(item / 60000)).toString() + ' minutes ago'
      },
      '86400000': function(item) {
        return (Math.round(item /3600000)).toString() + ' hours ago'
      }
    }

    $(document).on('click', '.login', function(e){
      window.location.replace('https://github.com/login/oauth/authorize?client_id=c76a5cce9a1d3c44517e');
    });

    $('.top-nav-search').on('keypress', function(e) {
      var code = e.keyCode;
      if (code === 13) {
        var searchTerm = $('.top-nav-search').val();
        window.location.replace('http://github.com/search?utf8=✓&q=' + searchTerm);
      }
    });

    $('.repo-nav-search').on('keyup', function(e) {
      searchRepos();
    });

    function searchRepos() {
      var searchTerm = $('.repo-nav-search').val();
      var filteredRepos = _.filter(repoArray, function(repo) {
        return repo.name.indexOf(searchTerm) != -1;
      });
      $('.repo-list').html('');
      $('.repo-list').append(JST['repo-item'](filteredRepos.sort(sortRepos).reverse()));
    }

    $('.repo-nav-search-submit').on('click', function(e) {
      var searchTerm = $('.repo-nav-search').val();
      window.location.replace('https://github.com/search?q=user%3A' + repoArray[0].owner.login + '+' + searchTerm);
    })

    $('.profile-edit').on('click', function(e) {
      window.location.replace('https://github.com/account');
    });

    $('.repo-new').on('click', function(e) {
      window.location.replace('https://github.com/new');
    })

})();