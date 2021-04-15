<?php

    $to = "nimsanduk@gmail.com";
    $from = $_REQUEST['email'];
    $name = $_REQUEST['name'];
    $subject = $_REQUEST['subject'];
    $number = $_REQUEST['number'];
    $cmessage = $_REQUEST['message'];

    $headers = "From: $from";
	$headers = "From: " . $from . "\r\n";
	$headers .= "Reply-To: ". $from . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    $subject = "You have a message from your Bitmap Photography.";

    $logo = 'img/logo.png';
    $link = '#';

	$body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Express Mail</title></head><body>";
	$body .= "<table style='width: 100%;'>";
	$body .= "<thead style='text-align: center;'><tr><td style='border:none;' colspan='2'>";
	$body .= "<a href='{$link}'><img src='{$logo}' alt=''></a><br><br>";
	$body .= "</td></tr></thead><tbody><tr>";
	$body .= "<td style='border:none;'><strong>Name:</strong> {$name}</td>";
	$body .= "<td style='border:none;'><strong>Email:</strong> {$from}</td>";
	$body .= "</tr>";
	$body .= "<tr><td style='border:none;'><strong>Subject:</strong> {$csubject}</td></tr>";
	$body .= "<tr><td></td></tr>";
	$body .= "<tr><td colspan='2' style='border:none;'>{$cmessage}</td></tr>";
	$body .= "</tbody></table>";
	$body .= "</body></html>";

    $send = mail($to, $subject, $body, $headers);

?>
<?php
/*
 *  CONFIGURE EVERYTHING HERE
 */



// an email address that will receive the email with the output of the form
$sendTo = 'bathiya@jpl.lk';






// message that will be displayed when everything is OK :)
$okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';

// If something goes wrong, we will display this message.
$errorMessage = 'There was an error while submitting the form. Please try again later';


/*
 *  LET'S DO THE SENDING
 */

// if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
error_reporting( E_ALL & ~E_NOTICE );

try {

	if ( count( $_POST ) == 0 && ! isset($_POST['name'])&& ! isset($_POST['email'])&& ! isset($_POST['message'])&& ! isset($_POST['subject'])&& ! isset($_POST['number'])) {
		throw new \Exception( 'Form is empty' );
	}

    $from = $_REQUEST['email'];
    $name = $_REQUEST['name'];
    $subject = $_REQUEST['subject'];
    $number = $_REQUEST['number'];
    $cmessage = $_REQUEST['message'];



	$headers = 'From: ' . $from . "\r\n" .
	           'Reply-To: ' . $sendTo . "\r\n" .
	           'X-Mailer: PHP/' . phpversion();



	// Send email
	mail( $emai, $subject, $message, $name, $number );

	$responseArray = array('type' => 'success', 'message' => $okMessage);
} catch ( \Exception $e ) {
	 $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}


// if requested by AJAX request return JSON response
if ( ! empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) == 'xmlhttprequest' ) {
	$encoded = json_encode( array( 'status' => true, 'message' => $okMessage ) );

	header( 'Content-Type: application/json' );

	echo $encoded;
} // else just display the message
else {
	$encoded = json_encode( array( 'status' => false, 'message' => $errorMessage ) );

	header( 'Content-Type: application/json' );

	echo $encoded;
}
