<?php

test('the application returns a successful response', function () {
    $response = $this->getJson('/up');

    $response->assertStatus(200);
});
