$(document).ready(function () {
	$('#button').on('click',function(){
        
        $('#tdata').html('');
        $('#table').hide();
        $('.infoOrg').hide();
        obj.arr.length = 0;
		var org = $('#organization').val();
		obj.find(org);
	});
	$('body').on('click','.sort',function(){
        obj.field = $(this).attr('data-attr');
        var type = $(this).attr('data-type');
        if (type == 'numb'){
            obj.arr.sort(compare);
        }
        else{
           obj.arr.sort(alphanum); 
        }
		// вывести
		$('#tdata').html('');
		for(var i=0; i<obj.arr.length; i++) {
  			obj.createInfoUsers(obj.arr[i]);
		}
	});
    $('body').on('click','.sort_rev',function(){
        obj.field = $(this).attr('data-attr');
        var type = $(this).attr('data-type');
        if (type == 'numb'){
            obj.arr.sort(compare).reverse();
        }
        else{
           obj.arr.sort(alphanum).reverse(); 
        }
        // вывести
        $('#tdata').html('');
        for(var i=0; i<obj.arr.length; i++) {
            obj.createInfoUsers(obj.arr[i]);
        }
    });
});

function compare(a,b){
    return a[obj.field] - b[obj.field];
}
function alphanum(a, b) {

    function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
    }

    var aa = chunkify(a[obj.field] ? a[obj.field].toLowerCase() : '');
    var bb = chunkify(b[obj.field] ? b[obj.field].toLowerCase() : '');

    for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x]);
            if (c == aa[x] && d == bb[x]) {
                return c - d;
            } else return (aa[x] > bb[x]) ? 1 : -1;
        }
    }
    return aa.length - bb.length;
}

var obj = {};
obj.arr=[];
obj.find = function(org){
	$.ajax({
        type:"GET",
        url:'https://api.github.com/users/' +org,
        success: function(data){
        	$('.infoOrg').show();
			$('.login').html(data.login);
			$('.name').html(data.name);
			$('.fols').html(data.followers);
			$('.folg').html(data.following);
			$('.loc').html(data.location);
        },
        fail:function(){
            alert("error");
        }
    });
    
    $.ajax({
        type:"GET",
        url:'https://api.github.com/orgs/' +org+ '/public_members',
        success: function(data){
            obj.findUsers(data);
        },
        fail:function(){
            alert("error");
        }
    });
}

obj.findUsers = function(data){
	$('#table').show();
	//createH();
	for(var i=0;i<data.length;i++){
		$.ajax({
        type:"GET",
        url:'https://api.github.com/users/'+ data[i].login,
        success: function(data){
        	obj.arr.push({
                avatar_url: data.avatar_url,
                login: data.login,
                name:data.name || '-',
                company:data.company || '-',
                email:data.email || '-',
                followers:data.followers,
                following:data.following,
                public_repos:data.public_repos
            });
        	obj.createInfoUsers(data);
        },
        fail:function(){
            alert("error");
        }
    	});
	}
}

obj.createInfoUsers = function(data){
    var tr = document.createElement('tr');
	tr.innerHTML = "<td><img src = \" "+data.avatar_url+" \"/></td><td>"+data.login+"</td><td>"+data.name+"</td><td>"+data.company+"</td><td>"+data.email+"</td><td>"+data.followers+"</td><td>"+data.following+"</td><td>"+data.public_repos+"</td>";
    document.getElementById('tdata').appendChild(tr); 
}