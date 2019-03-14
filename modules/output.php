<?php 
class SurveyData{
	var $initial_array;
	var $output_text;
	
	function __construct( $array ){
		$this->initial_array = $array;
		
		//add shortcode
		add_shortcode( 'survey_output', array( $this, 'otuput_survey' ) );
		
	}
 
	function otuput_survey(){
		$out = '
		<div class="tw-bs4 survey_cont">
			<div class="loader"></div>
			<div class="container">
				<div class="row steps_block ">';
				$cnt = 0;
				foreach( $this->initial_array as $single_value ){

					if( $cnt == 0 ){
						$current_class = ' active_slide ';
						$cnt++;
					}else{
						$current_class = '  ';
					}
					$out .= '
					<div class="col-12 single_slide '.$current_class.'">';
						
						$out .= '<div class="question_title">'.$single_value['title'].'</div>';

						
						$out .= '<ul class="variant_container sortable_survey">';
						
							foreach( $single_value['values'] as $key => $value ){
								$out .= '<li class="single_variant" data-value="'.$key.'"><i class="fa fa-arrows arrow_holder" aria-hidden="true"></i>'.$value.' </li>';
							}
					 
							
						$out .= '</ul>';
					$out .= '
					</div>
					';
				}
		$out .= '
				</div>
				<div class="row  buttons_block">
					<div class="col-6">
						<button disabled class="btn btn-success prev_button">'.__( 'Prev' ).'</button>
					</div>
					<div class="col-6 text-right submit_block  d-none">
						<button class="btn btn-warning hide submit_button">'.__( 'Submit' ).'</button>
					</div>
					<div class="col-6 text-right next_button_block">
						<button class="btn btn-success next_button">'.__( 'Next' ).'</button>
					</div>
				</div>
			</div>
		</div>
		';
		return $out;
	}
}
 
?>