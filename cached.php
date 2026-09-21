<?php

require "vendor/autoload.php";

if (!isset($_GET["file"])) http_response_code(404);
elseif (str_contains($_GET["file"], "..") || str_contains($_GET["file"], "%")) http_response_code(403);
elseif (!str_ends_with($_GET["file"], ".js") && !str_ends_with($_GET["file"], ".css")) http_response_code(403);
elseif (!file_exists(__DIR__ . "/build/" . $_GET["file"])) http_response_code(404);
else {
	header("Cache-Control: public, max-age=1209600, s-maxage=1209600");
	header("Content-Type: " . (str_ends_with($_GET["file"], ".js") ? "application/javascript" : "text/css"));
	die(file_get_contents(__DIR__ . "/build/" . $_GET["file"]));
}
