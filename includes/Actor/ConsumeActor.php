<?php

namespace LaiSiSignup\Actor {
	use LaiSiSignup\Model\Code;
	use LaiSiSignup\Worker\NewAPIAccountCreator;

	class ConsumeActor extends Actor {
		public function checkPostcondition(): string|true {
			return isset($this->args["code"]);
		}
		public function act(): ?array {
			$code = Code::newFromCode($this->args["code"]);
			if (!$code) return ["error" => "Code does not exists"];
			elseif (!$code->checkConsumable()) return ["error" => "Ran out of code quota"];
			else {
				$code->consume();
				$code->save();
				$username = substr(uniqid(), 0, 10);
				$password = bin2hex(random_bytes(6));
				NewAPIAccountCreator::create($username, $password, $this->args["name"] ?: $username);
				return ["username" => $username, "password" => $password];
			}
		}
		public function checkPrecondition(): string|true {
			return true;
		}
	}
}
