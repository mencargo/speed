<?php
// Disable Compression (would be too easy for 000...)
@ini_set('zlib.output_compression', 'Off');
@ini_set('output_buffering', 'Off');
@ini_set('output_handler', '');
// Headers
header( "HTTP/1.1 200 OK" );
// Download follows...
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename=random.dat'); 
header('Content-Transfer-Encoding: binary');
// Never cache me
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
// Generate data
$data=str_repeat("0",1048575)."\n"; 
// Deliver chunks of 1048576 bytes (or more - depending on encoding!)
while(1){
    echo $data;
    flush();
}
?>