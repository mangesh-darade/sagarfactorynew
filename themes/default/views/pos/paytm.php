<html>
<head>
<title>Paytm Merchant Check Out Page</title>
</head>
<body>
	<center><h1>Please do not refresh this page...</h1></center>
	<form method="post" action="<?php echo $PAYTM_TXN_URL ?>" name="f1">
		<table border="1">
                    <tbody>
			<?php
			foreach($paramList as $name => $value) {
                            echo '<input type="hidden" name="' . $name .'" value="' . $value . '">';
			}
			?>
			<input type="hidden" name="CHECKSUMHASH" value="<?php echo $CHECKSUMHASH ?>" />
                    </tbody>
		</table>
		<script type="text/javascript">
			document.f1.submit();
		</script>
	</form>
</body>
</html>