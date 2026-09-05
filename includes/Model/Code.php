<?php

namespace LaiSiSignup\Model {
	use LaiSiSignup\Db\Db;

	class Code {

		private function __construct(
			public int $id,
			public string $code,
			public int $quota,
			public int $usage_count
		) {
		}

		/**
		 * New empty code
		 *
		 * @return Code The Code object
		 */
		public static function newEmpty(): self {
			return new self(-1, "", 0, 0);
		}

		/**
		 * New from specified field
		 *
		 * @param string $key The key want to query from
		 * @param mixed $val The target value
		 * @return ?self The Code object (may null)
		 */
		private static function newFrom(string $key, mixed $val): ?self {
			$db = Db::singleton()->acquireConnection();

			$result = pg_fetch_assoc(pg_query_params($db, "SELECT * FROM codes WHERE $key = $1", [$val]));

			if (!$result) return null;
			else return new self($result["id"], $result["code"], $result["quota"], $result["usage_count"]);
		}

		/**
		 * New from id field
		 *
		 * @param int $id The target ID
		 * @return ?self The Code object (may null)
		 */
		public static function newFromId(int $id): ?self {
			return self::newFrom("id", $id);
		}

		/**
		 * New from code field
		 *
		 * @param string $code The target code
		 * @return ?self The Code object (may null)
		 */
		public static function newFromCode(string $code): ?self {
			return self::newFrom("code", $code);
		}

		/**
		 * List all codes
		 *
		 * @param int $start Start of listing
		 * @param int $limit Maximum return count
		 * @return Code[] Code objects
		 */
		public static function listCodes(int $start = 1, int $limit = 10): array {
			$results = [];

			while ($start++ < $limit) $results[] = self::newFromId($start - 1);

			return array_filter($results, fn ($value) => !is_null($value));
		}

		/**
		 * Generate a new random code and fill it
		 *
		 * @return void
		 */
		public function generateCode(): void {
			$this->code = bin2hex(random_bytes(24));
		}

		/**
		 * Check this code is consumable or not
		 *
		 * @return bool
		 */
		public function checkConsumable(): bool {
			return $this->usage_count < $this->quota || $this->quota < 0;
		}

		/**
		 * Consume this code one time
		 *
		 * @return void
		 */
		public function consume(): void {
			$this->usage_count++;
		}

		/**
		 * Persist
		 *
		 * @return void
		 */
		public function save(): void {
			$db = Db::singleton()->acquireConnection();

			$isNew = $this->id < 0;

			if ($isNew) {
				$sql = "INSERT INTO codes (code, quota, usage_count) VALUES ($1, $2, $3) RETURNING id";
				$data = [$this->code, $this->quota, $this->usage_count];

				$result = pg_fetch_assoc(pg_query_params($db, $sql, $data));

				$this->id = $result["id"];
			} else {
				$sql = "UPDATE codes SET code = $1, quota = $2, usage_count = $3 WHERE id = $4";
				$data = [$this->code, $this->quota, $this->usage_count, $this->id];

				pg_query_params($db, $sql, $data);
			}
		}
	}
}
