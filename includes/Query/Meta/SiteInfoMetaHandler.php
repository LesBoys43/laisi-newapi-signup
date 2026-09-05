<?php

namespace LaiSiSignup\Query\Meta {

	use LaiSiSignup\Query\QueryHandler;

	class SiteInfoMetaHandler extends QueryHandler {
		public function query(): ?array {
			/** @var string $lsSiteTitle */
			global $lsSiteTitle;
			return [
				"title" => $lsSiteTitle
			];
		}
	}
}
