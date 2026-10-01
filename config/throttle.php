<?php

return [

    'login' => env('THROTTLE_LOGIN', '5,1'),
    'register' => env('THROTTLE_REGISTER', '3,1'),
    'api' => env('THROTTLE_API', '60,1'),
];
