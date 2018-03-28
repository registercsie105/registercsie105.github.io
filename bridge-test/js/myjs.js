var idlist = [];
var leftlist = [];
var timelist = [0,1,3,6,8,12];
var big = 0;
var total = 0;
var moveDis = 0;
var downDis = 130;

$(document).ready(function() 
{
	moveDis = window.innerWidth / 2 + 40;
	console.log(moveDis);
});

$(window).resize(function() 
{
	moveDis = window.innerWidth / 2 + 40;
	console.log(moveDis);
});


$("#rightbtn").hide();

$(".player").click(function(){
	if(idlist.indexOf(this.id)==-1 && idlist.length<3)
	{
		idlist.push(this.id);
		$( this ).animate({
			top: "+=" + downDis
		}, 1000, function() {
			
		});
	}
	else if(idlist.indexOf(this.id)!=-1)
	{
		idlist.splice(idlist.indexOf(this.id),1);
		$( this ).animate({
			top: "-=" + downDis
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
				top: "-=" + downDis ,
				left: add_minus + "=" + moveDis
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


function mytable()
{
	var myhtml = 
	'<table class="table"> ' +
		'<thead>' +
		'<tr>' +
			'<th width="50%" class="text-center">Player</th>' +
			'<th width="50%" class="text-center">Time(second)</th>' +
		'</tr>' +
		'</thead>' +

		'<tbody>' +
		'<tr>' +
	        '<td><img src="pics/1.png" width="50px" height="50px"></td>' +
	        '<td><h4>1</h4></td>' +
		'</tr>' +
		'<tr>' +
	        '<td><img src="pics/2.png" width="50px" height="50px"></td>' +
	        '<td><h4>3</h4></td>' +
		'</tr>' +
		'<tr>' +
	        '<td><img src="pics/3.png" width="50px" height="50px"></td>' +
	        '<td><h4>6</h4></td>' +
		'</tr>' +
		'<tr>' +
	        '<td><img src="pics/4.png" width="50px" height="50px"></td>' +
	        '<td><h4>8</h4></td>' +
		'</tr>' +
		'<tr>' +
	        '<td><img src="pics/5.png" width="50px" height="50px"></td>' +
	        '<td><h4>12</h4></td>' +
		'</tr>' +
    '</tbody>' +
	'</table>';

	return myhtml;
}

function readme()
{
	swal(
	{
	    title: '角色說明',
	    html:  mytable()

	}).then(function () 
	{
	    
	});
}