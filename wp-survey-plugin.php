<?php
/*
Plugin Name: wp-survey-plugin
Plugin URI: http://webexpert1102.wordpress.com
Description: jQuery Sortable Survey.
Version: 1.0
Author: rsm0128 Chengmin Li
Author URI: http://webexpert1102.wordpress.com
Stable tag: 1.0
*/

//error_reporting(E_ALL);
//ini_set('display_errors', 'On');


// core initiation
if( !class_Exists('rsmMainStartSurvey') ){
	class rsmMainStartSurvey{
		var $locale;
		var $counter;
		public $survey_array;
		
		function __construct( $locale, $includes, $path, $survey_array ){
			$this->locale = $locale;
			$this->counter = 0;
		 
			$this->survey_array = $survey_array;
			
			// include files
			foreach( $includes as $single_path ){
				include( $path.$single_path );				
			}
			// calling localization
			add_Action('init', array( $this,'init_action' ) );
			
			add_action('plugins_loaded', array( $this, 'myplugin_init' ) );
			
			// old settings
			//add_action('admin_menu', array( $this, 'add_menu_item') );
			
			
			// custom output
			add_filter( 'manage_edit-survey_columns', array( $this, 'system_columns' ) );
			add_action( 'manage_survey_posts_custom_column', array( $this, 'custom_column_values' ), 10, 2 );
			 
		}
		
		// custom columns
		function system_columns(){		
			$columns = array(
				'cb' => '<input type="checkbox" />',		
				'title' => __( 'Title' ),
			);
			
			foreach( $this->survey_array as $single ){
				$columns[sanitize_title( $single['title'] )] = $single['title'];
			}

			return $columns;
			
		}
		
		
		// columns output
		function custom_column_values( $column, $post_id ) {
			global $post;
			$current_array = unserialize( get_post_meta( $post_id, 'survey_result', true ) );
		 
			foreach( $this->survey_array as $single ){
				if( $column == sanitize_title( $single['title'] ) ){			
					echo @implode( ',', $current_array[$this->counter] );
					$this->counter++;
					if( $this->counter >= count($this->survey_array) ){
						$this->counter = 0;
					}
				}
			}
			
			
		}
		
		// itint loc
		function myplugin_init() {
			$plugin_dir = basename(dirname(__FILE__));
			load_plugin_textdomain( $this->locale , false, $plugin_dir );
		}
		
		// on init actions
		function init_action(){	
			global $post;
			$obj = new SurveyData($this->survey_array );
			
			
			$meta_box = array(
				'title' => 'Survey Results',
				'post_type' => 'survey',
				'position' => 'advanced',
				'place' => 'high'
			);
			$fields_parameters = array();	

			foreach( $this->survey_array as $single ){
				$fields_parameters[] = array(
					'type' => 'text',
					'title' => $single['title'],
					'name' => sanitize_title( $single['title'] ),
					  
				);
			}
			
			$new_metabox = new rsmMetaBox22( $meta_box, $fields_parameters); 
			
		}
		
		// menu insertion
		function add_menu_item(){
 
			add_options_page(  				  
				__('Survey Enries', $this->locale), 
				__('Survey Enries', $this->locale), 
				'edit_published_posts', 
				'show_settings', 
				array( $this, 'show_settings') 
				);
			
		}
		
		// show settings callback
		function show_settings(){
			
			$args = array(
				'post_type' => 'survey',
				'showposts' => -1,
				'post_status' => 'draft'
				
			);
			$all_entries = get_posts( $args );
 
			$out = '<div class="wrap tw-bs4">
			<h2>'.__('Results', $this->locale).'</h2>
			<hr/>';
			
			$out .= '
			<table class="table">
				  <thead>
					<tr>
					  <th scope="col">#</th>';
				$cnt = 1;
				foreach( $this->survey_array as $single ){
					$out .= '<th scope="col">Variant '.$cnt.'</th>';
					$cnt++;
				}
				$out .= '
					</tr>
				  </thead>
				  <tbody>
					'; 
			$cnt = 1;
			if( count( $all_entries ) > 0 ){
				foreach( $all_entries as $single ){
					$current_array = get_post_meta( $single->ID, 'survey_result', true );
					if( !$current_array || $current_array == '' ){ continue; }
					$out .= '<tr>
						<td>'.$cnt.'</td>
					';
						$cur_value = unserialize( $current_array );
						foreach( $cur_value as $s_value ){
							$out .= '<td>'.implode(',', $s_value ).'</td>';
						}
						
					$out .= '</tr>';
					$cnt++;
					}
				}
	 
			$out .= '		
				  </tbody>
				</table>
			';
			
			$out .= '</div>';
			echo $out;
		}
		  
	}
	
	
}
// main params array
	$array = array(
				array(
					'title' => 'Question 1',
					'values' => array(
						'a' => 'Variant a',
						'b' => 'Variant b',
						'c' => 'Variant c',
						'd' => 'Variant d',
					),
				),
				array(
					'title' => 'Question 2',
					'values' => array(
						'a1' => 'Variant a1',
						'b1' => 'Variant b1',
						'c1' => 'Variant c1',
						'd1' => 'Variant d1',
					),
				),
				array(
					'title' => 'Question 3',
					'values' => array(
						'a3' => 'Variant a3',
						'b3' => 'Variant b3',
						'c3' => 'Variant c3',
						'd3' => 'Variant d3',
					),
				),
			);


// initiate main class
new rsmMainStartSurvey('wsp', array(
	'modules/scripts.php',
	'modules/output.php',
	'modules/ajax.php',
	'modules/cpt.php',
	'modules/meta_box.php',
), dirname(__FILE__).'/', $array );

 
 
?>