<?php 
class SurveyShortcode{
	var $initial_array;
	
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
				<div class="row steps_block ">
					<div class="col-12 single_slide active_slide first_slide" style="margin-bottom:20px">
						<h1 style="font-size:30px;padding:20px 1em ;">PSIU Individual Assessment</h1>
						<form id="user-info-form">
						<div>
							<label>First Name *</label>
							<input type="text" name="ufname" value="" required class="user-input">
						</div>
						<div>
							<label>Last Name *</label>
							<input type="text" name="ulname" value="" required class="user-input">
						</div>
						<div>
							<label>Title *</label>
							<input type="text" name="utitle" value="" required class="user-input">
						</div>
						<div>
							<label>Email *</label>
							<input type="email" name="uemail" value="" required class="user-input">
						</div>
						<div>
							<label>Company *</label>
							<input type="text" name="ucompany" value="" required class="user-input">
						</div>
						<input type="hidden" name="sfname" class="text_field" id="" size="25" maxlength="255" value="">
						<input type="hidden" name="slname" class="text_field" id="" size="25" maxlength="255" value="">
						<input type="hidden" name="stitle" class="text_field" id="" size="25" maxlength="255" value="">
						<input type="hidden" name="semail" class="text_field" id="" size="25" maxlength="255" value="">
						</form>
					</div><!-- end of first_slide -->';


					$cnt = 0;
					foreach( $this->initial_array as $single_value ){

						$out .= '
						<div class="col-12 single_slide survey_data">
							<div class="row">
								<div class="col-10 survey-block">';
							
							$out .= '<div class="question_title">'.$single_value['title'].'</div>';

							
							$out .= '<ul class="variant_container sortable_survey">';
							
								foreach( $single_value['values'] as $key => $value ){
									$out .= '<li class="single_variant" data-value="'.$key.'"><i class="fa fa-arrows arrow_holder" aria-hidden="true"></i>'.$value.' </li>';
								}
						 
								
							$out .= '</ul>
								</div>
								<div class="col-2 arrow-block">
									<div class="most-like">Most like me</div>
									<div class="like-unlike-arrow"></div>
									<div class="least-like">Least like me</div>
								</div><!-- end of arrow-block -->
							</div>
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
			</div><!-- end of container -->
		</div><!-- end of survey_cont -->
		';
		return $out;
	}
}
 
?>