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
	$('.search-input').val('Rome');
	$('.search-result').css("display","block");
}

function removesearch(){
	$('.search-input').val('');
	$('.search-result').css("display","none");
}
