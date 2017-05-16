$(document).ready(function() {
    $(function() {
			  $('a#process_input').bind('click', function() {
				$.getJSON('/background_process', {
				  proglang: $('input[name="proglang"]').val(),
				}, function(data) {
				  //$("#result").text(data.result);
                   draw ();
				});
				return false;
			  });
			}

)
});