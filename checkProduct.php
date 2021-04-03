<?php
 //create a connection to the database 
$connection = mysqli_connect('localhost', 'uts', 'internet', 'assignment1');
$data = file_get_contents( "php://input" ); //$data is now the string '[1,2,3]';

$data = json_decode( $data );
$result_array = array();
// validate to stock
for ($x = 0; $x < sizeof($data); $x++) {
    // TODO validate against total item bought not 0
  $query_string = "select * from products where product_id = ".$data[$x]." and in_stock > 0";
  $result = mysqli_query($connection, $query_string);
  $num_rows = mysqli_num_rows($result);
  if($num_rows == 0){ // no good: send alert 
      $result_array[$data[$x]] = false;
  } else {
      $result_array[$data[$x]] = true;
  }
}

//close the connection
mysqli_close($connection);
echo json_encode($result_array);
?>