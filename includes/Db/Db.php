<?php

namespace LaiSiSignup\Db {

	class Db {
		/**
		 * Database instance
		 */
		private static Db $instance;

		/**
		 * DSN to connect
		 */
		private string $dsn;

		/**
		 * Connection, reused in a single request
		 */
		private \PgSql\Connection $conn;

		/**
		 * Constructor
		 *
		 * @internal
		 */
		private function __construct(string $dsn) {
			$this->dsn = $dsn;
		}

		/**
		 * Generate the DSN from configs
		 *
		 * @internal
		 */
		private static function getDSN(): string {
			/** @var string */
			global $lsDatabaseHost;
			/** @var string */
			global $lsDatabasePort;
			/** @var string */
			global $lsDatabaseDB;
			/** @var string */
			global $lsDatabaseUser;
			/** @var string */
			global $lsDatabasePass;
			return "host=$lsDatabaseHost port=$lsDatabasePort dbname=$lsDatabaseDB user=$lsDatabaseUser password=$lsDatabasePass";
		}

		/**
		 * Get the singleton of database
		 */
		public static function singleton(): Db {
			self::$instance ??= new self(self::getDSN());
			return self::$instance;
		}

		/**
		 * Get the connection
		 */
		public function acquireConnection(): \PgSql\Connection {
			$this->conn ??= pg_connect($this->dsn);

			return $this->conn;
		}
	}
}
