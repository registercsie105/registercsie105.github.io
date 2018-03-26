var count = 0;
var idlist = [];
var timelist = [0,1,3,6,8,12];
var big = 0;

$("#rightbtn").hide();

$("img").click(function(){
	if(idlist.indexOf(this.id)==-1 && idlist.length<3)
	{
		idlist.push(this.id);
		count++;
		$( this ).animate({
			top: "+=100"
		}, 1000, function() {
			
		});
	}
});

function move(h,s,add_minus)
{
	if(idlist.length>1 && idlist.indexOf("light")!=-1)
	{
		$("#" + h).hide();
		$("#" + s).show();

		for(var i=0;i<idlist.length;i++)
		{
			var num = timelist[parseInt(idlist[i].replace("pic",""))];
			if(num > big)
			{
				big = num;
			}

			$("#" + idlist[i]).animate({
				top: "-=100" ,
				left: add_minus + "=800"
			}, 1000, function() {
				
			});
		}

		$("#log").append("<p> 花費了" + big + "秒！</p>");
		idlist = [];
		big = 0;
	}
}

$("#leftbtn").click(function()
{
	move("leftbtn","rightbtn","-");
});



$("#rightbtn").click(function()
{
	move("rightbtn","leftbtn","+");
});