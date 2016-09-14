$(document).ready(function() {
	$('.removeBook').click(function(e) {
		e.preventDefault();
		var bookId = $(this).data('id');

		console.log(bookId);
		$.ajax({
			url: '/manage/book/delete/' + bookId,
			type: 'GET',
			success: function(result) {
		    // Do something with the result
		    }
		});

		window.location = '/manage/books';
	});

	$('.removeCategory').click(function(e) {
		e.preventDefault();
		var catId = $(this).data('id');

		$.ajax({
			url: '/manage/category/delete/' + catId,
			type: 'GET',
			success: function(result) {
		    // Do something with the result
		    }
		});

		window.location = '/manage/categories';
	});
});