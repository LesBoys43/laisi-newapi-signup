<?php

namespace LaiSiSignup\Actor {

	use LaiSiSignup\Model\Code;
	use LaiSiSignup\Utils\AuthTrait;

	class GenerateCodeActor extends Actor {
		use AuthTrait;

		public function checkPostcondition(): string|true {
			if (!$this->authCheck()) return "Unauthorized";
			return true;
		}
		public function act(): ?array {
			$quota = intval($this->args["quota"] ?? -1);
			$code = Code::newEmpty();
			$code->generateCode();
			$code->quota = $quota;
			$code->save();
			return ["code" => $code->code];
		}
		public function checkPrecondition(): string|true {
			return true;
		}
	}
}
