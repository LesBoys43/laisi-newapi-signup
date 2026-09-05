<?php

namespace LaiSiSignup\Utils {
	trait AuthTrait {
		protected function authCheck() {
			/** @var string */
			global $lsAdminPassword;
			return (getallheaders()["Authorization"] ?? "") == $lsAdminPassword;
		}
	}
}
