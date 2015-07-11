$.getJSON("https://api.github.com/repos/titancast/TitanCast/commits?sha=indev", function(dat){
    
    var sha = dat[0].sha.substring(0,14), time = dat[0].commit.author.date, url = dat[0].html_url;
    
    
    
    $("#github").append("last updated "+ jQuery.timeago(time));
    $("#github").append("<a class='right grey-text text-lighten-2' href='"+url+"'>"+sha+"</a><span class='octicon octicon-git-commit right' style='margin-top:3px;margin-right:6px;'></span>");
    
});