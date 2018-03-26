var idlist = [];
var leftlist = [];
var timelist = [0,1,3,6,8,12];
var big = 0;
var total = 0;

$("#rightbtn").hide();

$("img").click(function(){
	if(idlist.indexOf(this.id)==-1 && idlist.length<3)
	{
		idlist.push(this.id);
		$( this ).animate({
			top: "+=100"
		}, 1000, function() {
			
		});
	}
	else if(idlist.indexOf(this.id)!=-1)
	{
		idlist.splice(idlist.indexOf(this.id),1);
		$( this ).animate({
			top: "-=100"
		}, 1000, function() {
			
		});
	}
});

function move(h,s,add_minus,push_remove)
{
	if(idlist.length>1 && idlist.indexOf("light")!=-1)
	{
		$("#" + h).hide();
		$("#" + s).show();

		for(var i=0;i<idlist.length;i++)
		{
			if(push_remove == "push" && idlist[i]!="light")
			{
				leftlist.push(idlist[i]);
			}
			else if(push_remove == "remove" && idlist[i]!="light")
			{
				leftlist.splice(leftlist.indexOf(idlist[i]),1);
			}

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
		total += big;
		idlist = [];
		big = 0;
	}
}

$("#leftbtn").click(function()
{
	move("leftbtn","rightbtn","-","push");
	if(leftlist.length==5)
	{
		alert("你總共花費了 "+total+" 秒...");
	}
	console.log(leftlist);
});


$("#rightbtn").click(function()
{
	move("rightbtn","leftbtn","+","remove");
	console.log(leftlist);
});