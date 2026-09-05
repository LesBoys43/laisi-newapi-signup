<?php

namespace LaiSiSignup\Actor {

	use LaiSiSignup\Model\Code;
	use LaiSiSignup\Utils\AuthTrait;

	class RevokeCodeActor extends Actor {
		use AuthTrait;

		public function checkPrecondition(): string|true {
			if (!$this->authCheck()) return "Unauthorized";
			return true;
		}
		public function act(): ?array {
			$code = Code::newFromId($this->args["id"]);
			if (!$code) return ["error" => "Code does not exists"];
			$code->quota = 0;
			$code->usage_count = 0;
			$code->save();
			return ["success" => true];
		}
		public function checkPostcondition(): string|true {
			return true;
		}
	}
}
