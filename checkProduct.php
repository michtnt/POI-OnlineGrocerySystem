<?php
 //create a connection to the database 
$connection = mysqli_connect('localhost', 'uts', 'internet', 'assignment1');
$data = file_get_contents( "php://input" ); //$data is now the string '[1,2,3]';

$data = json_decode( $data ); //$data is now a php array array(1,2,3)

// TODO:
// validate to stock
// all good: move to payment page
// no good: send alert 

//close the connection
mysqli_close($connection);

?>