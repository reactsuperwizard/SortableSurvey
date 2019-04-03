<?php 

add_action('wp_ajax_submit_results', 'wsp_submit_results');
add_action('wp_ajax_nopriv_submit_results', 'wsp_submit_results');

function wsp_submit_results(){
	global $current_user, $wpdb;
	//if( check_ajax_referer( 'save_plan_security_nonce', 'security') ){
		parse_str($_POST['user_data'], $user_data);
		
		$args = array(
			'post_type' => 'survey',
			'post_status' => 'publish',
			'post_title' => sprintf(__('Assessment of %s %s '), $user_data['ufname'], $user_data['ufname'])
		);
		$id = wp_insert_post( $args );

		update_post_meta( $id, 'assessee_user_data', $user_data );
		update_post_meta( $id, 'survey_result', serialize( $_POST['results'] ) );
		var_dump($_POST['results']);

		generate_report($id);
		exit;


		if( $id ){
			echo json_encode( array( 'result' => 'success', 'text' => '<div class="alert alert-success text-center">'.__('Your results sent!').'</div>' ) );
		}else{
			echo json_encode( array( 'result' => 'error'  ) );
		}
	//}
	die();
}

?>