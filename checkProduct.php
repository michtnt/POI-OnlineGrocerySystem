<?php
 //create a connection to the database 
$connection = mysqli_connect('aa8ztw4n1fj778.c3tev0rhcmii.us-east-1.rds.amazonaws.com', 'uts', 'internet', 'assignment1');
// get JSON.stringify data from js
$data = file_get_contents( "php://input" );
// decode the JSON
$object = json_decode($data, true);
// initialise array
$result_array = array();

// itereate on the data
for($x=0; $x<= sizeof($object);$x++){
    foreach ($object[$x] as $key => $value) { // key is product id, and value is quantity bought
        // echo "{$key} => {$value} ";
        // validate if the quantity bought doesnt surpass the in_stock 
        $query_string = "select * from products where product_id = ".$key." and in_stock > ".$value;
        $result = mysqli_query($connection, $query_string);
        $num_rows = mysqli_num_rows($result);
        if($num_rows == 0){ // if not in stock label the product as false 
            $result_array[$key] = false;
        } else { // if in stock label as true
            $result_array[$key] = true;
        }
    }
}
//close the connection
mysqli_close($connection);
// return the product code and their availability
echo json_encode($result_array);
?>