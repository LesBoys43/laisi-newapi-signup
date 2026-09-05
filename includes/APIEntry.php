<?php

namespace LaiSiSignup {
	use LaiSiSignup\Actor\Actor;

	class APIEntry {
		private static function serialize(array $data, string $format = "json"): string {
			switch ($format) {
				case "json":
					return json_encode($data, JSON_UNESCAPED_UNICODE);
				case "php":
					return serialize($data);
				default:
					return "";
			}
		}
		private static function sanitizeAction(string $raw): string {
			return str_replace('_', '', ucwords($raw, '_'));
		}
		public static function startup() {
			$args = array_merge($_GET, json_decode(file_get_contents("php://input"), true) ?: []);
			$format = $args["format"] ?? "json";
			if (!isset($args["action"])) {
				die(self::serialize(["error" => "'action' must be provided"], $format));
			}
			$action = $args["action"];
			if (!file_exists(__DIR__ . "/Actor/" . self::sanitizeAction($action) . "Actor.php")) {
				die(self::serialize(["error" => "Unknown 'action' provided"], $format));
			}
			$clazz = "LaiSiSignup\\Actor\\" . self::sanitizeAction($action) . "Actor";
			/** @var Actor */
			$actor = new $clazz($args);
			$precondPass = $actor->checkPrecondition();
			if ($precondPass !== true) {
				die(self::serialize(["error" => $precondPass], $format));
			}
			$result = ["data" => $actor->act()];
			$postcondPass = $actor->checkPostcondition();
			if ($postcondPass !== true) {
				die(self::serialize(["error" => $postcondPass], $format));
			}
			die(self::serialize($result, $format));
		}
	}
}
