function makeList(num , listText , huding , ts)
{
    var listID = "list" + num;
    var categoryID = "category" + num;

    var myhtml = 
    '<li id="' + listID + '">' +
        '<a href="#' + categoryID + '">' + listText +
        '</a>' + 
        makeEditDeleteButton(num,huding,ts) +
    '</li>';

    return myhtml;
}

function makeEditDeleteButton(num , huding , ts)
{
    var myhtml = 
    '<button class="btn nothing"></button>' + 
    '<button class="btn btn-danger pull-right"' + 
    'onclick="DeleteItem(' + num + ',' + huding + ',' + ts + ');" >' + 
    '   <span class="glyphicon glyphicon-trash"></span>' + 
    '</button>' + 
    '<button class="btn btn-info pull-right"' + 
    'onclick="EditItem(' + num + ',' + huding + ',' + ts + ');" >' + 
    '   <span class="glyphicon glyphicon-pencil"></span>' + 
    '</button>';

    return myhtml;
}


function makeCategory(num , listText)
{
    var categoryID = "category" + num;
    var categoryTitleID = "categoryTitle" + num;

    var myhtml = 
    '<div class="panel panel-' + mypanel_colors[num%mypanel_colorsLen] + '">' +
        '<div class="panel-heading">' +
             '<div class="row">' + 
                '<div class="alignleft">' +
                    '<strong class="panel-title" id="' + categoryTitleID + '">' + listText + '</strong>' +
                '</div>' +
                '<div class="alignright">' +
                    '<button class="btn btn-success " onclick="addAlert(' + num + ');">' + '新增</button>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div id ="' + categoryID + '" class="panel-body color-' + mypanel_colors[num%mypanel_colorsLen] + '">' +

        '</div>' +
    '</div>';


    return myhtml;
}


function makeImage(hudingID , tsID , imageID , name , price , src , intro , top10 , category)
{
    var mynum = parseInt(imageID.split("_")[0].replace("category",""));

    var myhtml = 
    '<div class="col-xs-4 text-center border-' +  
        mypanel_colors[mynum%mypanel_colorsLen] + '"' +
        ' hudingID = ' + hudingID + 
        ' tsID = ' + tsID + 
        ' imageID = "' + imageID + '"' +
        ' name = "' + name + '"' +
        ' price = "' + price + '"' +
        ' src = "' + src + '"' +
        ' intro = "' + intro + '"' +
        ' top10 = ' + top10 + 
        ' category = "' + category + '"' +
        ' id="' + imageID + '">' +
        '<a onclick="' +  
            'editAlert(' + hudingID + "," + tsID +  ",'" + 
            imageID + "','" + name + "','" + price + "','" + src + "','" + 
            intro + "'," + top10 + ",'" + category + "'" + 
            ');">' + 
            '<img src="' + src + '" >' +
        '</a>' +
    '</div>';

    return myhtml;
}

function maketop10(hudingID , tsID , imageID , name , price , src , intro , top10 , category)
{
    var myhtml = 
    '<a class="' + imageID + '"' + 
        ' hudingID = ' + hudingID + 
        ' tsID = ' + tsID + 
        ' imageID = "' + imageID + '"' +
        ' name = "' + name + '"' +
        ' price = "' + price + '"' +
        ' src = "' + src + '"' +
        ' intro = "' + intro + '"' +
        ' top10 = ' + top10 + 
        ' category = "' + category + '"' +
        ' onclick="' +  
        'editAlert(' + hudingID + "," + tsID +  ",'" + 
            imageID + "','" + name + "','" + price + "','" + src + "','" + 
            intro + "'," + top10 + ",'" + category + "'" + 
            ');">' + 
        '<img src="' + src + '" class="img-circle Stories"/>' +
    '</a>';

    return myhtml;
}