<?php

namespace LaiSiSignup\Actor {
	abstract class Actor {
		public function __construct(
			protected array $args
		) {
		}

		abstract public function checkPrecondition(): string|true;
		abstract public function act(): ?array;
		abstract public function checkPostcondition(): string|true;
	}
}
