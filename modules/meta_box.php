<?php 
if( !class_exists( 'vooMetaBox22' ) ){
	class vooMetaBox22{
		
		private $metabox_parameters = null;
		private $fields_parameters = null;
		private $data_html = null;
		var $counter;
		
		function __construct( $metabox_parameters , $fields_parameters){
			$this->metabox_parameters = $metabox_parameters;
			$this->fields_parameters = $fields_parameters;
 
			$this->counter = 0;
 
			add_action( 'add_meta_boxes', array( $this, 'add_custom_box' ) );
			add_action( 'save_post', array( $this, 'save_postdata' ) );
		}
		
		function add_custom_box(){
			add_meta_box( 
				'custom_meta_editor_'.rand( 100, 999 ),
				$this->metabox_parameters['title'],
				array( $this, 'custom_meta_editor' ),
				$this->metabox_parameters['post_type'] , 
				$this->metabox_parameters['position'], 
				$this->metabox_parameters['place']
			);
		}
		function custom_meta_editor(){
			global $post;
			
			$out = '

			<div class="tw-bs4">
				<div class="form-horizontal ">';
			
			foreach( $this->fields_parameters as $single_field){
			 
				switch( $single_field['type'] ){
					
					case "text":
					$values = unserialize( get_post_meta( $post->ID, 'survey_result', true ) );
					$out .= '<div class="form-group">
						<label class="control-label" for="input01">'.$single_field['title'].'</label>  
						 
						  <input type="text" class="form-control input-xlarge" name="survey-'.$single_field['name'].'" id="'.$single_field['name'].'" value="'.implode( ',', $values[$this->counter] ).'">  
						  
					  </div> ';	
					  $this->counter++;
					break;
					
				}
			}		
			
					
					
			$out .= '
					</div>	
				</div>
				';	
			$this->data_html = $out;
			 
			$this->echo_data();
		}
		
		function echo_data(){
			echo $this->data_html;
		}
		
		function save_postdata( $post_id ) {
			global $current_user; 
			 if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
				  return;

			  if ( 'page' == $_POST['post_type'] ) 
			  {
				if ( !current_user_can( 'edit_page', $post_id ) )
					return;
			  }
			  else
			  {
				if ( !current_user_can( 'edit_post', $post_id ) )
					return;
			  }
			  /// User editotions
			 
				if( get_post_type($post_id) == $this->metabox_parameters['post_type'] ){
					$out_arr = array();
					foreach( $_POST as $k => $v ){
						if( substr_count( $k, 'survey-' ) > 0 ){
							$tmp = explode( ',', stripslashes( $v ) );
							$out_arr[] = $tmp;
						}
					}
					if( count($out_arr) > 0 ){
						update_post_meta( $post_id, 'survey_result', serialize( $out_arr ) );
					}
					
					 
				}
				
			}
	}
}

  
 

?>