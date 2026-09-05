<?php

require __DIR__ . "/vendor/autoload.php";

define("LaiSiAISignup", 1);

require "Settings.php";

use LaiSiSignup\APIEntry;

APIEntry::startup();
