<?php

namespace LaiSiSignup\Actor {
	use LaiSiSignup\Query\QueryHandler;

	const QUERY_CLASSES = ["prop", "list", "meta", "generator"];
	class QueryActor extends Actor {
		/**
		 * Convert user-input key to internal class part
		 *
		 * @param string $raw User-input key
		 * @return string Converted key
		 */
		private function sanitizeKey(string $raw): string {
			return str_replace('_', '', ucwords($raw, '_'));
		}
		/**
		 * @return bool|string
		 */
		public function checkPrecondition(): string|true {
			if (!array_any(QUERY_CLASSES, fn ($type) => in_array($type, array_keys($this->args)))) {
				return "You must provided one of 'prop', 'list', 'meta' or 'generator'";
			}
			foreach (QUERY_CLASSES as $class) {
				$keys = array_filter(explode("|", $this->args[$class] ?? ""), fn ($key) => strlen($key) > 0);
				if (!count($keys)) continue;
				if (array_any(
					$keys,
					fn ($key) =>
						!file_exists(
							sprintf(
								"%s/query/%s/%s%sHandler.php",
								__DIR__ . "/..",
								$class,
								self::sanitizeKey($key),
								ucfirst($class)
							)
						)
					)
				) {
					return "One of requested key does not exists";
				}
			}
			return true;
		}
		/**
		 * @return array<array>
		 */
		public function act(): ?array {
			$result = [];
			foreach (QUERY_CLASSES as $class) {
				$keys = array_filter(explode("|", $this->args[$class] ?? ""), fn ($key) => strlen($key) > 0);
				if (!count($keys)) continue;
				$result[$class] = [];
				foreach ($keys as $key) {
					$clazz = "LaiSiSignup\\Query\\" . ucfirst($class) . "\\" . self::sanitizeKey($key) . ucfirst($class) . "Handler";
					/** @var QueryHandler */
					$handler = new $clazz($this->args);
					$result[$class][$key] = $handler->query() ?? ["error" => true];
				}
			}
			return $result;
		}
		/**
		 * @return bool
		 */
		public function checkPostcondition(): string|true {
			return true;
		}
	}
}
