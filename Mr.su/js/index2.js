var count = 0;


$(document).ready(function()
{
	$("." + "replyOfreplyContent").hide();

	$( "." + "Like" ).click(function() 
	{
		if(count % 2 == 0)
		{
			$("." + "Like" + "Btn").css({'color':'#407fff','font-weight':'bold'});
			$("." + "Like" + "Font").css({'color':'#407fff','font-weight':'bold'});
		}
		else
		{
			$("." + "Like" + "Btn").css({'color':'#60666f','font-weight':'normal'});
			$("." + "Like" + "Font").css({'color':'#60666f','font-weight':'normal'});
		}
		count++;
	});


	$( "." + "replyOfreply" ).click(function() 
	{
		$(this).hide();
		$("." + "replyOfreplyContent").show();
	});
});