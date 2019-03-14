jQuery(document).ready(function($){


$('#submit_image').click(function( e ){
 
		var is_error_image = 0;
		var is_error_captcha = 0;
		if( $('#image_id').val() == "" ){
			is_error_image = 1;
		}
		if( $('#frame_id').val() == "" ){
			is_error1 = 1;
		}
		
		
		
		// recaptcha validation
	  
		var data = {
			response  : $('#g-recaptcha-response').val(),
			action : 'verify_captcha'
		}
		jQuery.ajax({url: wws_local_data.ajaxurl,
				type: 'POST',
				data: data,            
				beforeSend: function(msg){
						jQuery('#submit_image').attr("disabled", true);
					},
					success: function(msg){
						
						
						console.log( msg );
						
						jQuery('#submit_image').attr("disabled", false);
						var obj = jQuery.parseJSON( msg );
						
						console.log( obj );
						console.log( obj.success );
						if( obj.success == false ){
			 
							is_error_captcha = 1;
							e.preventDefault();
							alert('Please, check captcha!');
						}else{
							if( is_error_image == 0 ){
								$('#hidden_submit').click();
							}
						}
						 
					} , 
					error:  function(msg) {
									
					}          
			});
		if( is_error_image == 1 ){
			e.preventDefault();
			alert('Please, select image!');
		}
		if( is_error_captcha == 1 ){
			
		}
	})

	
	// Uploading files	var file_frame;	
	// Uploading files
	var file_frame;

	  jQuery('.upload_image').live('click', function( event ){

		var parent = $(this).parents('.media_upload_block');
		var if_single = $(this).attr('data-single');
	  
		event.preventDefault();

		// If the media frame already exists, reopen it.
		if ( file_frame ) {
		  file_frame.open();
		  return;
		}

		// Create the media frame.
		if( if_single == 1 ){
			file_frame = wp.media.frames.file_frame = wp.media({
			  title: jQuery( this ).data( 'uploader_title' ),
			  button: {
				text: jQuery( this ).data( 'uploader_button_text' ),
			  },
			  multiple: false  // Set to true to allow multiple files to be selected
			});
		}else{
			file_frame = wp.media.frames.file_frame = wp.media({
			  title: jQuery( this ).data( 'uploader_title' ),
			  button: {
				text: jQuery( this ).data( 'uploader_button_text' ),
			  },
			  multiple: true  // Set to true to allow multiple files to be selected
			});
		}

		// When an image is selected, run a callback.
		file_frame.on( 'select', function() {
			if( if_single == 1 ){
				// We set multiple to false so only get one image from the uploader
				attachment = file_frame.state().get('selection').first().toJSON();
				$('.item_id', parent).val( attachment.id );
				$('.image_preview', parent).html( '<img src="'+attachment.url+'" />' );
				// Do something with attachment.id and/or attachment.url here
			}else{
				var selection = file_frame.state().get('selection');	
				
				selection.map( function( attachment ) {						
					attachment = attachment.toJSON();					
					console.log( attachment.id );
					console.log( attachment.url );
					
					var this_val = [];
					if( $('.item_id', parent).val() != '' ){
						
						var this_tmp = $('.item_id', parent).val();						
						this_val = this_tmp.split(',');
					}
					this_val.push( attachment.id );
					$('.item_id', parent).val( this_val.join(',') );
			 
					$('.image_preview', parent).append( '<img src="'+attachment.url+'" />' );
				})
			}
		});

		// Finally, open the modal
		file_frame.open();
	  });
	
	
	
});