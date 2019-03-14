<?php
if( !class_exists('rsmCPT') ){
	class rsmCPT{
		
		var $parameters;
		var $post_type;
		
		function __construct( $in_parameters, $post_type ){
			$this->parameters = $in_parameters;
			$this->post_type = $post_type;
		 
			add_action( 'init', array( $this, 'add_post_type' ), 1 );
			register_activation_hook( __FILE__, array( $this, 'add_post_type' ) );	 
			register_activation_hook( __FILE__, 'flush_rewrite_rules' );
		}
		function add_post_type(){
			register_post_type( $this->post_type, $this->parameters );
		}
 
	}
}


if( !class_exists('rsmTax') ){
	class rsmTax{
		
		var $parameters;
		var $post_type;
		var $tax_slug;
		
		function __construct( $tax_slug, $post_type, $in_parameters  ){
			$this->parameters = $in_parameters;
			$this->post_type = $post_type;
			$this->tax_slug = $tax_slug;
		 
			add_action( 'init', array( $this, 'register_taxonomy' ), 2  );
			register_activation_hook( __FILE__, array( $this, 'register_taxonomy' ) );	 
			//register_activation_hook( __FILE__, 'flush_rewrite_rules' );
		}
		function register_taxonomy(){
	
			register_taxonomy( $this->tax_slug, $this->post_type, $this->parameters );
		}
		 
	}
}


$labels = array(
    'name' => __('Survey Entry', $this->locale),
    'singular_name' => __('Survey Entry', $this->locale),
    'add_new' => __('Add New', $this->locale),
    'add_new_item' => __('Add New Survey Entry', $this->locale),
    'edit_item' => __('Edit Survey Entry', $this->locale),
    'new_item' => __('New Survey Entry', $this->locale),
    'all_items' => __('All Survey Entries', $this->locale),
    'view_item' => __('View Survey Entry', $this->locale),
    'search_items' => __('Search Survey Entry', $this->locale),
    'not_found' =>  __('No Survey Entries found', $this->locale),
    'not_found_in_trash' => __('No Survey Entries found in Trash', $this->locale), 
    'parent_item_colon' => '',
    'menu_name' => __('Survey Entry', $this->locale)

  );
  $args = array(
    'labels' => $labels,
    'public' => false,
    'publicly_queryable' => false,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
    'has_archive' => true, 
    'hierarchical' => false,
    'menu_position' => null,
    'supports' => array( 'title', /* 'custom-fields' 'editor' , 'thumbnail', 'excerpt', 'custom-fields'   'custom-fields' 'custom-fields'  'editor', 'thumbnail', 'custom-fields'  'author', , 'custom-fields', 'editor'  */)
  ); 

 
$new_pt = new rsmCPT( $args, 'survey' );

 


?>