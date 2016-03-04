<?php
header( "HTTP/1.1 200 OK" );
$data=str_repeat("0",1048576);
while(1){
	echo $data;
	flush();
}

?>