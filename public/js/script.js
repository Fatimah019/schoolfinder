import { get } from "http";

$.getJSON('http://jsonplaceholder.typicode.com/posts', function(data){
    var template=$('#one_results').html();
    var mustache=Mustache.to_html(template, data);
    $('#school-list').html(mustache);
})
