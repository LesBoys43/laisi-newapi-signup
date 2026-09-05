<?php
namespace LaiSiSignup\Query\List {

	use LaiSiSignup\Model\Code;
	use LaiSiSignup\Query\QueryHandler;
	use LaiSiSignup\Utils\AuthTrait;

	class AllCodesListHandler extends QueryHandler {
		use AuthTrait;

		public function query(): ?array {
			if (!$this->authCheck()) {
				return ["error" => "Unauthorized"];
			}
			$props = explode("|", $this->args["acprop"] ?? "id|code");
			$start = intval($this->args["acstart"] ?? 1);
			$limit = intval($this->args["aclimit"] ?? 10);
			$data = array_values(array_map('get_object_vars', Code::listCodes($start, $limit)));
			return array_map(fn ($entry) => array_filter($entry, fn ($key) => in_array($key, $props), ARRAY_FILTER_USE_KEY), $data);
		}
	}
}
