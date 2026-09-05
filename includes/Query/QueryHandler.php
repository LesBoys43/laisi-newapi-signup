<?php

namespace LaiSiSignup\Query {
	abstract class QueryHandler {
		public function __construct(
			protected array $args
		) {
		}

		abstract public function query(): ?array;
	}
}
