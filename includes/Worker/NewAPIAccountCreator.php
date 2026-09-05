<?php

namespace LaiSiSignup\Worker {

	use GuzzleHttp\Client;

	class NewAPIAccountCreator {
		public static function create(string $username, string $password, string $displayName) {
			/** @var string */
			global $lsNewAPIBase;
			/** @var string */
			global $lsNewAPIToken;
			$client = new Client([
				"base_uri" => $lsNewAPIBase
			]);
			$client->post("/api/user", [
				"headers" => [
					"Authorization" => $lsNewAPIToken
				],
				"json" => [
					"username" => $username,
					"password" => $password,
					"display_name" => $displayName,
				]
			]);
			$id = json_decode($client->get("/api/user/search?keyword=$username&page_size=1&p=1", [
				"headers" => [
					"Authorization" => $lsNewAPIToken
				]
			])->getBody()->getContents(), true)['data']['items'][0]['id'];
			$client->put("/api/user", [
				"headers" => [
					"Authorization" => $lsNewAPIToken
				],
				"json" => [
					"id" => $id,
					"group" => "user",
					"username" => $username,
					"display_name" => $displayName
				]
			]);
		}
	}
}
