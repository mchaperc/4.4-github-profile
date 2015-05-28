(function(){
  'use strict';

  $(document).ready(function(){
    $('body').prepend(JST['application']());
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
