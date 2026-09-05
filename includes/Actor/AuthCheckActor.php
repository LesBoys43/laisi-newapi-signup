<?php

namespace LaiSiSignup\Actor {

	use LaiSiSignup\Utils\AuthTrait;

	class AuthCheckActor extends Actor {
		use AuthTrait;

		public function checkPostcondition(): string|true {
			return true;
		}
		public function act(): ?array {
			return ["success" => $this->authCheck()];
		}
		public function checkPrecondition(): string|true {
			return true;
		}
	}
}
