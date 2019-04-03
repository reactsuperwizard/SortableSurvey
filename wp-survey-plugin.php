<?php
/**
 * Plugin Name: PSIU Assessment Plugin
 * Plugin URI: http://webexpert1102.wordpress.com
 * Description: PSIU Assessment Plugin For Lex.
 * Version: 1.0
 * Author: rsm0128
 * Author URI: http://webexpert1102.wordpress.com
 * Stable tag: 1.0
*/

if( !class_Exists('rsmPsiuAssessment') ){

    class rsmPsiuAssessment{

        var $locale;
        var $counter;
        public $ind_assess_fields;
        public $user_info_fields;
        
        function __construct( $locale, $includes, $base_path ){
            // init member variables
            $this->locale = $locale;
            $this->counter = 0;
            
            // include files
            foreach( $includes as $file_name ){
                include( $base_path . $file_name );             
            }


            $this->ind_assess_fields = rsmPsiuConfig::$ind_assess_fields;
            $this->user_info_fields = rsmPsiuConfig::$user_info_fields;

            // init actions
            add_action('init', array( $this,'init' ) );
            add_action('plugins_loaded', array( $this, 'plugins_loaded' ) );
            //add_action('admin_menu', array( $this, 'add_menu') );
            
            // custom output
            add_filter( 'manage_edit-survey_columns', array( $this, 'system_columns' ) );
            add_action( 'manage_survey_posts_custom_column', array( $this, 'custom_column_values' ), 10, 2 );

            new SurveyShortcode($this->ind_assess_fields);
             
        }

        // on plugins_loaded action
        function plugins_loaded() {
            $plugin_dir = basename(dirname(__FILE__));
            load_plugin_textdomain( $this->locale , false, $plugin_dir );
        }

        // on init action
        function init(){    
            $this->init_metabox();
        }
        
        // custom columns
        function system_columns(){
            $columns = array(
                'cb' => '<input type="checkbox" />',
                'title' => __( 'Title' ),
            );

            $columns['ufname'] = 'First Name';
            $columns['ulname'] = 'Last Name';
            $columns['utitle'] = 'Title';
            $columns['uemail'] = 'Email';
            $columns['ucompany'] = 'Company';
            $columns['sfname'] = 'Subscriber First Name';
            $columns['slname'] = 'Subscriber Last Name';
            $columns['stitle'] = 'Subscriber Title';
            $columns['semail'] = 'Subscriber Email';
            
            foreach( $this->ind_assess_fields as $single ){
                $columns[sanitize_title( $single['title'] )] = $single['title'];
            }

            return $columns;
            
        }
        
        // columns output
        function custom_column_values( $column, $post_id ) {

            if ( in_array($column, $this->user_info_fields) ) {
                $current_array = get_post_meta( $post_id, 'assessee_user_data', true );
                echo $current_array[$column];
            } else {
                $current_array = unserialize( get_post_meta( $post_id, 'survey_result', true ) );
             
                foreach( $this->ind_assess_fields as $single ){
                    if( $column == sanitize_title( $single['title'] ) ){            
                        echo @implode( ',', $current_array[$this->counter] );
                        $this->counter++;
                        if( $this->counter >= count($this->ind_assess_fields) ){
                            $this->counter = 0;
                        }
                    }
                }
            }
        }
        

        // menu insertion
        function add_menu(){
 
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
                foreach( $this->ind_assess_fields as $single ){
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

        function init_metabox() {
            // init Assessee Data Metabox
            $meta_box = array(
                'title' => 'Assessee Data',
                'post_type' => 'survey',
                'position' => 'advanced',
                'place' => 'high'
            );

            $fields_parameters = array(
                array(
                    'type' => 'text',
                    'title' => 'Assessee First Name',
                    'name' => 'ufname',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Assessee Last Name',
                    'name' => 'ulname',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Assessee Title',
                    'name' => 'utitle',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Assessee Email',
                    'name' => 'uemail',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Assessee Company',
                    'name' => 'ucompany',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Subscriber First Name',
                    'name' => 'sfname',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Subscriber Last Name',
                    'name' => 'slname',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Subscriber Title',
                    'name' => 'stitle',
                ),
                array(
                    'type' => 'text',
                    'title' => 'Subscriber Email',
                    'name' => 'semail',
                ),
            );

            $new_metabox = new rsmAssesseeDataMetaBox( $meta_box, $fields_parameters); 

            // init Assessment Data Metabox
            $meta_box = array(
                'title' => 'Individual Assessment Results',
                'post_type' => 'survey',
                'position' => 'advanced',
                'place' => 'high'
            );
            $fields_parameters = array();   

            foreach( $this->ind_assess_fields as $single ){
                $fields_parameters[] = array(
                    'type' => 'text',
                    'title' => $single['title'],
                    'name' => sanitize_title( $single['title'] ),
                      
                );
            }
            
            $new_metabox = new rsmSurveyDataMetaBox( $meta_box, $fields_parameters);
        }
    }
}

// initiate main class
new rsmPsiuAssessment('wsp', array(
    'config.php',
    'modules/scripts.php',
    'modules/output.php',
    'modules/ajax.php',
    'modules/cpt.php',
    'modules/meta_box.php',
), dirname(__FILE__).'/' );

 
 
?>