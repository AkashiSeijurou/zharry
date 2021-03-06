<?php
	
	require "connection.php";
	
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Winnipeg Railway Museum</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
  </head>
  <body>
    <!--Navbar-->
    <nav class="navbar navbar-default">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.php"><img src="img/newlogo.png" id="navlogo" onmouseout="retractLogo();" onmouseover="expandLogo()" style="height: calc(100% + 24px); margin: -12px" class="navlogo"></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li><a href="index.php">Home</a></li>
            <li><a href="events.php">Events</a></li>
            <li class="active"><a href="tickets.php">Tickets<span class="sr-only">(current)</span></a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Info<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Location</a></li>
                <li><a href="#">Hours & Admission</a></li>
                <li><a href="#">Locomotives</a></li>
                <li><a href="#">Rolling Stock</a></li>
                <li><a href="#">Maintenance of Way</a></li>
                <li><a href="#">Other Equipment</a></li>
                <li><a href="#">Displays</a></li>
                <li><a href="#">Gift Shop</a></li>
                <li><a href="admin">Admin Panel</a></li>
              </ul>
            </li>
          </ul>
          <form class="navbar-form navbar-right" role="search">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
            <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
          </form>
        </div>
      </div>
    </nav>
    
    <!--Body-->
    <div class="container">
        <div class="row">
        <br/>
        <br/>
		<?php
		
			if ((!isset($_GET["name"]) && !isset($_GET["date"]))) {
				echo "<p style=\"font-size: 22px; text-align: center;\">Please select an event from the <a href=\"events.php\">Events Page</a>.</p>";
			} else {
				echo "<p style=\"font-size: 24px;\">Event Name: " . $_GET["name"] . "</p>";
				echo "<p style=\"font-size: 24px;\">For Date: " . $_GET["date"] . "</p>";
		?>
            <div class="col-md-8">
                <p style="font-size: 24px;">Purchase Ticket</p>
                <p><i>* means required!</i></p>
                <form action="confirmPurchase.php" method="post" id="purchaseForm">
				<?php
                    echo "<input type=\"hidden\" name=\"purchase\" value=\"true\" required>";
                    echo "<input type=\"hidden\" name=\"eventID\" value=\"" . $_GET["id"] . "\" required>";
                    echo "<input type=\"hidden\" name=\"eventName\" value=\"" . $_GET["name"] . "\" required>";
                    echo "<input type=\"hidden\" name=\"eventDate\" value=\"" . $_GET["date"] . "\" required>";
				?>
                  <div class="form-group">
                    <label for="surname">Surname <i>*</i></label>
                    <input type="text" class="form-control" name="surname" id="surname" placeholder="" required>
                  </div>
                  <div class="form-group">
                    <label for="forename">Forename <i>*</i></label>
                    <input type="text" class="form-control" name="forename" id="forename" placeholder="" required>
                  </div>
                  <div class="form-group">
                    <label for="email">Email <i>*</i></label>
                    <input type="email" class="form-control" name="email" id="email" placeholder="" required>
                  </div>
                    
                  <hr/>
                    
                  <div class="form-group">
                    <label for="address">Mailing/Billing Address <i>*</i></label>
                    <input type="text" class="form-control" name="address" id="address" placeholder="" required>
                  </div>
                  <div class="form-group">
                    <label for="city">City <i>*</i></label>
                    <input type="text" class="form-control" name="city" id="city" placeholder="" required>
                  </div>
                  <div class="form-group">
                    <label for="province">Province <i>*</i></label>
                    <input type="text" class="form-control" name="province" id="province" placeholder="" required>
                  </div>
                  <div class="form-group">
                    <label for="postal">Postal Code <i>*</i></label>
                    <input type="text" class="form-control" name="postal" id="postal" placeholder="" required>
                  </div>
                    
                  <hr/>
                    
                  <div class="form-group">
                    <label for="card">Credit/Debit Card Number <i>*</i></label>
                    <input type="text" class="form-control" name="card" id="card" placeholder="" required>
                  </div>
                    
                  <hr/>
                    
                  <p style="font-size: 18px;">Number of Tickets to purchase:  <i>*</i></p>
                  <div class="form-group">
                    <label for="adults">Adults: ($10.00 per Ticket)</label>
                    <input type="number" class="form-control" name="adults" id="adults" value="0" min="0" required>
                  </div>
                  <div class="form-group">
                    <label for="children">Children: ($8.00 per Ticket)</label>
                    <input type="number" class="form-control" name="children" id="children" value="0" min="0"  required>
                  </div>
                  <div class="form-group">
                    <label for="seniors">Seniors: ($8.00 per Ticket)</label>
                    <input type="number" class="form-control" name="seniors" id="seniors" value="0" min="0"  required>
                  </div>
                    
                  <hr/>
                  
                  <div class="form-group">
                    <label>Ticket Type</label>
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" name="type" id="type"> Physical Ticket (+$5.00)
                      </label>
                    </div>
                      <p class="help-block"><i>By default, we will email an electronic copy of your ticket.</i></p>
                  </div>
                    
                  <hr/>
                    
                  <div class="form-group">
                    <div id="total">Total: $0.00</div>
                  </div>
                    
                  <input type="submit" class="btn btn-default"/>
                </form>
            </div>
            <div class="col-md-4">
            </div>
			
		<?php
			}
		?>
        </div>
    </div>

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/script.js"></script>
    <script src="js/checkTotal.js"></script>
  </body>
</html>