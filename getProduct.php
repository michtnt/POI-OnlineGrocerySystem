<?php

//create a connection to the database 
$connection = mysqli_connect('localhost', 'uts', 'internet', 'assignment1');
// get specific product based on the code
$query_string = "select * from products where product_id = ".$_GET["code"];
//run the query and assign the return values to $result
$result = mysqli_query($connection, $query_string);

//check the number of records returned using $num_rows
$num_rows = mysqli_num_rows($result);

//check if the $num_rows has values
if ($num_rows > 0 ) {
 	//add while loop to fetch the values using mysqli_fetch_assoc
  while( $a_row = mysqli_fetch_assoc($result) ){
     $product="
     <table style='justify-content:center;'>
      <tr>
        <td>Product ID</td>
        <td>$a_row[product_id]</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>$a_row[product_name]</td>
      </tr
      <tr>
        <td>Price</td>
        <td id='product-unit-price'>$a_row[unit_price]</td>
      </tr>
      <tr>
        <td>Quantity</td>
        <td>$a_row[unit_quantity]</td>
      </tr>
      <tr>
        <td>Stock</td>
        <td>$a_row[in_stock]</td>
      </tr>
     </table>
     ";
  }
}

//close the connection
mysqli_close($connection);
echo $product;

?>