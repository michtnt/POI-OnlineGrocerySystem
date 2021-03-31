<?php

 //create a connection to the database 
$connection = mysqli_connect('localhost', 'uts', 'internet', 'assignment1');
$query_string = "select * from products where product_id = ".$_GET["code"];

//run the query and assign the return values to $result
$result = mysqli_query($connection, $query_string);

//check the number of records returned using $num_rows
$num_rows = mysqli_num_rows($result);

//check if the $num_rows has values
if ($num_rows > 0 ) {
 	//add while loop to fetch the values using mysqli_fetch_assoc
  while( $a_row = mysqli_fetch_assoc($result) ){
     $product="<p>Name: ".$a_row[product_name]."</p>";
     $product=$product."\n"."<p>Price: ".$a_row[unit_price]."</p>";
     $product=$product."\n"."<p>Type: ".$a_row[unit_quantity]."</p>";
     $product=$product."\n"."<p>Stock:".$a_row[in_stock]."</p>";
  }
}

//close the connection
mysqli_close($connection);
echo json_encode($product);

?>