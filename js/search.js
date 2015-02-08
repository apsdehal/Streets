$('document').ready( function(){
	$('.search-result').css("display","none");
});
$('.search-input').focusin( function(){
	displaysearch();
});
$('.search-input').focusout( function(){
	removesearch();
});

function displaysearch(){
	$('.search-result').css("display","block");
}

function removesearch(){
	$('.search-result').css("display","none");
}